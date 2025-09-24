<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

/**
 * Health check endpoint for uptime monitors and dev checks.
 */
class HealthController extends Controller
{
    /**
     * Return a minimal OK payload.
     */
    public function __invoke(): JsonResponse
    {
        return response()->json(['ok' => true]);
    }
}
