'use client';

import { useTranslations } from '@/core/hooks';
import { cn } from '@/core/utils';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Separator,
} from '@/shared/components/ui';
import { useAppDispatch, useAppSelector } from '@/store';
import { Language, setLanguage, setTheme, Theme } from '@/store/slices/settingsSlice';

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { language, theme } = useAppSelector((state) => state.settings);
  const { t } = useTranslations();

  const languages: { value: Language; label: string }[] = [
    { value: 'en', label: 'English' },
    { value: 'id', label: 'Bahasa Indonesia' },
  ];

  const themes: { value: Theme; labelKey: string }[] = [
    { value: 'light', labelKey: 'settings.lightMode' },
    { value: 'dark', labelKey: 'settings.darkMode' },
    { value: 'system', labelKey: 'settings.systemMode' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h1>
        <p className="text-muted-foreground">
          {language === 'en'
            ? 'Manage your application preferences'
            : 'Kelola preferensi aplikasi Anda'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.language')}</CardTitle>
          <CardDescription>
            {language === 'en'
              ? 'Select your preferred language'
              : 'Pilih bahasa yang Anda inginkan'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <Button
                key={lang.value}
                variant={language === lang.value ? 'default' : 'outline'}
                onClick={() => dispatch(setLanguage(lang.value))}
              >
                {lang.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.theme')}</CardTitle>
          <CardDescription>
            {language === 'en'
              ? 'Choose your preferred theme'
              : 'Pilih tema yang Anda inginkan'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {themes.map((themeOption) => (
              <Button
                key={themeOption.value}
                variant={theme === themeOption.value ? 'default' : 'outline'}
                onClick={() => dispatch(setTheme(themeOption.value))}
              >
                {t(themeOption.labelKey as Parameters<typeof t>[0])}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>MCI Template Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">Version</Label>
              <p className="font-medium">2.0.0</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Framework</Label>
              <p className="font-medium">Next.js 14</p>
            </div>
            <div>
              <Label className="text-muted-foreground">UI Library</Label>
              <p className="font-medium">shadcn/ui + Radix UI</p>
            </div>
            <div>
              <Label className="text-muted-foreground">State Management</Label>
              <p className="font-medium">Redux Toolkit</p>
            </div>
          </div>
          <Separator />
          <p className="text-sm text-muted-foreground">
            Built with care by MCI Team. This template follows Clean Architecture principles
            for maintainable and scalable frontend applications.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
