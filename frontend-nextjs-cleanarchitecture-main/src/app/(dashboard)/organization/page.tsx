'use client';

import { useEffect, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { analyticsApi } from '@/core/api/analytics';
import { EvolutionMetric } from '@/core/types/analytics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

import { useTranslations } from '@/core/hooks';

export default function OrganizationEvolutionPage() {
    const { t } = useTranslations();
    const [data, setData] = useState<EvolutionMetric[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        start_month: '2019-01',
        end_month: '2019-12',
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await analyticsApi.getOrganizationEvolutionTrend(filters);
            setData(result);
        } catch (error) {
            console.error('Failed to fetch evolution data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{t('organization.title')}</h2>
                <p className="text-muted-foreground">
                    {t('organization.description')}
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('common.actions')}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-end gap-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <label htmlFor="start" className="text-sm font-medium">{t('organization.startMonth')}</label>
                        <Input
                            type="month"
                            id="start"
                            value={filters.start_month}
                            onChange={(e) => setFilters({ ...filters, start_month: e.target.value })}
                        />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <label htmlFor="end" className="text-sm font-medium">{t('organization.endMonth')}</label>
                        <Input
                            type="month"
                            id="end"
                            value={filters.end_month}
                            onChange={(e) => setFilters({ ...filters, end_month: e.target.value })}
                        />
                    </div>
                    <Button onClick={fetchData} disabled={loading}>
                        {loading ? t('common.loading') : t('organization.viewEvolution')}
                    </Button>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('organization.activeUsers')} & {t('organization.activeRoles')}</CardTitle>
                        <CardDescription>{t('organization.description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="phase" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="active_users" fill="#8884d8" name={t('organization.activeUsers')} />
                                <Bar dataKey="active_roles" fill="#82ca9d" name={t('organization.activeRoles')} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('organization.totalInteractions')}</CardTitle>
                        <CardDescription>{t('organization.trendDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="phase" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="total_interactions" stroke="#ffc658" fill="#ffc658" fillOpacity={0.3} name={t('organization.totalInteractions')} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
