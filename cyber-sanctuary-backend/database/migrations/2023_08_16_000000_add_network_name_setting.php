<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Check if the setting already exists
        $exists = DB::table('settings')->where('key', 'network_name')->exists();
        
        if (!$exists) {
            // Insert default network name
            DB::table('settings')->insert([
                'key' => 'network_name',
                'value' => 'Tron (TRC20)',
                'description' => 'Cryptocurrency network name for payments',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('settings')->where('key', 'network_name')->delete();
    }
}; 