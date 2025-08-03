<?php

namespace App\Http\Controllers;

use App\Mail\AdminNotification;
use App\Mail\PaymentApproved;
use App\Mail\PaymentConfirmation;
use App\Mail\PaymentRejected;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class PaymentController extends Controller
{
    /**
     * Store a newly created payment in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'course_id' => 'required|exists:courses,id',
            'amount' => 'required|numeric|min:0',
            'screenshot' => 'required|image|max:5120', // 5MB max
        ]);

        // Get course details
        $course = Course::findOrFail($validated['course_id']);

        // Generate unique order ID
        $orderId = 'ORD-' . strtoupper(Str::random(8));

        // Store the screenshot
        $screenshotPath = $request->file('screenshot')->store('payment_screenshots', 'public');

        // Create payment record
        $payment = Payment::create([
            'order_id' => $orderId,
            'username' => $validated['username'],
            'email' => $validated['email'],
            'course_id' => $validated['course_id'],
            'amount' => $validated['amount'],
            'screenshot_path' => $screenshotPath,
            'status' => 'pending',
        ]);

        // Send confirmation email to user
        try {
            Mail::to($validated['email'])->send(new PaymentConfirmation($payment, $course));
        } catch (\Exception $e) {
            // Log the error but don't fail the request
            \Log::error('Failed to send payment confirmation email: ' . $e->getMessage());
        }

        // Send notification to admin
        try {
            // Get admin emails - in a real app, you'd get this from a setting or admin users
            $adminEmail = env('ADMIN_EMAIL', 'admin@example.com');
            Mail::to($adminEmail)->send(new AdminNotification($payment, $course));
        } catch (\Exception $e) {
            // Log the error but don't fail the request
            \Log::error('Failed to send admin notification email: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Payment submitted successfully',
            'order_id' => $orderId,
            'status' => 'pending',
        ], 201);
    }

    /**
     * Display a listing of the payments.
     */
    public function index(Request $request)
    {
        $query = Payment::with('course')
            ->orderBy('created_at', 'desc');

        // Filter by status if provided
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('order_id', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $payments = $query->paginate(10);

        // Format the response to match what the frontend expects
        return response()->json([
            'data' => $payments->items(),
            'total' => $payments->total(),
            'per_page' => $payments->perPage(),
            'current_page' => $payments->currentPage(),
            'last_page' => $payments->lastPage(),
        ]);
    }

    /**
     * Display the specified payment.
     */
    public function show(string $id)
    {
        $payment = Payment::with(['course', 'user'])->findOrFail($id);
        
        return response()->json($payment);
    }

    /**
     * Approve the specified payment.
     */
    public function approve(Request $request, string $id)
    {
        \Log::info('Payment approval started for ID: ' . $id);
        \Log::info('Request data:', $request->all());
        
        try {
            $payment = Payment::findOrFail($id);
            \Log::info('Payment found:', $payment->toArray());
            
            // Check if payment is already processed
            if ($payment->status !== 'pending') {
                \Log::warning('Payment already processed with status: ' . $payment->status);
                return response()->json([
                    'message' => 'Payment has already been ' . $payment->status
                ], 422);
            }

            // Start a database transaction
            \DB::beginTransaction();

            try {
                // Find or create user
                $user = User::firstOrNew(['email' => $payment->email]);
                \Log::info('User found or new:', ['exists' => $user->exists, 'id' => $user->id ?? 'new']);
                
                // If user doesn't exist, create a new one
                if (!$user->exists) {
                    $password = Str::random(10);
                    $user->fill([
                        'name' => $payment->username,
                        'username' => $payment->username,
                        'password' => Hash::make($password),
                        'is_admin' => false,
                    ]);
                    $user->save();
                    \Log::info('New user created with ID: ' . $user->id);
                    
                    // Store the plain password temporarily for the email
                    $user->plain_password = $password;
                } else {
                    $user->plain_password = null;
                }

                // Create enrollment
                $enrollment = Enrollment::create([
                    'user_id' => $user->id,
                    'course_id' => $payment->course_id,
                    'payment_id' => $payment->id,
                    'status' => 'active',
                ]);
                \Log::info('Enrollment created with ID: ' . $enrollment->id);

                // Update payment
                $payment->update([
                    'status' => 'approved',
                    'user_id' => $user->id,
                    'approved_at' => now(),
                    'admin_notes' => $request->notes,
                    // Removed approved_by field
                ]);
                \Log::info('Payment updated successfully');

                // Increment the purchases count for the course
                $course = Course::find($payment->course_id);
                $course->increment('purchases_count');
                \Log::info('Course purchases count incremented');

                // Send approval email
                try {
                    Mail::to($payment->email)->send(new PaymentApproved($payment, $course, $user));
                    \Log::info('Approval email sent successfully');
                } catch (\Exception $e) {
                    \Log::error('Failed to send approval email: ' . $e->getMessage());
                    // Continue execution even if email fails
                }

                \DB::commit();
                \Log::info('Transaction committed successfully');

                return response()->json([
                    'message' => 'Payment approved successfully',
                    'payment' => $payment,
                    'enrollment' => $enrollment,
                ]);
            } catch (\Exception $e) {
                \DB::rollBack();
                \Log::error('Exception in approval process: ' . $e->getMessage());
                \Log::error('Stack trace: ' . $e->getTraceAsString());
                
                return response()->json([
                    'message' => 'Failed to approve payment',
                    'error' => $e->getMessage()
                ], 500);
            }
        } catch (\Exception $e) {
            \Log::error('Failed to find payment: ' . $e->getMessage());
            return response()->json([
                'message' => 'Payment not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Reject the specified payment.
     */
    public function reject(Request $request, string $id)
    {
        $payment = Payment::findOrFail($id);

        // Check if payment is already processed
        if ($payment->status !== 'pending') {
            return response()->json([
                'message' => 'Payment has already been ' . $payment->status
            ], 422);
        }

        // Update payment
        $payment->update([
            'status' => 'rejected',
            'approved_at' => now(),
            'admin_notes' => $request->notes,
            // Removed approved_by field
        ]);

        // Send rejection email
        try {
            $course = Course::find($payment->course_id);
            Mail::to($payment->email)->send(new PaymentRejected($payment, $course, $request->notes));
        } catch (\Exception $e) {
            // Log the error but don't fail the request
            \Log::error('Failed to send payment rejection email: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Payment rejected successfully',
            'payment' => $payment,
        ]);
    }
}
