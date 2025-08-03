<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Course;
use App\Models\User;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all courses
        $courses = Course::all();
        
        if ($courses->isEmpty()) {
            $this->command->info('No courses found. Please run CourseSeeder first.');
            return;
        }
        
        // Get or create some users for reviews
        $users = User::take(5)->get();
        
        if ($users->isEmpty()) {
            // Create some users if none exist
            $users = [];
            for ($i = 1; $i <= 5; $i++) {
                $users[] = User::create([
                    'name' => 'User ' . $i,
                    'email' => 'user' . $i . '@example.com',
                    'password' => bcrypt('password'),
                    'username' => 'user' . $i,
                ]);
            }
        }
        
        // Sample review content
        $reviewContents = [
            'This course is excellent! I learned a lot about cybersecurity fundamentals.',
            'The instructor explains complex concepts in an easy-to-understand way.',
            'Great hands-on exercises. I feel much more confident in my skills now.',
            'Some parts were too advanced for me, but overall it was worth it.',
            'The course materials are up-to-date with the latest security trends.',
            'I would have liked more practical examples, but the theory was solid.',
            'Excellent value for money. I\'ve already applied what I learned at work.',
            'The course structure is logical and builds knowledge progressively.',
            'I appreciated the real-world scenarios and case studies.',
            'The labs were challenging but very educational.'
        ];
        
        // Clear existing reviews
        DB::table('reviews')->delete();
        
        // Create 30 random reviews
        $reviews = [];
        for ($i = 0; $i < 30; $i++) {
            $course = $courses->random();
            $user = $users[array_rand($users instanceof \Illuminate\Database\Eloquent\Collection ? $users->toArray() : $users)];
            $rating = rand(3, 5); // Biased towards positive ratings
            $helpfulCount = rand(0, 25);
            
            $reviews[] = [
                'course_id' => $course->id,
                'user_id' => $user->id,
                'user_name' => $user->name,
                'rating' => $rating,
                'content' => $reviewContents[array_rand($reviewContents)],
                'helpful_count' => $helpfulCount,
                'created_at' => now()->subDays(rand(1, 60)),
                'updated_at' => now(),
            ];
        }
        
        DB::table('reviews')->insert($reviews);
        
        $this->command->info('Reviews seeded successfully.');
    }
} 