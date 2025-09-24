<?php

namespace Tests\Feature;

use Tests\TestCase;

/**
 * Verifies that the /api/health endpoint responds successfully with { ok: true }.
 */
class HealthCheckTest extends TestCase
{
    public function test_health_endpoint_returns_ok_true(): void
    {
        // Act: hit the health endpoint
        $response = $this->getJson('/api/health');

        // Assert: 200 OK and expected JSON payload
        $response
            ->assertOk()
            ->assertExactJson(['ok' => true]);
    }
}
