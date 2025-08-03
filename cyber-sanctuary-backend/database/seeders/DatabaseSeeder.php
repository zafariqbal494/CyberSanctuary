<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Course;
use App\Models\CourseModule;
use App\Models\CourseLesson;
use App\Models\Review;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Call specific seeders
        $this->call([
            NetworkSecurityReviewsSeeder::class,
        ]);
        
        // Create admin user if it doesn't exist
        User::firstOrCreate(
            ['email' => 'admin@cybersanctuary.com'],
            [
                'name' => 'Admin',
            'username' => 'admin',
            'password' => Hash::make('password'),
            'is_admin' => true,
            ]
        );

        // Create sample courses
        $courses = [
            [
                'name' => 'Network Security Fundamentals',
                'shortDescription' => 'Learn the basics of securing networks against cyber threats',
                'description' => 'This comprehensive course covers the essential concepts and practices of network security. From understanding common vulnerabilities to implementing robust security measures, you\'ll gain the knowledge needed to protect networks from various cyber threats.',
                'price' => 99.99,
                'icon' => 'network',
                'image_url' => '/storage/courses/network-security.jpg',
                'duration' => '8 hours',
                'lastUpdate' => now()->subDays(14),
                'purchases_count' => 245,
                'specifications' => json_encode([
                    'Comprehensive network security overview',
                    'Practical hands-on exercises',
                    'Real-world case studies',
                    'Certificate of completion'
                ])
            ],
            [
                'name' => 'Ethical Hacking Masterclass',
                'shortDescription' => 'Master the art of ethical hacking and penetration testing',
                'description' => 'Dive deep into the world of ethical hacking with this masterclass. Learn how to identify and exploit vulnerabilities in systems and networks, all while adhering to ethical principles. This course provides hands-on experience with industry-standard tools and techniques.',
                'price' => 149.99,
                'icon' => 'search',
                'image_url' => '/storage/courses/ethical-hacking.jpg',
                'duration' => '12 hours',
                'lastUpdate' => now()->subDays(7),
                'purchases_count' => 189,
                'specifications' => json_encode([
                    'Advanced penetration testing techniques',
                    'Vulnerability assessment methodologies',
                    'Exploitation frameworks and tools',
                    'Reporting and documentation best practices'
                ])
            ],
            [
                'name' => 'Cryptography and Secure Communications',
                'shortDescription' => 'Understand the principles of modern cryptography',
                'description' => 'Explore the fascinating world of cryptography and secure communications. This course covers everything from classical ciphers to modern encryption algorithms, digital signatures, and secure key exchange protocols.',
                'price' => 129.99,
                'icon' => 'key',
                'image_url' => '/storage/courses/cryptography.jpg',
                'duration' => '10 hours',
                'lastUpdate' => now()->subDays(21),
                'purchases_count' => 156,
                'specifications' => json_encode([
                    'Symmetric and asymmetric encryption',
                    'Hash functions and digital signatures',
                    'Secure key exchange protocols',
                    'Blockchain cryptography basics'
                ])
            ]
        ];

        foreach ($courses as $courseData) {
            // Check if course exists by name
            $existingCourse = Course::where('name', $courseData['name'])->first();
            
            if (!$existingCourse) {
                $course = Course::create($courseData);
                
                // Create sample modules for each course
                for ($i = 1; $i <= 3; $i++) {
                    $module = CourseModule::create([
                        'course_id' => $course->id,
                        'title' => "Module $i: " . $this->getModuleTitle($i),
                        'description' => "This module covers important concepts related to " . $this->getModuleTitle($i),
                        'durationMinutes' => rand(45, 120),
                        'order' => $i
                    ]);
                    
                    // Create sample lessons for each module
                    for ($j = 1; $j <= 4; $j++) {
                        CourseLesson::create([
                            'course_module_id' => $module->id,
                            'title' => "Lesson $j: " . $this->getLessonTitle($j),
                            'durationMinutes' => rand(10, 30),
                            'type' => $this->getLessonType($j),
                            'order' => $j
                        ]);
                    }
                }
                
                // Create sample reviews for each course
                $this->createReviewsForCourse($course->id);
            } else {
                // If course exists, ensure it has reviews
                if (Review::where('course_id', $existingCourse->id)->count() === 0) {
                    $this->createReviewsForCourse($existingCourse->id);
                }
            }
        }
    }
    
    /**
     * Get a sample module title based on index
     */
    private function getModuleTitle($index)
    {
        $titles = [
            'Introduction and Fundamentals',
            'Advanced Techniques and Tools',
            'Practical Applications and Case Studies'
        ];
        
        return $titles[$index - 1] ?? 'Additional Content';
    }
    
    /**
     * Get a sample lesson title based on index
     */
    private function getLessonTitle($index)
    {
        $titles = [
            'Core Concepts Overview',
            'Practical Demonstration',
            'Hands-on Exercise',
            'Review and Assessment'
        ];
        
        return $titles[$index - 1] ?? 'Additional Lesson';
    }
    
    /**
     * Get a sample lesson type based on index
     */
    private function getLessonType($index)
    {
        $types = ['video', 'quiz', 'exercise', 'reading'];
        return $types[$index - 1] ?? 'video';
    }
    
    /**
     * Create sample reviews for a course
     */
    private function createReviewsForCourse($courseId)
    {
        $reviewsData = [
            [
                'rating' => 5,
                'content' => 'Excellent course! The content was well-structured and easy to follow. I learned a lot and would highly recommend it.',
                'helpful_count' => rand(5, 20)
            ],
            [
                'rating' => 4,
                'content' => 'Very informative course with practical examples. The instructor explains concepts clearly. Could use more hands-on exercises.',
                'helpful_count' => rand(3, 15)
            ],
            [
                'rating' => 5,
                'content' => 'This course exceeded my expectations. The real-world examples made complex topics much easier to understand.',
                'helpful_count' => rand(8, 25)
            ]
        ];
        
        // Create a regular user for reviews if it doesn't exist
        $user = User::firstOrCreate(
            ['email' => 'user@cybersanctuary.com'],
            [
                'name' => 'Regular User',
                'username' => 'user',
                'password' => Hash::make('password'),
                'is_admin' => false,
            ]
        );
        
        foreach ($reviewsData as $reviewData) {
            Review::create([
                'course_id' => $courseId,
                'user_id' => $user->id,
                'user_name' => $user->name,
                'rating' => $reviewData['rating'],
                'content' => $reviewData['content'],
                'helpful_count' => $reviewData['helpful_count']
            ]);
        }
    }
}
