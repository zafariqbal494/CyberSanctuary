<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;
use Illuminate\Support\Facades\Validator;

class SettingsController extends Controller
{
    /**
     * Get all settings
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $settings = Setting::pluck('value', 'key')->toArray();
        
        return response()->json([
            'walletAddress' => $settings['wallet_address'] ?? '',
            'networkName' => $settings['network_name'] ?? 'Tron (TRC20)',
            'telegramLink' => $settings['telegram_link'] ?? 'https://t.me/CyberTraining',
            // Add other settings as needed
        ]);
    }
    
    /**
     * Get wallet address setting
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getWalletAddress()
    {
        $walletAddress = Setting::where('key', 'wallet_address')->value('value') ?? '';
        $networkName = Setting::where('key', 'network_name')->value('value') ?? 'Tron (TRC20)';
        
        return response()->json([
            'walletAddress' => $walletAddress,
            'networkName' => $networkName
        ]);
    }
    
    /**
     * Get telegram link setting
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTelegramLink()
    {
        $telegramLink = Setting::where('key', 'telegram_link')->value('value') ?? 'https://t.me/CyberTraining';
        
        return response()->json([
            'telegramLink' => $telegramLink
        ]);
    }
    
    /**
     * Update wallet address
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateWalletAddress(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'walletAddress' => 'required|string|min:10|max:255',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        
        Setting::updateOrCreate(
            ['key' => 'wallet_address'],
            ['value' => $request->walletAddress]
        );
        
        return response()->json([
            'message' => 'Wallet address updated successfully',
            'walletAddress' => $request->walletAddress
        ]);
    }
    
    /**
     * Update network name
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateNetworkName(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'networkName' => 'required|string|max:50',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        
        Setting::updateOrCreate(
            ['key' => 'network_name'],
            ['value' => $request->networkName]
        );
        
        return response()->json([
            'message' => 'Network name updated successfully',
            'networkName' => $request->networkName
        ]);
    }
    
    /**
     * Update telegram link
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateTelegramLink(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'telegramLink' => 'required|string|url|max:255',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        
        Setting::updateOrCreate(
            ['key' => 'telegram_link'],
            ['value' => $request->telegramLink]
        );
        
        return response()->json([
            'message' => 'Telegram link updated successfully',
            'telegramLink' => $request->telegramLink
        ]);
    }
    
    /**
     * Update payment settings
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updatePaymentSettings(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'walletAddress' => 'required|string|min:10|max:255',
            'networkName' => 'required|string|max:50',
            'telegramLink' => 'nullable|string|url|max:255',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        
        Setting::updateOrCreate(
            ['key' => 'wallet_address'],
            ['value' => $request->walletAddress]
        );
        
        Setting::updateOrCreate(
            ['key' => 'network_name'],
            ['value' => $request->networkName]
        );
        
        if ($request->has('telegramLink')) {
            Setting::updateOrCreate(
                ['key' => 'telegram_link'],
                ['value' => $request->telegramLink]
            );
        }
        
        return response()->json([
            'message' => 'Payment settings updated successfully',
            'walletAddress' => $request->walletAddress,
            'networkName' => $request->networkName,
            'telegramLink' => $request->telegramLink ?? Setting::where('key', 'telegram_link')->value('value')
        ]);
    }
} 