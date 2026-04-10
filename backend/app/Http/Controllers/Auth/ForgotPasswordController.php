<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request; // Sửa lỗi 'Unknown class: Request'
use App\Services\MailService;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ForgotPasswordController extends Controller
{
    protected $mailService;

    // Inject MailService vào qua constructor
    public function __construct(MailService $mailService)
    {
        $this->mailService = $mailService;
    }

    public function sendResetLink(Request $request)
    {
        // 1. Validate email đầu vào
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ], [
            'email.exists' => 'Email này không tồn tại trong hệ thống.'
        ]);

        // 2. TẠO BIẾN TOKEN (Đây là dòng bạn đang thiếu)
        $token = Str::random(64);
        $email = $request->email;

        // 3. Lưu token vào bảng password_reset_tokens
        // Dùng updateOrInsert để nếu user yêu cầu lại thì sẽ ghi đè token mới
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $email],
            [
                'token' => Hash::make($token), // Hash token để bảo mật database (chuẩn KMA)
                'created_at' => now()
            ]
        );

        // 4. Gọi Service để gửi mail (Truyền đúng biến $token vừa tạo)
        $isSent = $this->mailService->sendResetPasswordEmail($email, $token);

        if ($isSent) {
            return response()->json(['message' => 'Link đặt lại mật khẩu đã được gửi vào email!']);
        }

        return response()->json(['message' => 'Có lỗi xảy ra khi gửi mail.'], 500);
    }

    public function resetPassword(Request $request)
    {
        // ... Logic reset password giữ nguyên như cũ ...
    }
}