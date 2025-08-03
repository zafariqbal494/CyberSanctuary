<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * Check if a username is already taken
     */
    public function checkUsername(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
        ]);

        $exists = User::where('username', $request->username)->exists();

        return response()->json([
            'exists' => $exists,
        ]);
    }

    /**
     * Check if an email exists in the system
     */
    public function checkEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $exists = User::where('email', $request->email)->exists();

        return response()->json([
            'exists' => $exists,
        ]);
    }

    /**
     * Authenticate a user and return a token.
     */
    public function login(Request $request)
    {
        // Log the request data for debugging
        \Log::info('Login attempt with data:', $request->all());
        
        $request->validate([
            'password' => 'required',
        ]);

        // First try with username
        if ($request->has('username')) {
            $usernameCredentials = [
                'username' => $request->username,
                'password' => $request->password,
            ];
            
            \Log::info('Attempting login with username:', ['username' => $request->username]);
            
            if (Auth::attempt($usernameCredentials)) {
            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;
                
                \Log::info('Login successful with username for user:', ['id' => $user->id, 'name' => $user->name]);
            
            return response()->json([
                'user' => $user,
                'token' => $token,
            ]);
        }
        }
        
        // Then try with email
        if ($request->has('email')) {
            $emailCredentials = [
                'email' => $request->email,
                'password' => $request->password,
            ];
            
            \Log::info('Attempting login with email:', ['email' => $request->email]);
            
            if (Auth::attempt($emailCredentials)) {
                $user = Auth::user();
                $token = $user->createToken('auth_token')->plainTextToken;
                
                \Log::info('Login successful with email for user:', ['id' => $user->id, 'name' => $user->name]);
                
                return response()->json([
                    'user' => $user,
                    'token' => $token,
                ]);
            }
        }

        \Log::error('Login failed: Invalid credentials');
        
        return response()->json([
            'message' => 'The provided credentials are incorrect.',
        ], 401);
    }

    /**
     * Log the user out (invalidate the token).
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    /**
     * Get the authenticated user.
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Update user profile.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'username' => 'sometimes|required|string|max:255|unique:users,username,' . $user->id,
            'email' => 'sometimes|required|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }

    /**
     * Change user password.
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The provided password does not match our records.'],
            ]);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'Password changed successfully']);
    }

    /**
     * Send a reset password link to the given user.
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['message' => 'Password reset link sent to your email']);
        }

        throw ValidationException::withMessages([
            'email' => [__($status)],
        ]);
    }

    /**
     * Get all enrolled courses for the authenticated user.
     */
    public function enrolledCourses(Request $request)
    {
        $user = $request->user();
        $enrolledCourses = $user->enrollments()
            ->with('course')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($enrollment) {
                return [
                    'enrollment_id' => $enrollment->id,
                    'enrollment_status' => $enrollment->status,
                    'enrolled_at' => $enrollment->created_at,
                    'course' => $enrollment->course,
                ];
            });

        return response()->json($enrolledCourses);
    }

    /**
     * Get a specific enrolled course for the authenticated user.
     */
    public function enrolledCourse(Request $request, $courseId)
    {
        $user = $request->user();
        $enrollment = $user->enrollments()
            ->where('course_id', $courseId)
            ->with(['course', 'course.modules.lessons'])
            ->first();

        if (!$enrollment) {
            return response()->json(['message' => 'You are not enrolled in this course'], 403);
        }

        return response()->json([
            'enrollment' => $enrollment,
            'course' => $enrollment->course,
        ]);
    }
}
