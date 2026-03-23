<?php

namespace Tundua\RateLimit;

/**
 * Redis-backed rate limit storage.
 *
 * Uses atomic INCR + EXPIRE to provide race-condition-free counting.
 * Requires the PHP `redis` (phpredis) extension.
 */
class RedisRateLimitStorage implements RateLimitStorageInterface
{
    private \Redis $redis;
    private string $prefix;

    /**
     * @param string      $host     Redis host (e.g. "127.0.0.1")
     * @param int         $port     Redis port (default 6379)
     * @param string|null $password Optional AUTH password
     * @param string      $prefix   Key prefix (default "tundua:")
     */
    public function __construct(
        string $host = '127.0.0.1',
        int $port = 6379,
        ?string $password = null,
        string $prefix = 'tundua:'
    ) {
        $this->prefix = $prefix;
        $this->redis = new \Redis();
        $this->redis->connect($host, $port, 2.0); // 2-second connect timeout

        if ($password !== null && $password !== '') {
            $this->redis->auth($password);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function get(string $key, int $windowSeconds): array
    {
        $redisKey = $this->redisKey($key);

        $count = $this->redis->get($redisKey);
        $ttl   = $this->redis->ttl($redisKey);

        if ($count === false || $ttl <= 0) {
            return [
                'count' => 0,
                'reset' => time() + $windowSeconds,
            ];
        }

        return [
            'count' => (int)$count,
            'reset' => time() + $ttl,
        ];
    }

    /**
     * {@inheritdoc}
     *
     * Uses INCR + EXPIRE atomically: if the key is new (INCR returns 1),
     * we set the TTL.  Existing keys keep their original expiry.
     */
    public function hit(string $key, int $windowSeconds): array
    {
        $redisKey = $this->redisKey($key);

        $count = $this->redis->incr($redisKey);

        // First request in this window — set the expiry
        if ($count === 1) {
            $this->redis->expire($redisKey, $windowSeconds);
        }

        $ttl = $this->redis->ttl($redisKey);

        // Safety: if TTL was somehow lost, re-apply it
        if ($ttl <= 0) {
            $this->redis->expire($redisKey, $windowSeconds);
            $ttl = $windowSeconds;
        }

        return [
            'count' => (int)$count,
            'reset' => time() + $ttl,
        ];
    }

    // ------------------------------------------------------------------
    //  Internal helpers
    // ------------------------------------------------------------------

    /**
     * Build the full Redis key.
     *
     * Format: {prefix}rate_limit:{key}
     * where key is already "identifier:endpoint_hash" from the middleware.
     */
    private function redisKey(string $key): string
    {
        return $this->prefix . 'rate_limit:' . $key;
    }
}
