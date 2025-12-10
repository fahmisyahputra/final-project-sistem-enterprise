'use client';

import { Globe, Menu, Moon, Sun, User } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useTranslations } from '@/core/hooks';
import { cn } from '@/core/utils';
import { useAppDispatch, useAppSelector } from '@/store';
import { Language, setLanguage, setTheme, toggleSidebarCollapse } from '@/store/slices/settingsSlice';

import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function Header() {
  const dispatch = useAppDispatch();
  const { theme, sidebarCollapsed, language } = useAppSelector((state) => state.settings);
  const { t } = useTranslations();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    if (theme === 'light') {
      dispatch(setTheme('dark'));
    } else if (theme === 'dark') {
      dispatch(setTheme('system'));
    } else {
      dispatch(setTheme('light'));
    }
  };

  const handleLanguageChange = (lang: Language) => {
    dispatch(setLanguage(lang));
  };

  return (
    <header
      className={cn(
        'fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 transition-all duration-300',
        sidebarCollapsed ? 'left-16' : 'left-64'
      )}
    >
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(toggleSidebarCollapse())}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Globe className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('settings.language')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleLanguageChange('en')}
              className={cn(language === 'en' && 'bg-accent')}
            >
              English
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleLanguageChange('id')}
              className={cn(language === 'id' && 'bg-accent')}
            >
              Bahasa Indonesia
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {mounted && theme === 'dark' ? (
            <Moon className="h-5 w-5" />
          ) : mounted && theme === 'light' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">MCI User</p>
                <p className="text-xs leading-none text-muted-foreground">user@mci.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t('nav.settings')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
