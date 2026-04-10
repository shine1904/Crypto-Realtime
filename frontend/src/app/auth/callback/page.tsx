'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // 1. Lấy token từ URL (?token=...)
        const token = searchParams.get('token');

        if (token) {
            // 2. Lưu Access Token vào localStorage để dùng cho các API sau
            localStorage.setItem('access_token', token);

            // 3. Thông báo thành công và redirect về trang chủ (Landing Page)
            // Bạn có thể dùng toast hoặc thông báo ở đây
            console.log('Google Login Successful!');
            
            // Đợi 1 chút để user thấy thông báo hoặc chuyển ngay
            router.push('/'); 
        } else {
            // Nếu không thấy token, đá về trang login và báo lỗi
            router.push('/login?error=missing_token');
        }
    }, [searchParams, router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#111417] text-[#f0b90b]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f0b90b] mx-auto"></div>
                <h2 className="mt-4 font-bold uppercase tracking-widest">Xác thực tài khoản Google...</h2>
                <p className="text-[#d3c5ac] text-sm mt-2">Vui lòng đợi trong giây lát</p>
            </div>
        </div>
    );
}