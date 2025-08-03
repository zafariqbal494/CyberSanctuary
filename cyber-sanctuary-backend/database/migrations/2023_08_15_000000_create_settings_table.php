<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('description')->nullable();
            $table->timestamps();
        });
        
        // Insert default wallet address
        DB::table('settings')->insert([
            'key' => 'wallet_address',
            'value' => 'TRDmABcVVp1cGGopCBWxQFXVN5ppX5xNhg',
            'description' => 'Bitcoin wallet address for payments (TRC20)',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        // Insert default network name
        DB::table('settings')->insert([
            'key' => 'network_name',
            'value' => 'Tron (TRC20)',
            'description' => 'Cryptocurrency network name for payments',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
}; 