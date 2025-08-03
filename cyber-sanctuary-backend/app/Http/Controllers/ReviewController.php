<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Carbon;

class ReviewController extends Controller
{
    /**
     * Display a listing of the reviews with optional filtering.
     */
    public function index(Request $request)
    {
        try {
            Log::info('Fetching reviews with filters: ' . json_encode($request->all()));
            
            $query = Review::with('course');
            
            // Filter by course_id if provided
            if ($request->has('course_id') && $request->course_id) {
                $query->where('course_id', $request->course_id);
            }
            
            // Filter by rating if provided
            if ($request->has('rating') && $request->rating) {
                $query->where('rating', $request->rating);
            }
            
            // Search in content if search term provided
            if ($request->has('search') && $request->search) {
                $searchTerm = $request->search;
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('content', 'LIKE', '%' . $searchTerm . '%')
                      ->orWhere('user_name', 'LIKE', '%' . $searchTerm . '%');
                });
            }
            
            // Apply sorting
            $sortBy = $request->input('sort_by', 'created_at');
            $sortOrder = $request->input('sort_order', 'desc');
            
            // Validate sort parameters
            $allowedSortFields = ['created_at', 'rating', 'helpful_count'];
            $allowedSortOrders = ['asc', 'desc'];
            
            if (!in_array($sortBy, $allowedSortFields)) {
                $sortBy = 'created_at';
            }
            
            if (!in_array($sortOrder, $allowedSortOrders)) {
                $sortOrder = 'desc';
            }
            
            $query->orderBy($sortBy, $sortOrder);
            
            // Paginate the results
            $reviews = $query->paginate(10);
            
            Log::info('Successfully fetched reviews. Count: ' . $reviews->count());
            
            return response()->json($reviews);
        } catch (\Exception $e) {
            Log::error('Error fetching reviews: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch reviews',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created manual review.
     */
    public function store(Request $request)
    {
        try {
            Log::info('Creating manual review: ' . json_encode($request->all()));
            
            // Validate the request
            $validated = $request->validate([
                'course_id' => 'required|exists:courses,id',
                'user_name' => 'required|string|max:255',
                'rating' => 'required|integer|min:1|max:5',
                'content' => 'required|string',
                'helpful_count' => 'required|integer|min:0',
                'created_at' => 'nullable|date',
            ]);
            
            // Set the created_at date if provided, otherwise use current time
            $createdAt = $validated['created_at'] ?? now();
            
            // Create the review
            $review = new Review();
            $review->course_id = $validated['course_id'];
            $review->user_id = 1; // Default admin user ID or null
            $review->user_name = $validated['user_name'];
            $review->rating = $validated['rating'];
            $review->content = $validated['content'];
            $review->helpful_count = $validated['helpful_count'];
            $review->created_at = $createdAt;
            $review->updated_at = $createdAt;
            $review->save();
            
            // Load the course relationship for the response
            $review->load('course');
            
            Log::info('Manual review created successfully: ' . $review->id);
            
            return response()->json([
                'success' => true,
                'message' => 'Review created successfully',
                'review' => $review
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating manual review: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to create review',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all courses for the dropdown filter
     */
    public function getCourses()
    {
        try {
            $courses = Course::select('id', 'name')->get();
            return response()->json($courses);
        } catch (\Exception $e) {
            Log::error('Error fetching courses for review filter: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch courses',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a review
     */
    public function destroy($id)
    {
        try {
            Log::info('Attempting to delete review: ' . $id);
            
            $review = Review::findOrFail($id);
            $review->delete();
            
            Log::info('Review deleted successfully: ' . $id);
            
            return response()->json([
                'success' => true,
                'message' => 'Review deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting review: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to delete review',
                'message' => $e->getMessage()
            ], 500);
        }
    }
} 