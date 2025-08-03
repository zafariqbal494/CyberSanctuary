<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    /**
     * Display a listing of the enrollments.
     */
    public function index(Request $request)
    {
        // Only admins should access this
        if (!$request->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = Enrollment::with(['user', 'course', 'payment'])
            ->orderBy('created_at', 'desc');

        // Filter by status if provided
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by course if provided
        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        // Search by user
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%");
            });
        }

        $enrollments = $query->paginate(10);

        return response()->json($enrollments);
    }

    /**
     * Display the specified enrollment.
     */
    public function show(string $id)
    {
        $enrollment = Enrollment::with(['user', 'course', 'payment'])->findOrFail($id);
        
        // Only admins or the enrolled user should access this
        if (!auth()->user()->is_admin && auth()->id() !== $enrollment->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        return response()->json($enrollment);
    }

    /**
     * Update the enrollment status.
     */
    public function updateStatus(Request $request, string $id)
    {
        // Only admins should be able to update enrollment status
        if (!$request->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'required|in:active,suspended,completed',
        ]);

        $enrollment = Enrollment::findOrFail($id);
        $enrollment->update([
            'status' => $request->status,
        ]);

        return response()->json([
            'message' => 'Enrollment status updated successfully',
            'enrollment' => $enrollment,
        ]);
    }

    /**
     * Get enrollments for a specific course.
     */
    public function courseEnrollments(Request $request, string $courseId)
    {
        // Only admins should access this
        if (!$request->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $course = Course::findOrFail($courseId);
        
        $enrollments = $course->enrollments()
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'course' => $course,
            'enrollments' => $enrollments,
        ]);
    }

    /**
     * Get enrollments for a specific user.
     */
    public function userEnrollments(Request $request, string $userId)
    {
        // Only admins or the user themselves should access this
        if (!$request->user()->is_admin && $request->user()->id != $userId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::findOrFail($userId);
        
        $enrollments = $user->enrollments()
            ->with('course')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'user' => $user,
            'enrollments' => $enrollments,
        ]);
    }
}
