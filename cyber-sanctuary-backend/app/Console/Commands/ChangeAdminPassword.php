<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class ChangeAdminPassword extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:password {password}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Change the admin user password';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $password = $this->argument('password');
        
        if (strlen($password) < 6) {
            $this->error('Password must be at least 6 characters long');
            return 1;
        }
        
        $admin = User::where('username', 'admin')->first();
        
        if (!$admin) {
            $this->error('Admin user not found');
            return 1;
        }
        
        $admin->password = Hash::make($password);
        $admin->save();
        
        $this->info('Admin password changed successfully');
        return 0;
    }
} 