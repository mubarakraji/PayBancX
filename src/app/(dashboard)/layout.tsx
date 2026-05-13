'use client';

import { Sidebar } from '@/components/common/Sidebar';
import MobileMenu from '@/components/common/MobileMenu';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <MobileMenu />
      <div className="flex h-screen bg-[#F5F6F8] overflow-hidden">
        {/* Sidebar - Hidden on mobile/tablet (sm, md), shown on laptop (lg and up) */}
        <div className="hidden lg:flex flex-col">
          <Sidebar />
        </div>

        {/* Main Content Container */}
        <div className="flex-1 flex flex-col overflow-auto w-full">
          {/* Page Content - Fully responsive with max-width for desktop */}
          <main className="flex-1 overflow-auto w-full bg-[#F5F6F8]">
            <div className="h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}


