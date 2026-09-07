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
      <div className="flex h-screen overflow-hidden bg-[#F5F6F8]">
        <div className="hidden lg:flex flex-col">
          <Sidebar />
        </div>

        <div className="flex-1 flex min-w-0 flex-col overflow-x-hidden overflow-y-auto">
          <main className="flex-1 w-full bg-[#F5F6F8]">
            <div className="min-h-full w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}


