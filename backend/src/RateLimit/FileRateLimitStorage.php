<?php

namespace Tundua\RateLimit;

/**
 * File-based rate limit storage.
 *
 * Stores counters as individual JSON files on disk.  This is the fallback
 * backend used when Redis is not available.
 */
class FileRateLimitStorage implements RateLimitStorageInterface
{
    private string $storageDir;

    public function __construct(string $storageDir)
    {
        $this->storageDir = $storageDir;

        if (!is_dir($this->storageDir)) {
            mkdir($this->storageDir, 0755, true);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function get(string $key, int $windowSeconds): array
    {
        $filePath = $this->filePath($key);

        if (!file_exists($filePath)) {
            return [
                'count' => 0,
                'reset' => time() + $windowSeconds,
            ];
        }

        $data = json_decode(file_get_contents($filePath), true);

        if (!$data || time() >= $data['reset']) {
            return [
                'count' => 0,
                'reset' => time() + $windowSeconds,
            ];
        }

        return [
            'count' => (int)$data['count'],
            'reset' => (int)$data['reset'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function hit(string $key, int $windowSeconds): array
    {
        $filePath = $this->filePath($key);

        $data = [
            'count' => 1,
            'reset' => time() + $windowSeconds,
            'first_request' => time(),
        ];

        if (file_exists($filePath)) {
            $existing = json_decode(file_get_contents($filePath), true);

            if ($existing && time() < $existing['reset']) {
                $data['count'] = $existing['count'] + 1;
                $data['reset'] = $existing['reset'];
                $data['first_request'] = $existing['first_request'];
            }
        }

        file_put_contents($filePath, json_encode($data));

        return [
            'count' => $data['count'],
            'reset' => $data['reset'],
        ];
    }

    // ------------------------------------------------------------------
    //  Cleanup (file-only concern)
    // ------------------------------------------------------------------

    /**
     * Remove expired rate-limit files. Intended to be called via cron.
     *
     * @return int Number of deleted files
     */
    public static function cleanup(?string $storageDir = null): int
    {
        $dir = $storageDir ?? __DIR__ . '/../../storage/rate_limits';
        $deleted = 0;

        if (!is_dir($dir)) {
            return 0;
        }

        $files = glob($dir . '/*.json');
        $now = time();

        foreach ($files as $file) {
            $data = json_decode(file_get_contents($file), true);

            if ($data && $now >= $data['reset']) {
                unlink($file);
                $deleted++;
            }
        }

        return $deleted;
    }

    // ------------------------------------------------------------------
    //  Internal helpers
    // ------------------------------------------------------------------

    private function filePath(string $key): string
    {
        // Sanitize key for Windows compatibility (colons from IPv6 addresses)
        $safeKey = str_replace([':', '\\', '/'], '_', $key);
        return $this->storageDir . '/' . $safeKey . '.json';
    }
}
