<?php

use App\Http\Controllers\ContactController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HealthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Routes in this file are prefixed with /api by default.
*/

// small health check endpoint
Route::get('/health', HealthController::class);
Route::apiResource('contacts', ContactController::class);
