<?php

namespace Tundua\Middleware;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Tundua\Observability\SimpleTracer;

/**
 * OpenTelemetry-aware tracing middleware for Slim 4.
 *
 * Behaviour:
 *  1. If the OpenTelemetry SDK is installed AND OTEL_EXPORTER_ENDPOINT is set,
 *     traces are exported via OTLP/HTTP using the SDK.
 *  2. Otherwise, spans are collected by the built-in SimpleTracer and either:
 *     a. Written to storage/logs/traces.log  (when OTEL_LOG_TRACES=true), or
 *     b. Silently discarded (when tracing is disabled / no exporter).
 *
 * The middleware is designed to be the outermost layer so that it captures the
 * full request lifecycle, including time spent in other middleware.
 */
class TracingMiddleware
{
    private bool $enabled;
    private string $serviceName;
    private ?string $exporterEndpoint;
    private bool $logTraces;
    private string $logPath;

    public function __construct()
    {
        $this->enabled          = filter_var($_ENV['OTEL_ENABLED'] ?? 'false', FILTER_VALIDATE_BOOLEAN);
        $this->serviceName      = $_ENV['OTEL_SERVICE_NAME'] ?? 'tundua-api';
        $this->exporterEndpoint = !empty($_ENV['OTEL_EXPORTER_ENDPOINT'])
            ? $_ENV['OTEL_EXPORTER_ENDPOINT']
            : null;
        $this->logTraces        = filter_var($_ENV['OTEL_LOG_TRACES'] ?? 'false', FILTER_VALIDATE_BOOLEAN);
        $this->logPath          = dirname(__DIR__, 2) . '/storage/logs/traces.log';
    }

    /**
     * Invoke middleware.
     */
    public function __invoke(Request $request, RequestHandler $handler): Response
    {
        // Short-circuit when tracing is turned off entirely.
        if (!$this->enabled) {
            return $handler->handle($request);
        }

        // ----- Determine trace context from incoming request -----
        $parentSpanId = null;
        $traceId      = null;

        $traceparent = $request->getHeaderLine('traceparent');
        if ($traceparent !== '' && preg_match('/^00-([a-f0-9]{32})-([a-f0-9]{16})-/', $traceparent, $m)) {
            $traceId      = $m[1];
            $parentSpanId = $m[2];
        }

        // ----- Try the OpenTelemetry SDK path first -----
        if ($this->exporterEndpoint !== null && $this->otelSdkAvailable()) {
            return $this->handleWithOtelSdk($request, $handler, $traceId, $parentSpanId);
        }

        // ----- Fallback: SimpleTracer -----
        return $this->handleWithSimpleTracer($request, $handler, $traceId, $parentSpanId);
    }

    // ------------------------------------------------------------------
    // SimpleTracer path (zero external dependencies)
    // ------------------------------------------------------------------

    private function handleWithSimpleTracer(
        Request $request,
        RequestHandler $handler,
        ?string $traceId,
        ?string $parentSpanId,
    ): Response {
        $tracer = new SimpleTracer($this->serviceName);
        $method = $request->getMethod();
        $uri    = (string) $request->getUri();
        $route  = $this->resolveRoute($request);

        $span = $tracer->startSpan("HTTP {$method} {$route}", [
            'http.method' => $method,
            'http.url'    => $uri,
            'http.route'  => $route,
        ], $parentSpanId, $traceId);

        try {
            $response = $handler->handle($request);

            $tracer->setAttribute($span, 'http.status_code', $response->getStatusCode());
            $tracer->endSpan($span, $response->getStatusCode() >= 500 ? 'ERROR' : 'OK');
        } catch (\Throwable $e) {
            $tracer->addEvent($span, 'exception', [
                'exception.type'    => get_class($e),
                'exception.message' => $e->getMessage(),
                'exception.stacktrace' => $e->getTraceAsString(),
            ]);
            $tracer->setAttribute($span, 'http.status_code', 500);
            $tracer->endSpan($span, 'ERROR');

            $this->exportSimpleSpans($tracer);

            throw $e;
        }

        $this->exportSimpleSpans($tracer);

        return $response;
    }

    /**
     * Write SimpleTracer spans to the configured destination.
     */
    private function exportSimpleSpans(SimpleTracer $tracer): void
    {
        if ($this->logTraces) {
            $tracer->exportToFile($this->logPath);
            return;
        }

        // When an OTLP endpoint is set but the SDK is not installed,
        // fall back to a plain HTTP POST of the JSON payload.
        if ($this->exporterEndpoint !== null) {
            $this->sendSpansViaHttp($tracer);
            return;
        }

        // No exporter and log-traces disabled -- silently discard.
    }

    /**
     * Best-effort HTTP export of spans when the SDK is absent.
     * Uses a non-blocking approach so it does not slow down the response.
     */
    private function sendSpansViaHttp(SimpleTracer $tracer): void
    {
        $payload = $tracer->toJson();
        $url     = rtrim($this->exporterEndpoint, '/') . '/v1/traces';

        $context = stream_context_create([
            'http' => [
                'method'  => 'POST',
                'header'  => "Content-Type: application/json\r\n",
                'content' => $payload,
                'timeout' => 2,
                'ignore_errors' => true,
            ],
        ]);

        // Fire-and-forget; suppress errors so tracing never breaks the app.
        @file_get_contents($url, false, $context);
    }

    // ------------------------------------------------------------------
    // OpenTelemetry SDK path (when the SDK packages are installed)
    // ------------------------------------------------------------------

    private function otelSdkAvailable(): bool
    {
        return class_exists(\OpenTelemetry\SDK\Trace\TracerProvider::class);
    }

    /**
     * Handle the request using the full OpenTelemetry SDK.
     *
     * @codeCoverageIgnore -- only runs when SDK is installed
     */
    private function handleWithOtelSdk(
        Request $request,
        RequestHandler $handler,
        ?string $traceId,
        ?string $parentSpanId,
    ): Response {
        // The SDK auto-configures from OTEL_* environment variables.
        $tracerProvider = \OpenTelemetry\SDK\Trace\TracerProviderFactory::create()->build();
        $tracer = $tracerProvider->getTracer($this->serviceName);

        $method = $request->getMethod();
        $route  = $this->resolveRoute($request);

        $spanBuilder = $tracer->spanBuilder("HTTP {$method} {$route}")
            ->setAttribute('http.method', $method)
            ->setAttribute('http.url', (string) $request->getUri())
            ->setAttribute('http.route', $route);

        $span = $spanBuilder->startSpan();
        $scope = $span->activate();

        try {
            $response = $handler->handle($request);

            $span->setAttribute('http.status_code', $response->getStatusCode());
            if ($response->getStatusCode() >= 500) {
                $span->setStatus(\OpenTelemetry\API\Trace\StatusCode::STATUS_ERROR);
            } else {
                $span->setStatus(\OpenTelemetry\API\Trace\StatusCode::STATUS_OK);
            }
        } catch (\Throwable $e) {
            $span->recordException($e);
            $span->setStatus(\OpenTelemetry\API\Trace\StatusCode::STATUS_ERROR, $e->getMessage());
            $span->setAttribute('http.status_code', 500);
            $span->end();
            $scope->detach();
            $tracerProvider->shutdown();
            throw $e;
        }

        $span->end();
        $scope->detach();
        $tracerProvider->shutdown();

        return $response;
    }

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------

    /**
     * Try to resolve a named route pattern from the Slim routing result.
     * Falls back to the raw URI path when routing info is not available.
     */
    private function resolveRoute(Request $request): string
    {
        // Slim stores the routing results as a request attribute after routing.
        $routingResults = $request->getAttribute('__routingResults__');
        if ($routingResults !== null && method_exists($routingResults, 'getRoute')) {
            $route = $routingResults->getRoute();
            if ($route !== null && method_exists($route, 'getPattern')) {
                return $route->getPattern();
            }
        }

        // Fallback: use the URI path.
        return $request->getUri()->getPath();
    }
}
