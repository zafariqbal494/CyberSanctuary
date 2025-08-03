<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Course;
use App\Models\User;
use Carbon\Carbon;

class NetworkSecurityReviewsSeeder extends Seeder
{
    /**
     * Run the database seeds to add 25 reviews to Network Security Fundamentals course.
     */
    public function run(): void
    {
        // Find the Network Security Fundamentals course
        $course = Course::where('name', 'like', '%Network Security Fundamentals%')->first();
        
        if (!$course) {
            $this->command->error('Network Security Fundamentals course not found.');
            return;
        }
        
        // Get or create some users for reviews
        $users = User::take(10)->get();
        
        if ($users->count() < 10) {
            // Create additional users if needed
            $existingCount = $users->count();
            for ($i = $existingCount + 1; $i <= 10; $i++) {
                $username = 'cyberstudent' . $i;
                $users->push(User::create([
                    'name' => 'Cyber Student ' . $i,
                    'email' => $username . '@example.com',
                    'password' => bcrypt('password'),
                    'username' => $username,
                ]));
            }
        }
        
        // Realistic review content for network security course
        $reviewContents = [
            'The network packet analysis section was incredibly detailed and practical. I can now identify suspicious traffic patterns.',
            'This course gave me a solid foundation in network security principles. The firewall configuration labs were especially helpful.',
            'I appreciated the in-depth coverage of encryption protocols. The instructor explained complex concepts clearly.',
            'The section on VPN technologies was excellent. I now understand the differences between various tunneling protocols.',
            'Great course overall, but I would have liked more content on wireless network security.',
            'The hands-on labs for setting up secure network infrastructure were invaluable. Great practical experience!',
            'As a beginner in cybersecurity, this course provided the perfect introduction to network security concepts.',
            'The instructor\'s explanation of network attack vectors and mitigation strategies was outstanding.',
            'I\'ve implemented several of the security hardening techniques from this course in my company\'s network.',
            'The course content on intrusion detection systems was comprehensive and up-to-date.',
            'I found the section on network segmentation particularly useful for my work in a large enterprise.',
            'The practical demonstrations of network vulnerability scanning tools were excellent.',
            'This course strikes a good balance between theoretical concepts and practical applications.',
            'After completing this course, I feel much more confident in designing secure network architectures.',
            'The instructor\'s real-world examples made complex security concepts easier to understand.',
            'The module on secure routing protocols was particularly enlightening. Great technical depth!',
            'I appreciated the coverage of both traditional and software-defined networking security.',
            'The course materials on threat modeling for networks were extremely valuable.',
            'The instructor\'s expertise in network security is evident throughout the course.',
            'I\'ve taken several network security courses, and this one stands out for its practical approach.',
            'The section on secure remote access solutions was exactly what I needed for my current project.',
            'Great explanations of network security compliance frameworks and how to implement them.',
            'The labs on firewall rule configuration and testing were challenging but very educational.',
            'This course helped me understand the security implications of different network topologies.',
            'Excellent coverage of network traffic analysis and security monitoring.',
            'The incident response procedures for network breaches were well-documented and practical.',
            'I learned valuable skills for hardening network devices against common attacks.',
            'The course content on zero trust networking was cutting-edge and well-explained.',
            'After taking this course, I passed my network security certification exam with flying colors!',
            'The instructor\'s passion for network security made the course engaging and memorable.'
        ];
        
        // Usernames with cybersecurity theme
        $usernames = [
            'netdefender', 'packetshield', 'firewallpro', 'securenode', 'cybersentinel',
            'networkguardian', 'encryptionexpert', 'securityanalyst', 'threatblocker', 'cyberprotector',
            'securepacket', 'networkninja', 'firewallwizard', 'vpnmaster', 'securityguru',
            'packettracer', 'networksentry', 'cybershielder', 'securetunnel', 'datadefender',
            'threatneutralized', 'networksage', 'securityhawk', 'cyberarmor', 'packetguard'
        ];
        
        // Create 25 reviews for the Network Security Fundamentals course
        $reviews = [];
        for ($i = 0; $i < 25; $i++) {
            $user = $users->random();
            $rating = rand(3, 5); // Biased towards positive ratings
            $helpfulCount = rand(0, 30);
            $daysAgo = rand(1, 90);
            
            $reviews[] = [
                'course_id' => $course->id,
                'user_id' => $user->id,
                'user_name' => $usernames[$i], // Use themed usernames
                'rating' => $rating,
                'content' => $reviewContents[$i % count($reviewContents)],
                'helpful_count' => $helpfulCount,
                'created_at' => Carbon::now()->subDays($daysAgo),
                'updated_at' => Carbon::now(),
            ];
        }
        
        DB::table('reviews')->insert($reviews);
        
        $this->command->info('25 reviews added to Network Security Fundamentals course.');
    }
} 