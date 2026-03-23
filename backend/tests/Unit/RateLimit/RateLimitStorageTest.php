<?php

namespace Tundua\Tests\Unit\RateLimit;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\Test;
use Tundua\RateLimit\FileRateLimitStorage;

/**
 * Unit tests for FileRateLimitStorage.
 *
 * Uses a temporary directory that is cleaned up after each test.
 */
class RateLimitStorageTest extends TestCase
{
    private string $tempDir;
    private FileRateLimitStorage $storage;

    protected function setUp(): void
    {
        parent::setUp();

        $this->tempDir = sys_get_temp_dir() . '/tundua_rl_test_' . uniqid();
        $this->storage = new FileRateLimitStorage($this->tempDir);
    }

    protected function tearDown(): void
    {
        // Remove all files in the temp directory
        if (is_dir($this->tempDir)) {
            $files = glob($this->tempDir . '/*');
            foreach ($files as $file) {
                if (is_file($file)) {
                    unlink($file);
                }
            }
            rmdir($this->tempDir);
        }

        parent::tearDown();
    }

    // =============================================
    //  Constructor / Directory Creation
    // =============================================

    #[Test]
    public function constructor_creates_storage_directory_if_missing(): void
    {
        $dir = sys_get_temp_dir() . '/tundua_rl_mkdir_' . uniqid();
        $this->assertDirectoryDoesNotExist($dir);

        new FileRateLimitStorage($dir);

        $this->assertDirectoryExists($dir);

        // Cleanup
        rmdir($dir);
    }

    // =============================================
    //  get()
    // =============================================

    #[Test]
    public function get_returns_zero_count_when_no_record_exists(): void
    {
        $result = $this->storage->get('nonexistent_key', 60);

        $this->assertSame(0, $result['count']);
        $this->assertArrayHasKey('reset', $result);
        $this->assertGreaterThan(time(), $result['reset']);
    }

    #[Test]
    public function get_returns_current_count_within_active_window(): void
    {
        $key = 'test_get_active';

        // Record two hits
        $this->storage->hit($key, 3600);
        $this->storage->hit($key, 3600);

        $result = $this->storage->get($key, 3600);

        $this->assertSame(2, $result['count']);
    }

    #[Test]
    public function get_resets_count_when_window_has_expired(): void
    {
        $key = 'test_get_expired';

        // Write a file with an already-expired reset timestamp
        $filePath = $this->tempDir . '/' . $key . '.json';
        file_put_contents($filePath, json_encode([
            'count' => 99,
            'reset' => time() - 10,
            'first_request' => time() - 100,
        ]));

        $result = $this->storage->get($key, 60);

        $this->assertSame(0, $result['count']);
    }

    // =============================================
    //  hit()
    // =============================================

    #[Test]
    public function hit_increments_count_within_active_window(): void
    {
        $key = 'test_hit_increment';

        $first = $this->storage->hit($key, 3600);
        $this->assertSame(1, $first['count']);

        $second = $this->storage->hit($key, 3600);
        $this->assertSame(2, $second['count']);

        $third = $this->storage->hit($key, 3600);
        $this->assertSame(3, $third['count']);
    }

    #[Test]
    public function hit_preserves_original_reset_timestamp(): void
    {
        $key = 'test_hit_reset';

        $first = $this->storage->hit($key, 3600);
        $originalReset = $first['reset'];

        $second = $this->storage->hit($key, 3600);

        $this->assertSame($originalReset, $second['reset'], 'Reset timestamp must not change within the same window');
    }

    #[Test]
    public function hit_starts_new_window_after_expiration(): void
    {
        $key = 'test_hit_new_window';

        // Write a file with an already-expired reset timestamp
        $filePath = $this->tempDir . '/' . $key . '.json';
        file_put_contents($filePath, json_encode([
            'count' => 50,
            'reset' => time() - 10,
            'first_request' => time() - 100,
        ]));

        $result = $this->storage->hit($key, 60);

        $this->assertSame(1, $result['count'], 'Count should reset to 1 after window expiry');
        $this->assertGreaterThan(time(), $result['reset']);
    }

    #[Test]
    public function hit_creates_json_file_on_disk(): void
    {
        $key = 'test_file_creation';

        $this->storage->hit($key, 60);

        $filePath = $this->tempDir . '/' . $key . '.json';
        $this->assertFileExists($filePath);

        $data = json_decode(file_get_contents($filePath), true);
        $this->assertSame(1, $data['count']);
        $this->assertArrayHasKey('reset', $data);
        $this->assertArrayHasKey('first_request', $data);
    }

    // =============================================
    //  Multiple Keys
    // =============================================

    #[Test]
    public function different_keys_are_tracked_independently(): void
    {
        $this->storage->hit('key_a', 3600);
        $this->storage->hit('key_a', 3600);
        $this->storage->hit('key_b', 3600);

        $a = $this->storage->get('key_a', 3600);
        $b = $this->storage->get('key_b', 3600);

        $this->assertSame(2, $a['count']);
        $this->assertSame(1, $b['count']);
    }

    // =============================================
    //  cleanup()
    // =============================================

    #[Test]
    public function cleanup_removes_expired_files(): void
    {
        // Create an expired file
        file_put_contents(
            $this->tempDir . '/expired_key.json',
            json_encode(['count' => 5, 'reset' => time() - 100])
        );

        // Create a still-active file
        file_put_contents(
            $this->tempDir . '/active_key.json',
            json_encode(['count' => 2, 'reset' => time() + 3600])
        );

        $deleted = FileRateLimitStorage::cleanup($this->tempDir);

        $this->assertSame(1, $deleted);
        $this->assertFileDoesNotExist($this->tempDir . '/expired_key.json');
        $this->assertFileExists($this->tempDir . '/active_key.json');
    }

    #[Test]
    public function cleanup_returns_zero_when_no_expired_files(): void
    {
        file_put_contents(
            $this->tempDir . '/active.json',
            json_encode(['count' => 1, 'reset' => time() + 3600])
        );

        $deleted = FileRateLimitStorage::cleanup($this->tempDir);

        $this->assertSame(0, $deleted);
    }

    #[Test]
    public function cleanup_returns_zero_for_nonexistent_directory(): void
    {
        $deleted = FileRateLimitStorage::cleanup('/tmp/does_not_exist_' . uniqid());

        $this->assertSame(0, $deleted);
    }

    #[Test]
    public function cleanup_removes_all_files_when_all_expired(): void
    {
        for ($i = 0; $i < 5; $i++) {
            file_put_contents(
                $this->tempDir . "/expired_{$i}.json",
                json_encode(['count' => $i + 1, 'reset' => time() - ($i + 1)])
            );
        }

        $deleted = FileRateLimitStorage::cleanup($this->tempDir);

        $this->assertSame(5, $deleted);
        $this->assertCount(0, glob($this->tempDir . '/*.json'));
    }
}
