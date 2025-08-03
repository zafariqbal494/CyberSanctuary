<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next): Response
    {
        Log::info('Admin middleware check', [
            'user' => $request->user() ? $request->user()->id : 'No user',
            'is_admin' => $request->user() ? $request->user()->is_admin : false
        ]);
        
        if (auth()->check() && auth()->user()->is_admin) {
            return $next($request);
        }
        
        return response()->json(['error' => 'Unauthorized. Admin access required.'], 403);
    }
}
