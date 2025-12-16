'use client';

import { useEffect, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { analyticsApi } from '@/core/api/analytics';
import { OvertimeRisk, ProjectDuration } from '@/core/types/analytics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { useTranslations } from '@/core/hooks';

export default function PerformancePage() {
    const { t } = useTranslations();
    const [overtimeData, setOvertimeData] = useState<OvertimeRisk[]>([]);
    const [durationData, setDurationData] = useState<ProjectDuration[]>([]);
    const [avgDuration, setAvgDuration] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [overtime, duration, avg] = await Promise.all([
                    analyticsApi.getOvertimeRisk(),
                    analyticsApi.getProjectDurations(),
                    analyticsApi.getAverageProjectDuration(),
                ]);
                setOvertimeData(overtime);
                setDurationData(duration);
                setAvgDuration(avg);
            } catch (error) {
                console.error('Failed to fetch performance data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{t('performance.title')}</h2>
                <p className="text-muted-foreground">
                    {t('performance.description')}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Feature 1: Overtime & Burnout Monitor */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('performance.overtimeTitle')}</CardTitle>
                        <CardDescription>{t('performance.overtimeDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {loading ? (
                            <div className="flex h-full items-center justify-center">{t('common.loading')}</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={overtimeData} layout="vertical" margin={{ left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={100} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="overtime_count" fill="#ef4444" name={t('performance.overtimeCount')} radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Feature 2: Project Duration Leaderboard */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('performance.durationTitle')}</CardTitle>
                        <CardDescription>{t('performance.durationDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('performance.caseId')}</TableHead>
                                    <TableHead className="text-right">{t('performance.duration')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center h-24">
                                            {t('common.loading')}
                                        </TableCell>
                                    </TableRow>
                                ) : durationData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center h-24">
                                            {t('common.noResults')}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    durationData.map((item) => (
                                        <TableRow key={item.case_id}>
                                            <TableCell className="font-medium font-mono">{item.case_id}</TableCell>
                                            <TableCell className="text-right">{item.duration_days}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        {avgDuration > 0 && (
                            <div className="mt-4 flex items-center justify-end gap-2 text-sm text-muted-foreground">
                                <span>Average Duration:</span>
                                <span className="font-bold text-foreground">{avgDuration} days</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div >
    );
}
