import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ApolloWrapper } from "@/lib/apollo-wrapper";
import { AuthProvider } from "@/app/context/AuthContext";

// Cấu hình Font Inter với hỗ trợ Tiếng Việt
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "Binance Clone",
  description: "Dự án Crypto Portfolio Tracker",
};

// CHỈ GIỮ LẠI DUY NHẤT 1 HÀM RootLayout NÀY
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable}`}>
      <head>
        {/* Nhúng Google Material Symbols để hiển thị các icon như visibility, grid_view... */}
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" 
        />
      </head>
      <body className="bg-[#0B0E11] text-[#EAECEF] antialiased font-sans">
        {/* AuthProvider bọc toàn bộ app — mọi page đều dùng được useAuth() */}
        <AuthProvider>
          {/* ApolloWrapper cho GraphQL */}
          <ApolloWrapper>
            {children}
          </ApolloWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}