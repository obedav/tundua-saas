<?php

namespace Tundua\RateLimit;

/**
 * Strategy interface for rate limit storage backends.
 *
 * Each implementation must support two operations:
 *   1. Get the current hit count and window metadata for a key.
 *   2. Increment (record) a hit for a key within a time window.
 *
 * The returned array from both methods MUST contain:
 *   - 'count'  (int)  current number of requests in the window
 *   - 'reset'  (int)  Unix timestamp when the current window expires
 */
interface RateLimitStorageInterface
{
    /**
     * Retrieve the current rate-limit state for the given key.
     *
     * If no record exists (or the window has expired), implementations should
     * return count = 0 and a fresh reset timestamp based on $windowSeconds.
     *
     * @param  string $key           Unique storage key for this identifier+endpoint pair
     * @param  int    $windowSeconds Length of the rate-limit window in seconds
     * @return array{count: int, reset: int}
     */
    public function get(string $key, int $windowSeconds): array;

    /**
     * Record a new request hit and return the updated state.
     *
     * Implementations MUST be safe against race conditions when possible
     * (e.g. atomic INCR in Redis).
     *
     * @param  string $key           Unique storage key
     * @param  int    $windowSeconds Length of the rate-limit window in seconds
     * @return array{count: int, reset: int}
     */
    public function hit(string $key, int $windowSeconds): array;
}
