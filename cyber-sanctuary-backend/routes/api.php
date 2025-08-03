<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SettingsController;
use App\Models\Course;
use App\Models\CourseModule;
use App\Models\CourseLesson;

// Handle OPTIONS preflight requests
Route::options('/{any}', function () {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
})->where('any', '.*');

// Public routes
Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{id}', [CourseController::class, 'show']);
Route::post('/courses', [CourseController::class, 'store']); // For creating new courses - temporarily public for testing
Route::post('/courses/{id}/modules', [CourseController::class, 'updateModules']); // For updating course modules - temporarily public for testing
Route::put('/courses/{id}', [CourseController::class, 'update']); // For updating courses - temporarily public for testing
Route::post('/courses/{id}', [CourseController::class, 'update']); // For FormData uploads - temporarily public for testing
Route::delete('/courses/{id}', [CourseController::class, 'destroy']); // For deleting courses - temporarily public for testing
Route::post('/courses/{id}/purchases-count', [CourseController::class, 'updatePurchasesCount']); // For updating purchases count - temporarily public for testing
Route::get('/dashboard/stats', [DashboardController::class, 'stats']); // For fetching dashboard stats - temporarily public for testing
Route::post('/payments', [PaymentController::class, 'store']);
Route::get('/payments', [PaymentController::class, 'index']); // Public endpoint for fetching payments
Route::get('/payments/{id}', [PaymentController::class, 'show']); // Public endpoint for fetching a single payment
// Payment approval routes moved to protected routes
Route::post('/login', [UserController::class, 'login']);
Route::post('/forgot-password', [UserController::class, 'forgotPassword']);
Route::post('/password/reset', 'App\Http\Controllers\Auth\ResetPasswordController@reset')->name('password.update');
Route::get('/check-username', [UserController::class, 'checkUsername']); // Check if username is available
Route::get('/check-email', [UserController::class, 'checkEmail']); // Check if email exists

// Public settings routes
Route::get('/settings/wallet-address', [SettingsController::class, 'getWalletAddress']);
Route::get('/settings/telegram-link', [SettingsController::class, 'getTelegramLink']);

// Review routes - temporarily public for testing
Route::get('/reviews', [ReviewController::class, 'index']);
Route::get('/reviews/courses', [ReviewController::class, 'getCourses']);
Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);

// Test endpoint to verify API functionality
Route::get('/test', function() {
    return response()->json([
        'status' => 'success',
        'message' => 'API is working correctly',
        'timestamp' => now()->toDateTimeString()
    ]);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // User routes
    Route::get('/user', [UserController::class, 'user']);
    Route::post('/logout', [UserController::class, 'logout']);
    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::post('/user/change-password', [UserController::class, 'changePassword']);
    Route::get('/user/courses', [UserController::class, 'enrolledCourses']);
    Route::get('/user/courses/{courseId}', [UserController::class, 'enrolledCourse']);
    
    // Payment approval routes (protected)
    Route::post('/payments/{id}/approve', [PaymentController::class, 'approve']);
    Route::post('/payments/{id}/reject', [PaymentController::class, 'reject']);
    
    // Admin routes
    Route::group(['prefix' => 'admin'], function () {
        // Course management
        Route::get('/courses', [CourseController::class, 'index']);
        Route::get('/courses/{id}', [CourseController::class, 'show']);
        Route::put('/courses/{id}', [CourseController::class, 'update']);
        Route::post('/courses/{id}', [CourseController::class, 'update']);
        Route::post('/courses/{id}/modules', [CourseController::class, 'updateModules']);
        Route::delete('/courses/{id}', [CourseController::class, 'destroy']);
        
        // Payment management
        Route::get('/payments', [PaymentController::class, 'index']);
        Route::get('/payments/{id}', [PaymentController::class, 'show']);
        
        // Enrollment management
        Route::get('/enrollments', [EnrollmentController::class, 'index']);
        Route::get('/enrollments/{id}', [EnrollmentController::class, 'show']);
        Route::put('/enrollments/{id}/status', [EnrollmentController::class, 'updateStatus']);
        Route::get('/courses/{courseId}/enrollments', [EnrollmentController::class, 'courseEnrollments']);
        Route::get('/users/{userId}/enrollments', [EnrollmentController::class, 'userEnrollments']);
        
        // Review management
        Route::get('/reviews', [ReviewController::class, 'index']);
        Route::post('/reviews', [ReviewController::class, 'store']); // Add manual review
        Route::get('/reviews/courses', [ReviewController::class, 'getCourses']);
        Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);
        
        // Settings management
        Route::get('/settings', [SettingsController::class, 'index']);
        Route::post('/settings/wallet-address', [SettingsController::class, 'updateWalletAddress']);
        Route::post('/settings/network-name', [SettingsController::class, 'updateNetworkName']);
        Route::post('/settings/telegram-link', [SettingsController::class, 'updateTelegramLink']);
        Route::post('/settings/payment', [SettingsController::class, 'updatePaymentSettings']);
    });
});

// Test endpoint to check module creation
Route::get('/test-modules/{courseId}', function ($courseId) {
    try {
        // Find the course
        $course = Course::findOrFail($courseId);
        
        // Create a test module
        $module = new CourseModule();
        $module->course_id = $course->id;
        $module->title = 'Test Module';
        $module->description = 'Test Description';
        $module->durationMinutes = 60;
        $module->order = 1;
        $module->save();
        
        // Create a test lesson
        $lesson = new CourseLesson();
        $lesson->course_module_id = $module->id;
        $lesson->title = 'Test Lesson';
        $lesson->durationMinutes = 30;
        $lesson->type = 'video';
        $lesson->order = 1;
        $lesson->save();
        
        return response()->json([
            'success' => true,
            'module' => $module,
            'lesson' => $lesson,
            'message' => 'Test module and lesson created successfully'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
}); 