'use client';

import { cn } from '@/core/utils';
import { Header, Sidebar } from '@/shared/components/layout';
import { useAppSelector } from '@/store';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const sidebarCollapsed = useAppSelector((state) => state.settings.sidebarCollapsed);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      <main
        className={cn(
          'min-h-screen pt-16 transition-all duration-300',
          sidebarCollapsed ? 'pl-16' : 'pl-64'
        )}
      >
        <div className="container py-6">{children}</div>
      </main>
    </div>
  );
}
