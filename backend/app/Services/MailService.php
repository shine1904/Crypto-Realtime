<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;
use App\Mail\ResetPasswordMail;
use Illuminate\Support\Facades\Log;
use App\Mail\GeneralNotificationMail; // Giả sử sau này bạn tạo thêm

class MailService
{
    /**
     * Gửi mail đặt lại mật khẩu
     */
    public function sendResetPasswordEmail($email, $token)
    {
        try {
            Mail::to($email)->send(new ResetPasswordMail($token, $email));
            return true;
        } catch (\Exception $e) {
            Log::error("Lỗi gửi mail Reset Password: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Gửi mail thông báo chung (Ví dụ sau này dùng)
     */
    public function sendNotification($email, $subject, $message)
    {
        // Logic gửi mail thông báo...
    }
}