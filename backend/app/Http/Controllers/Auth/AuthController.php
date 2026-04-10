<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    // --- ĐĂNG KÝ ---
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return $this->respondWithTokens($user);
    }

    // --- ĐĂNG NHẬP ---
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json(['error' => 'Email hoặc mật khẩu không chính xác'], 401);
        }

        return $this->respondWithTokens(auth('api')->user(), $token);
    }

    // --- LOGIC CẤP TOKEN (Dùng chung) ---
    protected function respondWithTokens($user, $token = null)
    {
        // Nếu chưa có token (từ register), tạo mới
        if (!$token) {
            $token = auth('api')->login($user);
        }

        $refreshToken = Str::random(64);

        // Lưu Hash của RT vào Postgres để đối soát (Chuẩn KMA)
        $user->update([
            'refresh_token' => hash('sha256', $refreshToken)
        ]);

        // Tạo Cookie HttpOnly (Hết hạn sau 24h = 1440 phút)
        $cookie = cookie(
            'refresh_token', 
            $refreshToken, 
            1440, 
            null, 
            null, 
            false, // Đổi thành true nếu dùng HTTPS (Production)
            true   // HttpOnly: Quan trọng nhất để chống XSS
        );

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60, // 15 phút (900s)
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]
        ])->withCookie($cookie);
    }

    // --- ĐĂNG XUẤT ---
    public function logout()
    {
        $user = auth('api')->user();
        if ($user) {
            $user->update(['refresh_token' => null]);
        }

        auth('api')->logout();

        return response()->json(['message' => 'Đã đăng xuất thành công'])
               ->withoutCookie('refresh_token');
    }
    public function redirectToGoogle()
{
    // Chế độ stateless() là bắt buộc khi làm API (JWT)
    return Socialite::driver('google')->stateless()->redirect();
}

public function handleGoogleCallback()
{
    try {
        $googleUser = Socialite::driver('google')->stateless()->user();
        
        // Tìm user theo email hoặc tạo mới
        $user = User::updateOrCreate([
            'email' => $googleUser->getEmail(),
        ], [
            'name' => $googleUser->getName(),
            'google_id' => $googleUser->getId(),
            'avatar' => $googleUser->getAvatar(),
            // Tạo pass ngẫu nhiên để không bị lỗi null nếu bạn chưa cho phép nullable hoàn toàn
            'password' => $user->password ?? bcrypt(Str::random(24)), 
        ]);

        // Đăng nhập user và tạo Access Token
        $token = auth('api')->login($user);

        // Gọi hàm cấp tokens (Hàm này của Quang đã có logic set Cookie Refresh Token rồi)
        $this->respondWithTokens($user, $token);

        // Redirect người dùng quay lại trang callback của Next.js kèm theo token
        return redirect()->to("http://localhost:3000/auth/callback?token={$token}");

    } catch (\Exception $e) {
        // Nếu lỗi, trả về trang login kèm thông báo
        return redirect()->to("http://localhost:3000/login?error=google_auth_failed");
    }
}
public function me()
{
    // Trả về thông tin user đang đăng nhập qua JWT
    return response()->json(auth('api')->user());
}
}