<?php

namespace Tundua\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Exception\HttpException;
use Throwable;

class JsonErrorHandler
{
    /**
     * Invoke the error handler
     */
    public function __invoke(
        ServerRequestInterface $request,
        Throwable $exception,
        bool $displayErrorDetails,
        bool $logErrors,
        bool $logErrorDetails
    ): ResponseInterface {
        $response = new \Slim\Psr7\Response();

        $statusCode = 500;
        if ($exception instanceof HttpException) {
            $statusCode = $exception->getCode();
        }

        $error = [
            'success' => false,
            'error' => $exception->getMessage(),
        ];

        // Add detailed error info in development
        if ($displayErrorDetails) {
            $error['details'] = [
                'type' => get_class($exception),
                'code' => $exception->getCode(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'trace' => $exception->getTraceAsString(),
            ];
        }

        // Log the error
        if ($logErrors) {
            error_log(sprintf(
                "[%s] %s in %s:%d\nStack trace:\n%s",
                date('Y-m-d H:i:s'),
                $exception->getMessage(),
                $exception->getFile(),
                $exception->getLine(),
                $exception->getTraceAsString()
            ));
        }

        $response->getBody()->write(json_encode($error));

        return $response
            ->withStatus($statusCode)
            ->withHeader('Content-Type', 'application/json');
    }
}
