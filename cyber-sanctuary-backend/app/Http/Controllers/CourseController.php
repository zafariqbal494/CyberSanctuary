<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseModule;
use App\Models\CourseLesson;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $courses = Course::select([
                'id', 'name', 'shortDescription', 'icon', 'price', 
                'image_url', 'duration', 'lastUpdate', 'purchases_count',
                'specifications'
            ])
            ->get();
            
            // Load reviews separately to handle potential issues
            foreach ($courses as $course) {
                try {
                    $course->load('reviews');
                } catch (\Exception $e) {
                    \Log::error('Error loading reviews for course ' . $course->id . ': ' . $e->getMessage());
                    // Set empty reviews array if there's an error
                    $course->reviews = [];
                }
                
                // Ensure specifications is properly decoded from JSON string to array
                if (isset($course->specifications) && is_string($course->specifications)) {
                    try {
                        $course->specifications = json_decode($course->specifications, true);
                        if (json_last_error() !== JSON_ERROR_NONE) {
                            \Log::error('Error decoding specifications JSON: ' . json_last_error_msg());
                            $course->specifications = [];
                        }
                    } catch (\Exception $e) {
                        \Log::error('Exception decoding specifications: ' . $e->getMessage());
                        $course->specifications = [];
                    }
                }
            }
            
            return response()->json($courses);
        } catch (\Exception $e) {
            \Log::error('Error fetching courses: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch courses'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            // Log the incoming request data
            \Log::info('Creating new course - Request method: ' . $request->method());
            \Log::info('Request headers: ' . json_encode($request->headers->all()));
            \Log::info('Request data: ' . json_encode($request->all()));
            
            // Handle topics and specifications from FormData if they come as JSON strings
            $requestData = $request->all();
            
            if ($request->has('topics') && is_string($request->topics)) {
                try {
                    $requestData['topics'] = json_decode($request->topics, true);
                    \Log::info('Decoded topics: ' . json_encode($requestData['topics']));
                } catch (\Exception $e) {
                    \Log::error('Error decoding topics: ' . $e->getMessage());
                    $requestData['topics'] = [];
                }
            }
            
            if ($request->has('specifications') && is_string($request->specifications)) {
                try {
                    $requestData['specifications'] = json_decode($request->specifications, true);
                    \Log::info('Decoded specifications: ' . json_encode($requestData['specifications']));
                } catch (\Exception $e) {
                    \Log::error('Error decoding specifications: ' . $e->getMessage());
                    $requestData['specifications'] = [];
                }
            }
            
            // Create a new request with the modified data
            $modifiedRequest = Request::create('', '', $requestData);
            
            // Validate the request
            try {
                $validated = $modifiedRequest->validate([
                    'name' => 'required|string|max:255',
                    'shortDescription' => 'required|string|max:255',
                    'description' => 'required|string',
                    'icon' => 'required|string|max:255',
                    'image' => 'nullable|image|max:2048', // Accept image files up to 2MB
                    'image_url' => 'nullable|string|max:255',
                    'duration' => 'required|string|max:255',
                    'topics' => 'nullable|array',
                    'specifications' => 'nullable|array',
                    'price' => 'required|numeric',
                    'lastUpdate' => 'nullable|date',
                ]);
                \Log::info('Validation passed. Validated data: ' . json_encode($validated));
            } catch (\Illuminate\Validation\ValidationException $e) {
                \Log::error('Validation failed: ' . json_encode($e->errors()));
                return response()->json(['error' => 'Validation failed', 'details' => $e->errors()], 422);
            }
            
            // Format the lastUpdate date if it exists
            if (isset($validated['lastUpdate'])) {
                try {
                    $validated['lastUpdate'] = Carbon::parse($validated['lastUpdate'])->format('Y-m-d H:i:s');
                } catch (\Exception $e) {
                    \Log::error('Error parsing date: ' . $e->getMessage());
                    // If parsing fails, use current date
                    $validated['lastUpdate'] = Carbon::now()->format('Y-m-d H:i:s');
                }
            } else {
                // Set default lastUpdate to current date
                $validated['lastUpdate'] = Carbon::now()->format('Y-m-d H:i:s');
            }

            // Handle file upload if an image is provided
            if ($request->hasFile('image')) {
                try {
                    $path = $this->optimizeAndStoreImage($request->file('image'));
                    $validated['image_url'] = Storage::url($path);
                    \Log::info('Image stored at: ' . $validated['image_url']);
                } catch (\Exception $e) {
                    \Log::error('Error storing image: ' . $e->getMessage());
                }
            }

            // Create the course with validated data
            $course = Course::create($validated);
            \Log::info('Course created with ID: ' . $course->id);
            
            return response()->json($course, 201);
        } catch (\Exception $e) {
            \Log::error('Error creating course: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $course = Course::with(['modules.lessons'])->findOrFail($id);
            
            // Load reviews separately to handle potential issues
            try {
                $course->load('reviews');
            } catch (\Exception $e) {
                \Log::error('Error loading reviews for course ' . $id . ': ' . $e->getMessage());
                // Set empty reviews array if there's an error
                $course->reviews = [];
            }
            
            // Ensure specifications is properly decoded from JSON string to array
            if (isset($course->specifications) && is_string($course->specifications)) {
                try {
                    $course->specifications = json_decode($course->specifications, true);
                    if (json_last_error() !== JSON_ERROR_NONE) {
                        \Log::error('Error decoding specifications JSON: ' . json_last_error_msg());
                        $course->specifications = [];
                    }
                } catch (\Exception $e) {
                    \Log::error('Exception decoding specifications: ' . $e->getMessage());
                    $course->specifications = [];
                }
            }
            
            return response()->json($course);
        } catch (\Exception $e) {
            \Log::error('Error fetching course ' . $id . ': ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch course'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            \Log::info('Updating course: ' . $id);
            \Log::info('Request method: ' . $request->method());
            \Log::info('Request headers: ' . json_encode($request->headers->all()));
            \Log::info('Request data: ' . json_encode($request->all()));
            
            $course = Course::findOrFail($id);
            \Log::info('Course found: ' . $course->name);
            
            // Handle topics and specifications from FormData if they come as JSON strings
            $requestData = $request->all();
            
            if ($request->has('topics') && is_string($request->topics)) {
                try {
                    $requestData['topics'] = json_decode($request->topics, true);
                    \Log::info('Decoded topics: ' . json_encode($requestData['topics']));
                } catch (\Exception $e) {
                    \Log::error('Error decoding topics: ' . $e->getMessage());
                    $requestData['topics'] = [];
                }
            }
            
            if ($request->has('specifications') && is_string($request->specifications)) {
                try {
                    $requestData['specifications'] = json_decode($request->specifications, true);
                    \Log::info('Decoded specifications: ' . json_encode($requestData['specifications']));
                } catch (\Exception $e) {
                    \Log::error('Error decoding specifications: ' . $e->getMessage());
                    $requestData['specifications'] = [];
                }
            }
            
            // Create a new request with the modified data
            $modifiedRequest = Request::create('', '', $requestData);
            
            // Validate the request
            try {
                $validated = $modifiedRequest->validate([
                    'name' => 'sometimes|required|string|max:255',
                    'shortDescription' => 'sometimes|required|string|max:255',
                    'description' => 'sometimes|required|string',
                    'icon' => 'sometimes|required|string|max:255',
                    'image' => 'sometimes|nullable|image|max:2048', // Accept image files up to 2MB
                    'image_url' => 'sometimes|nullable|string|max:255',
                    'duration' => 'sometimes|required|string|max:255',
                    'topics' => 'sometimes|nullable|array',
                    'specifications' => 'sometimes|nullable|array',
                    'price' => 'sometimes|required|numeric',
                    'lastUpdate' => 'sometimes|nullable|date',
                ]);
                \Log::info('Validation passed. Validated data: ' . json_encode($validated));
            } catch (\Illuminate\Validation\ValidationException $e) {
                \Log::error('Validation failed: ' . json_encode($e->errors()));
                return response()->json(['error' => 'Validation failed', 'details' => $e->errors()], 422);
            }
            
            // Format the lastUpdate date if it exists
            if (isset($validated['lastUpdate'])) {
                try {
                    $validated['lastUpdate'] = Carbon::parse($validated['lastUpdate'])->format('Y-m-d H:i:s');
                    \Log::info('Formatted lastUpdate: ' . $validated['lastUpdate']);
                } catch (\Exception $e) {
                    \Log::error('Error parsing date: ' . $e->getMessage());
                    // If parsing fails, use current date
                    $validated['lastUpdate'] = Carbon::now()->format('Y-m-d H:i:s');
                    \Log::info('Using current date for lastUpdate: ' . $validated['lastUpdate']);
                }
            }

            // Handle file upload if an image is provided
            if ($request->hasFile('image')) {
                try {
                    // Delete old image if exists
                    if ($course->image_url && Storage::disk('public')->exists($course->image_url)) {
                        Storage::disk('public')->delete($course->image_url);
                        \Log::info('Deleted old image: ' . $course->image_url);
                    }
                    
                    // Store the new image
                    $path = $this->optimizeAndStoreImage($request->file('image'));
                    $validated['image_url'] = Storage::url($path);
                    \Log::info('Stored new image at: ' . $validated['image_url']);
                } catch (\Exception $e) {
                    \Log::error('Error handling image upload: ' . $e->getMessage());
                }
            }

            // Update the course with validated data
            $course->update($validated);
            \Log::info('Course updated successfully: ' . $course->id);
            
            // Return the updated course with modules and lessons
            $updatedCourse = Course::with('modules.lessons')->findOrFail($id);
            return response()->json($updatedCourse);
        } catch (\Exception $e) {
            \Log::error('Error updating course: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update modules and lessons for a course
     */
    public function updateModules(Request $request, string $id)
    {
        try {
            // Log the incoming request data
            \Log::info('Updating modules for course: ' . $id);
            \Log::info('Request data: ' . json_encode($request->all()));
            
            // Find the course
            $course = Course::findOrFail($id);
            
            // Get modules data from request
            $modulesData = $request->all();
            
            // Start a database transaction
            DB::beginTransaction();
            
            // Get existing module IDs for this course
            $existingModuleIds = $course->modules()->pluck('id')->toArray();
            \Log::info('Existing module IDs: ' . json_encode($existingModuleIds));
            $updatedModuleIds = [];
            
            // Process each module
            foreach ($modulesData as $moduleIndex => $moduleData) {
                \Log::info('Processing module: ' . json_encode($moduleData));
                
                if (isset($moduleData['id']) && is_numeric($moduleData['id'])) {
                    // Update existing module
                    $module = CourseModule::find($moduleData['id']);
                    if ($module && $module->course_id == $course->id) {
                        \Log::info('Updating existing module: ' . $moduleData['id']);
                        $module->title = $moduleData['title'];
                        $module->description = $moduleData['description'] ?? '';
                        $module->durationMinutes = $moduleData['durationMinutes'] ?? 0;
                        $module->order = $moduleIndex; // Set the order based on the array index
                        $module->save();
                        
                        $updatedModuleIds[] = $module->id;
                    } else {
                        // If module doesn't exist or doesn't belong to this course, create new
                        \Log::info('Creating new module with provided ID: ' . $moduleData['id']);
                        $module = new CourseModule();
                        $module->course_id = $course->id;
                        $module->title = $moduleData['title'];
                        $module->description = $moduleData['description'] ?? '';
                        $module->durationMinutes = $moduleData['durationMinutes'] ?? 0;
                        $module->order = $moduleIndex; // Set the order based on the array index
                        $module->save();
                        
                        $updatedModuleIds[] = $module->id;
                    }
                } else {
                    // Create new module
                    \Log::info('Creating new module');
                    $module = new CourseModule();
                    $module->course_id = $course->id;
                    $module->title = $moduleData['title'];
                    $module->description = $moduleData['description'] ?? '';
                    $module->durationMinutes = $moduleData['durationMinutes'] ?? 0;
                    $module->order = $moduleIndex; // Set the order based on the array index
                    $module->save();
                    
                    $updatedModuleIds[] = $module->id;
                }
                
                // Process lessons for this module
                if (isset($moduleData['lessons']) && is_array($moduleData['lessons'])) {
                    // Get existing lesson IDs for this module
                    $existingLessonIds = $module->lessons()->pluck('id')->toArray();
                    \Log::info('Existing lesson IDs for module ' . $module->id . ': ' . json_encode($existingLessonIds));
                    $updatedLessonIds = [];
                    
                    foreach ($moduleData['lessons'] as $lessonIndex => $lessonData) {
                        \Log::info('Processing lesson: ' . json_encode($lessonData));
                        
                        if (isset($lessonData['id']) && is_numeric($lessonData['id'])) {
                            // Update existing lesson
                            $lesson = CourseLesson::find($lessonData['id']);
                            if ($lesson && $lesson->course_module_id == $module->id) {
                                \Log::info('Updating existing lesson: ' . $lessonData['id']);
                                $lesson->title = $lessonData['title'];
                                $lesson->durationMinutes = $lessonData['durationMinutes'] ?? 0;
                                $lesson->type = $lessonData['type'] ?? 'video';
                                $lesson->order = $lessonIndex; // Set the order based on the array index
                                $lesson->save();
                                
                                $updatedLessonIds[] = $lesson->id;
                            } else {
                                // If lesson doesn't exist or doesn't belong to this module, create new
                                \Log::info('Creating new lesson with provided ID: ' . $lessonData['id']);
                                $lesson = new CourseLesson();
                                $lesson->course_module_id = $module->id;
                                $lesson->title = $lessonData['title'];
                                $lesson->durationMinutes = $lessonData['durationMinutes'] ?? 0;
                                $lesson->type = $lessonData['type'] ?? 'video';
                                $lesson->order = $lessonIndex; // Set the order based on the array index
                                $lesson->save();
                                
                                $updatedLessonIds[] = $lesson->id;
                            }
                        } else {
                            // Create new lesson
                            \Log::info('Creating new lesson');
                            $lesson = new CourseLesson();
                            $lesson->course_module_id = $module->id;
                            $lesson->title = $lessonData['title'];
                            $lesson->durationMinutes = $lessonData['durationMinutes'] ?? 0;
                            $lesson->type = $lessonData['type'] ?? 'video';
                            $lesson->order = $lessonIndex; // Set the order based on the array index
                            $lesson->save();
                            
                            $updatedLessonIds[] = $lesson->id;
                        }
                    }
                    
                    // Delete lessons that weren't updated
                    $lessonsToDelete = array_diff($existingLessonIds, $updatedLessonIds);
                    if (!empty($lessonsToDelete)) {
                        \Log::info('Deleting lessons: ' . json_encode($lessonsToDelete));
                        CourseLesson::whereIn('id', $lessonsToDelete)->delete();
                    }
                }
            }
            
            // Delete modules that weren't updated
            $modulesToDelete = array_diff($existingModuleIds, $updatedModuleIds);
            if (!empty($modulesToDelete)) {
                \Log::info('Deleting modules: ' . json_encode($modulesToDelete));
                // Delete associated lessons first
                CourseLesson::whereIn('course_module_id', $modulesToDelete)->delete();
                // Then delete the modules
                CourseModule::whereIn('id', $modulesToDelete)->delete();
            }
            
            // Update the course's lastUpdate timestamp
            $course->lastUpdate = Carbon::now()->format('Y-m-d H:i:s');
            $course->save();
            
            // Commit the transaction
            DB::commit();
            
            // Return the updated course with modules and lessons
            $updatedCourse = Course::with('modules.lessons')->findOrFail($id);
            \Log::info('Successfully updated modules for course: ' . $id);
            return response()->json($updatedCourse);
            
        } catch (\Exception $e) {
            // Rollback the transaction if something goes wrong
            DB::rollBack();
            \Log::error('Error updating modules: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the purchases count for a course.
     */
    public function updatePurchasesCount(Request $request, string $id)
    {
        try {
            \Log::info('Updating purchases count for course: ' . $id);
            \Log::info('Request data: ' . json_encode($request->all()));
            
            $course = Course::findOrFail($id);
            \Log::info('Course found: ' . $course->name);
            
            // Validate the request
            $validated = $request->validate([
                'purchases_count' => 'required|integer|min:0',
            ]);
            
            // Update the purchases count
            $course->update([
                'purchases_count' => $validated['purchases_count']
            ]);
            
            \Log::info('Purchases count updated successfully to: ' . $validated['purchases_count']);
            
            return response()->json([
                'success' => true,
                'message' => 'Purchases count updated successfully',
                'course' => $course
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating purchases count: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update purchases count',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            \Log::info('Deleting course: ' . $id);
            
            $course = Course::findOrFail($id);
            \Log::info('Course found for deletion: ' . $course->name);
            
            // Start a database transaction
            DB::beginTransaction();
            
            // Delete associated lessons first
            $moduleIds = $course->modules()->pluck('id')->toArray();
            if (!empty($moduleIds)) {
                \Log::info('Deleting lessons for modules: ' . json_encode($moduleIds));
                CourseLesson::whereIn('course_module_id', $moduleIds)->delete();
            }
            
            // Delete associated modules
            \Log::info('Deleting modules for course: ' . $id);
            $course->modules()->delete();
            
            // Delete associated reviews if they exist
            if (class_exists('App\\Models\\Review')) {
                \Log::info('Deleting reviews for course: ' . $id);
                $course->reviews()->delete();
            }
            
            // Delete the course image if it exists
            if ($course->image_url && !str_starts_with($course->image_url, 'http')) {
                $imagePath = str_replace('/storage/', '', $course->image_url);
                if (Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                    \Log::info('Deleted course image: ' . $imagePath);
                }
            }
            
            // Delete the course
            $course->delete();
            \Log::info('Course deleted successfully: ' . $id);
            
            // Commit the transaction
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Course deleted successfully'
            ]);
            
        } catch (\Exception $e) {
            // Rollback the transaction if something goes wrong
            DB::rollBack();
            \Log::error('Error deleting course: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete course',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Optimize and store an uploaded image
     * 
     * @param \Illuminate\Http\UploadedFile $image
     * @return string The path to the stored image
     */
    private function optimizeAndStoreImage($image)
    {
        try {
            // Get the intervention image instance
            $img = \Intervention\Image\Facades\Image::make($image);
            
            // Get original dimensions
            $originalWidth = $img->width();
            $originalHeight = $img->height();
            
            // Resize if larger than 1200px width while maintaining aspect ratio
            if ($originalWidth > 1200) {
                $img->resize(1200, null, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });
            }
            
            // Check if we should convert to WebP (if supported by server)
            if (function_exists('imagewebp')) {
                // Generate a unique filename
                $filename = 'course_' . time() . '_' . uniqid() . '.webp';
                
                // Save as WebP with 85% quality
                $path = 'course_images/' . $filename;
                $img->encode('webp', 85)->save(storage_path('app/public/' . $path));
                
                \Log::info('Image optimized and saved as WebP: ' . $path);
            } else {
                // If WebP is not supported, use original format with optimized quality
                $extension = $image->getClientOriginalExtension();
                $filename = 'course_' . time() . '_' . uniqid() . '.' . $extension;
                $path = 'course_images/' . $filename;
                
                // Save with optimized quality
                $img->save(storage_path('app/public/' . $path), 85);
                
                \Log::info('Image optimized and saved as ' . $extension . ': ' . $path);
            }
            
            return $path;
        } catch (\Exception $e) {
            \Log::error('Error optimizing image: ' . $e->getMessage());
            
            // Fallback to standard upload if optimization fails
            $path = $image->store('course_images', 'public');
            return $path;
        }
    }
}
