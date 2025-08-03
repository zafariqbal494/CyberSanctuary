<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Payment;
use App\Models\User;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics.
     */
    public function stats()
    {
        try {
            // Count total courses
            $totalCourses = Course::count();
            
            // Count total users
            $totalUsers = User::where('is_admin', false)->count();
            
            // Calculate total revenue from approved payments
            $totalRevenue = Payment::where('status', 'approved')
                ->sum('amount');
            
            // Count pending payments
            $pendingPayments = Payment::where('status', 'pending')->count();
            
            // Get recent payments (limit 5)
            $recentPayments = Payment::with('course')
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($payment) {
                    return [
                        'id' => $payment->order_id,
                        'user' => $payment->username,
                        'course' => $payment->course ? $payment->course->name : 'Unknown Course',
                        'amount' => $payment->amount,
                        'status' => $payment->status,
                        'date' => $payment->created_at->format('Y-m-d')
                    ];
                });
            
            // Get recent users (limit 3)
            $recentUsers = User::where('is_admin', false)
                ->orderBy('created_at', 'desc')
                ->limit(3)
                ->get()
                ->map(function ($user) {
                    // Count courses for each user
                    $courseCount = Enrollment::where('user_id', $user->id)->count();
                    
                    return [
                        'username' => $user->username ?? $user->name,
                        'email' => $user->email,
                        'courses' => $courseCount,
                        'joinDate' => $user->created_at->format('Y-m-d')
                    ];
                });
            
            return response()->json([
                'stats' => [
                    'totalCourses' => $totalCourses,
                    'totalUsers' => $totalUsers,
                    'totalRevenue' => $totalRevenue,
                    'pendingPayments' => $pendingPayments
                ],
                'recentPayments' => $recentPayments,
                'recentUsers' => $recentUsers
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Error getting dashboard stats: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to fetch dashboard statistics',
                'message' => $e->getMessage()
            ], 500);
        }
    }
} 