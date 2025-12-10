'use client';

import {
  BarChart3,
  ChevronLeft,
  Code,
  Component,
  FormInput,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Table,
  Users,
  FileJson,
  Activity,
  Network,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useTranslations } from '@/core/hooks';
import { cn } from '@/core/utils';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleSidebarCollapse } from '@/store/slices/settingsSlice';

import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface NavItem {
  titleKey: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { titleKey: 'nav.dashboard', href: '/', icon: LayoutDashboard },
  { titleKey: 'organization.title', href: '/organization', icon: BarChart3 },
  { titleKey: 'roles.title', href: '/roles', icon: Users },
  { titleKey: 'users.title', href: '/users', icon: Users },
  { titleKey: 'bpmn.title', href: '/bpmn', icon: FileJson },
  { titleKey: 'performance.title', href: '/performance', icon: Activity },
  { titleKey: 'advanced.title', href: '/advanced', icon: Network },
];

const bottomNavItems: NavItem[] = [
  { titleKey: 'nav.settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector((state) => state.settings.sidebarCollapsed);
  const { t } = useTranslations();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b px-4 py-8">
          {!collapsed && (
            <span className="text-lg font-bold text-primary">Organizational Mining</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(toggleSidebarCollapse())}
            className={cn('h-8 w-8', collapsed && 'mx-auto')}
          >
            <ChevronLeft
              className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')}
            />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            const title = t(item.titleKey as Parameters<typeof t>[0]);

            const linkContent = (
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  collapsed && 'justify-center px-2'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{title}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right">{title}</TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.href}>{linkContent}</div>;
          })}
        </nav>

        <Separator />

        <div className="p-2">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            const title = t(item.titleKey as Parameters<typeof t>[0]);

            const linkContent = (
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  collapsed && 'justify-center px-2'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{title}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right">{title}</TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.href}>{linkContent}</div>;
          })}
        </div>
      </div>
    </aside>
  );
}
