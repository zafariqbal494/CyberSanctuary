<?php

namespace Database\Seeders;

use App\Models\Payment;
use Illuminate\Database\Seeder;

class TestPaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a test payment
        Payment::create([
            'order_id' => 'TEST-' . strtoupper(substr(md5(time()), 0, 8)),
            'username' => 'testuser',
            'email' => 'test@example.com',
            'course_id' => 1,
            'amount' => 99.99,
            'screenshot_path' => 'payment_screenshots/test.jpg',
            'status' => 'pending'
        ]);
        
        $this->command->info('Test payment created successfully!');
    }
} 