<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Api\PortfolioController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- NHÓM 1: CÁC ROUTE CÔNG KHAI (PUBLIC) ---
Route::group(['prefix' => 'auth'], function () {
    // Luồng đăng ký/đăng nhập truyền thống
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    
    // Luồng đăng nhập Google
    Route::get('google', [AuthController::class, 'redirectToGoogle']);
    Route::get('google/callback', [AuthController::class, 'handleGoogleCallback']);
    
    // Luồng khôi phục tài khoản 
    Route::post('forgot-password', [ForgotPasswordController::class, 'sendResetLink']);
    Route::post('reset-password', [ForgotPasswordController::class, 'resetPassword']);
    
    // Refresh token: Cần để public vì khi Access Token hết hạn, 
    // user sẽ dùng cái này để lấy lại quyền truy cập mà không cần nhập pass lại.
    Route::post('refresh', [AuthController::class, 'refresh']);

    // Route Tin tức mới nhất (Công khai cho SSR)
    Route::get('news', [\App\Http\Controllers\Api\NewsController::class, 'index']);
});

// --- NHÓM 2: CÁC ROUTE CẦN ĐĂNG NHẬP (PROTECTED) ---
Route::middleware('auth:api')->group(function () {
    
    Route::group(['prefix' => 'auth'], function () {
        // Lấy thông tin user hiện tại
        Route::get('me', [AuthController::class, 'me']); // Nên tạo hàm me() trong AuthController
        
        // Đăng xuất (Phải login mới đăng xuất được để vô hiệu hóa Token)
        Route::post('logout', [AuthController::class, 'logout']);
    });

    // Các Route liên quan đến dữ liệu nhạy cảm khác
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });
    Route::get('/portfolio', [PortfolioController::class, 'index']);
    Route::post('/portfolio/add', [PortfolioController::class, 'store']);
    Route::delete('/portfolio/{symbol}', [PortfolioController::class, 'destroy']);

});