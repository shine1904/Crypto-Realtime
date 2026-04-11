import Navbar from '@/components/layout/Navbar';
import DashboardFooter from '@/components/layout/DashboardFooter';
import React from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <DashboardFooter />
    </>
  );
}
