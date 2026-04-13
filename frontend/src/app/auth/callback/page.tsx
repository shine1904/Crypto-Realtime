'use client';
import { Suspense } from 'react';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function AuthCallbackInner() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('access_token', token);
            console.log('Google Login Successful!');
            router.push('/');
        } else {
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

export default function AuthCallback() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-[#111417] text-[#f0b90b]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f0b90b] mx-auto" />
            </div>
        }>
            <AuthCallbackInner />
        </Suspense>
    );
}