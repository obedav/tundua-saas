<?php

namespace Tundua\Observability;

/**
 * A lightweight tracer that generates W3C-compatible trace/span IDs
 * and collects spans in memory. Works without any external dependencies.
 *
 * When the OpenTelemetry SDK is installed, TracingMiddleware can delegate
 * to it instead. This class serves as the zero-dependency fallback.
 */
class SimpleTracer
{
    /** @var array<int, array<string, mixed>> Collected spans */
    private array $spans = [];

    private string $serviceName;

    public function __construct(string $serviceName = 'tundua-api')
    {
        $this->serviceName = $serviceName;
    }

    // ------------------------------------------------------------------
    // Span lifecycle
    // ------------------------------------------------------------------

    /**
     * Start a new span and return its handle (an associative array).
     *
     * @param  string               $name       Human-readable span name
     * @param  array<string,mixed>  $attributes Key-value attributes
     * @param  string|null          $parentSpanId Parent span ID (hex) or null for root
     * @param  string|null          $traceId    Trace ID to reuse (hex), generated if null
     * @return array{traceId:string,spanId:string,parentSpanId:string|null,name:string,attributes:array,events:array,startTime:float,endTime:float|null,status:string}
     */
    public function startSpan(
        string $name,
        array $attributes = [],
        ?string $parentSpanId = null,
        ?string $traceId = null,
    ): array {
        return [
            'traceId'      => $traceId ?? self::generateTraceId(),
            'spanId'       => self::generateSpanId(),
            'parentSpanId' => $parentSpanId,
            'name'         => $name,
            'attributes'   => $attributes,
            'events'       => [],
            'startTime'    => microtime(true),
            'endTime'      => null,
            'status'       => 'UNSET',
        ];
    }

    /**
     * End a span, record its duration, and push it to the collector.
     *
     * @param  array<string,mixed> &$span  Span handle returned by startSpan()
     * @param  string               $status 'OK' | 'ERROR' | 'UNSET'
     * @return void
     */
    public function endSpan(array &$span, string $status = 'OK'): void
    {
        $span['endTime'] = microtime(true);
        $span['status']  = $status;
        $this->spans[]   = $span;
    }

    /**
     * Add an event (e.g. exception) to a span that has not yet ended.
     *
     * @param  array<string,mixed> &$span
     * @param  string               $eventName
     * @param  array<string,mixed>  $eventAttributes
     * @return void
     */
    public function addEvent(array &$span, string $eventName, array $eventAttributes = []): void
    {
        $span['events'][] = [
            'name'       => $eventName,
            'timestamp'  => microtime(true),
            'attributes' => $eventAttributes,
        ];
    }

    /**
     * Set or override an attribute on a span that has not yet ended.
     */
    public function setAttribute(array &$span, string $key, mixed $value): void
    {
        $span['attributes'][$key] = $value;
    }

    // ------------------------------------------------------------------
    // Export helpers
    // ------------------------------------------------------------------

    /**
     * Return all collected spans as an array.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getSpans(): array
    {
        return $this->spans;
    }

    /**
     * Flush collected spans and return them.
     *
     * @return array<int, array<string, mixed>>
     */
    public function flush(): array
    {
        $spans = $this->spans;
        $this->spans = [];
        return $spans;
    }

    /**
     * Export all collected spans as a JSON string suitable for logging.
     */
    public function toJson(): string
    {
        return json_encode([
            'service'   => $this->serviceName,
            'exportedAt' => gmdate('Y-m-d\TH:i:s\Z'),
            'spans'     => array_map([$this, 'formatSpan'], $this->spans),
        ], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    }

    /**
     * Append all collected spans to a log file as a single JSON line per span.
     */
    public function exportToFile(string $filePath): void
    {
        $dir = dirname($filePath);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        foreach ($this->spans as $span) {
            $line = json_encode([
                'service'  => $this->serviceName,
                'trace_id' => $span['traceId'],
                'span_id'  => $span['spanId'],
                'parent_span_id' => $span['parentSpanId'],
                'name'     => $span['name'],
                'status'   => $span['status'],
                'start'    => $this->formatTimestamp($span['startTime']),
                'end'      => $span['endTime'] ? $this->formatTimestamp($span['endTime']) : null,
                'duration_ms' => $span['endTime']
                    ? round(($span['endTime'] - $span['startTime']) * 1000, 2)
                    : null,
                'attributes' => $span['attributes'],
                'events'     => $span['events'],
            ], JSON_UNESCAPED_SLASHES) . "\n";

            file_put_contents($filePath, $line, FILE_APPEND | LOCK_EX);
        }
    }

    // ------------------------------------------------------------------
    // ID generators (W3C Trace Context format)
    // ------------------------------------------------------------------

    /**
     * Generate a 32-hex-character trace ID (128-bit).
     */
    public static function generateTraceId(): string
    {
        return bin2hex(random_bytes(16));
    }

    /**
     * Generate a 16-hex-character span ID (64-bit).
     */
    public static function generateSpanId(): string
    {
        return bin2hex(random_bytes(8));
    }

    // ------------------------------------------------------------------
    // Internal helpers
    // ------------------------------------------------------------------

    /**
     * Format a span for JSON export.
     *
     * @param  array<string,mixed> $span
     * @return array<string,mixed>
     */
    private function formatSpan(array $span): array
    {
        return [
            'trace_id'       => $span['traceId'],
            'span_id'        => $span['spanId'],
            'parent_span_id' => $span['parentSpanId'],
            'name'           => $span['name'],
            'status'         => $span['status'],
            'start'          => $this->formatTimestamp($span['startTime']),
            'end'            => $span['endTime'] ? $this->formatTimestamp($span['endTime']) : null,
            'duration_ms'    => $span['endTime']
                ? round(($span['endTime'] - $span['startTime']) * 1000, 2)
                : null,
            'attributes'     => $span['attributes'],
            'events'         => array_map(function (array $event): array {
                return [
                    'name'       => $event['name'],
                    'timestamp'  => $this->formatTimestamp($event['timestamp']),
                    'attributes' => $event['attributes'],
                ];
            }, $span['events']),
        ];
    }

    /**
     * Convert a float microtime to an ISO-8601 timestamp with microseconds.
     */
    private function formatTimestamp(float $microtime): string
    {
        $seconds = (int) $microtime;
        $micros  = (int) round(($microtime - $seconds) * 1_000_000);
        return gmdate('Y-m-d\TH:i:s', $seconds) . sprintf('.%06dZ', $micros);
    }
}
