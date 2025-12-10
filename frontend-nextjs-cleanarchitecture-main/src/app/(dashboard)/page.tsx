'use client';

import { useEffect, useState } from 'react';
import { Activity, Users, GitMerge, FileJson, TrendingUp, Network, Share2 } from 'lucide-react';
import Link from 'next/link';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

import { analyticsApi } from '@/core/api/analytics';
import { MetricCard } from '@/shared/components/ui/metric-card';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { MonthlyInteraction } from '@/core/types/analytics';
import { useTranslations } from '@/core/hooks';

export default function DashboardPage() {
  const { t } = useTranslations();
  const [stats, setStats] = useState({
    activeUsers: 0,
    activeRoles: 0,
    totalInteractions: 0,
  });
  const [trendData, setTrendData] = useState<MonthlyInteraction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch initial data for summary
        const evolution = await analyticsApi.getOrganizationEvolution({
          start_month: '2024-01',
          end_month: '2024-12',
        });

        if (evolution) {
          setStats({
            activeUsers: evolution.active_users,
            activeRoles: evolution.active_roles,
            totalInteractions: evolution.total_interactions,
          });
        }

        // Fetch trend data
        const trend = await analyticsApi.getInteractionsTrend('2024');
        setTrendData(trend);

      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h2>
        <p className="text-muted-foreground">
          {t('dashboard.subtitle')}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title={t('organization.activeRoles')}
          value={loading ? '...' : stats.activeRoles}
          description={t('organization.description')}
          icon={GitMerge}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-100 dark:border-blue-900"
        />
        <MetricCard
          title={t('organization.activeUsers')}
          value={loading ? '...' : stats.activeUsers}
          description={t('users.description')}
          icon={Users}
          className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-100 dark:border-green-900"
        />
        <MetricCard
          title={t('organization.totalInteractions')}
          value={loading ? '...' : stats.totalInteractions}
          description={t('roles.description')}
          icon={Activity}
          className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-100 dark:border-orange-900"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t('organization.trendTitle')}</CardTitle>
            <CardDescription>{t('organization.trendDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area type="monotone" dataKey="total_interactions" stroke="#8884d8" fillOpacity={1} fill="url(#colorInteractions)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t('organization.quickAccess')}</CardTitle>
            <CardDescription>{t('organization.quickAccessDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link href="/organization" className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted transition-colors">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                <TrendingUp className="h-4 w-4 text-blue-700 dark:text-blue-300" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">{t('organization.title')}</h4>
                <p className="text-xs text-muted-foreground">{t('organization.description')}</p>
              </div>
            </Link>
            <Link href="/roles" className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted transition-colors">
              <div className="rounded-full bg-indigo-100 p-2 dark:bg-indigo-900">
                <Network className="h-4 w-4 text-indigo-700 dark:text-indigo-300" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">{t('roles.title')}</h4>
                <p className="text-xs text-muted-foreground">{t('roles.description')}</p>
              </div>
            </Link>
            <Link href="/users" className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted transition-colors">
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                <Share2 className="h-4 w-4 text-green-700 dark:text-green-300" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">{t('users.title')}</h4>
                <p className="text-xs text-muted-foreground">{t('users.description')}</p>
              </div>
            </Link>
            <Link href="/bpmn" className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted transition-colors">
              <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900">
                <FileJson className="h-4 w-4 text-orange-700 dark:text-orange-300" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">{t('bpmn.title')}</h4>
                <p className="text-xs text-muted-foreground">{t('bpmn.description')}</p>
              </div>
            </Link>
            <Link href="/performance" className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted transition-colors">
              <div className="rounded-full bg-red-100 p-2 dark:bg-red-900">
                <Activity className="h-4 w-4 text-red-700 dark:text-red-300" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">{t('performance.title')}</h4>
                <p className="text-xs text-muted-foreground">{t('performance.description')}</p>
              </div>
            </Link>
            <Link href="/advanced" className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted transition-colors">
              <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                <Network className="h-4 w-4 text-purple-700 dark:text-purple-300" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">{t('advanced.title')}</h4>
                <p className="text-xs text-muted-foreground">{t('advanced.description')}</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
