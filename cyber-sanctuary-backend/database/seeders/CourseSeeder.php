<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('courses')->delete();
        DB::table('course_modules')->delete();
        DB::table('course_lessons')->delete();

        $courseData = [
            'name' => 'Advanced Penetration Testing',
            'description' => 'Learn advanced penetration testing techniques and methodologies used by ethical hackers and security professionals.',
            'shortDescription' => 'Master ethical hacking and penetration testing',
            'icon' => 'key',
            'image_url' => 'https://via.placeholder.com/800x450/0f0f0f/00ff41?text=Advanced+Penetration+Testing',
            'price' => 299.99,
            'duration' => '40 hours',
            'topics' => json_encode(['Network Scanning', 'Vulnerability Assessment', 'Exploitation', 'Web Application Testing']),
            'specifications' => json_encode(['Hands-on labs', 'Certificate of completion', '24/7 support']),
            'lastUpdate' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ];

        $courseId = DB::table('courses')->insertGetId($courseData);

        $curriculum = [
            [
                'title' => 'Introduction to Penetration Testing',
                'description' => 'Learn the fundamentals of ethical hacking and the penetration testing methodology.',
                'durationMinutes' => 120,
                'lessons' => [
                    ['title' => 'What is Penetration Testing?', 'durationMinutes' => 15, 'type' => 'video'],
                    ['title' => 'Legal and Ethical Considerations', 'durationMinutes' => 25, 'type' => 'video'],
                    ['title' => 'Setting Up Your Lab Environment', 'durationMinutes' => 45, 'type' => 'practical'],
                    ['title' => 'First Steps in Reconnaissance', 'durationMinutes' => 35, 'type' => 'exercise']
                ]
            ],
            [
                'title' => 'Network Vulnerability Assessment',
                'description' => 'Discover how to identify and exploit network vulnerabilities using industry-standard tools.',
                'durationMinutes' => 180,
                'lessons' => [
                    ['title' => 'Network Scanning Techniques', 'durationMinutes' => 30, 'type' => 'video'],
                    ['title' => 'Working with Nmap', 'durationMinutes' => 45, 'type' => 'practical'],
                    ['title' => 'Vulnerability Analysis', 'durationMinutes' => 40, 'type' => 'video'],
                    ['title' => 'Hands-on Network Assessment', 'durationMinutes' => 65, 'type' => 'lab']
                ]
            ],
            [
                'title' => 'Web Application Security Testing',
                'description' => 'Master techniques for finding and exploiting common web application vulnerabilities.',
                'durationMinutes' => 210,
                'lessons' => [
                    ['title' => 'Common Web Vulnerabilities', 'durationMinutes' => 35, 'type' => 'video'],
                    ['title' => 'Using OWASP ZAP', 'durationMinutes' => 50, 'type' => 'practical'],
                    ['title' => 'SQL Injection Techniques', 'durationMinutes' => 45, 'type' => 'video'],
                    ['title' => 'Cross-Site Scripting (XSS) Attacks', 'durationMinutes' => 40, 'type' => 'practical'],
                    ['title' => 'Web App Penetration Test', 'durationMinutes' => 40, 'type' => 'lab']
                ]
            ]
        ];

        foreach ($curriculum as $moduleOrder => $moduleData) {
            $moduleId = DB::table('course_modules')->insertGetId([
                'course_id' => $courseId,
                'title' => $moduleData['title'],
                'description' => $moduleData['description'],
                'order' => $moduleOrder + 1,
                'durationMinutes' => $moduleData['durationMinutes'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach ($moduleData['lessons'] as $lessonOrder => $lessonData) {
                DB::table('course_lessons')->insert([
                    'course_module_id' => $moduleId,
                    'title' => $lessonData['title'],
                    'order' => $lessonOrder + 1,
                    'durationMinutes' => $lessonData['durationMinutes'],
                    'type' => $lessonData['type'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
