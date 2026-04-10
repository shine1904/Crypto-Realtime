<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public $token; // Khai báo biến công khai
    public $email;

    // Phải nhận 2 biến này từ Controller/Service truyền sang
    public function __construct($token, $email)
    {
        $this->token = $token;
        $this->email = $email;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Đặt lại mật khẩu Crypto Realtime',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.reset-password',
            with: [
                'url' => "http://localhost:3000/reset-password?token={$this->token}&email={$this->email}"
            ]
        );
    }
}