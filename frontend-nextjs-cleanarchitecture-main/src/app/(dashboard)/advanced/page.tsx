'use client';

import { useEffect, useState } from 'react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { analyticsApi } from '@/core/api/analytics';
import { HandoverFlow, UtilizationMetric } from '@/core/types/analytics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { useTranslations } from '@/core/hooks';

// Helper for Heatmap colors
const getHeatmapColor = (count: number, max: number) => {
    if (count === 0) return 'bg-muted/20';
    const intensity = Math.min(count / max, 1);
    // Blue scale
    if (intensity < 0.2) return 'bg-blue-100 dark:bg-blue-950/30';
    if (intensity < 0.4) return 'bg-blue-300 dark:bg-blue-900/50';
    if (intensity < 0.6) return 'bg-blue-500 dark:bg-blue-800';
    if (intensity < 0.8) return 'bg-blue-700 dark:bg-blue-600';
    return 'bg-blue-900 dark:bg-blue-500';
};

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function AdvancedAnalyticsPage() {
    const { t } = useTranslations();
    const [handoverData, setHandoverData] = useState<HandoverFlow[]>([]);
    const [utilizationData, setUtilizationData] = useState<UtilizationMetric[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [handovers, utilization] = await Promise.all([
                    analyticsApi.getHandoverFlow(),
                    analyticsApi.getResourceUtilization(),
                ]);
                setHandoverData(handovers);
                setUtilizationData(utilization);
            } catch (error) {
                console.error('Failed to fetch advanced data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Prepare Heatmap Data
    const maxCount = Math.max(...utilizationData.map(d => d.count), 1);
    const getCount = (dayIdx: number, hour: number) => {
        // Neo4j dayOfWeek: 1 (Mon) - 7 (Sun)
        // Our DAYS array: 0 (Mon) - 6 (Sun)
        const metric = utilizationData.find(d => d.day === dayIdx + 1 && d.hour === hour);
        return metric ? metric.count : 0;
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{t('advanced.title')}</h2>
                <p className="text-muted-foreground">
                    {t('advanced.description')}
                </p>
            </div>

            {/* Feature 1: Role-Based Bottleneck Analysis */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('advanced.handoverTitle')}</CardTitle>
                    <CardDescription>{t('advanced.handoverDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                    {loading ? (
                        <div className="flex h-full items-center justify-center">{t('common.loading')}</div>
                    ) : handoverData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={handoverData} layout="vertical" margin={{ left: 20, right: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" unit="h" />
                                <YAxis
                                    type="category"
                                    dataKey={(data) => `${data.source_role} → ${data.target_role}`}
                                    width={200}
                                    tick={{ fontSize: 12 }}
                                />
                                <RechartsTooltip
                                    formatter={(value: number) => [`${value} hours`, t('advanced.avgDuration')]}
                                />
                                <Legend />
                                <Bar dataKey="avg_duration" name={t('advanced.avgDuration')} radius={[0, 4, 4, 0]}>
                                    {handoverData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={
                                                entry.avg_duration > 72 ? '#ef4444' : // Red for > 72h
                                                    entry.avg_duration > 48 ? '#eab308' : // Yellow for 48-72h
                                                        '#22c55e' // Green for < 48h
                                            }
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center">{t('common.noResults')}</div>
                    )}
                    <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-green-500" />
                            <span>&lt; 48h (Good)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-yellow-500" />
                            <span>48h - 72h (Warning)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-red-500" />
                            <span>&gt; 72h (Critical)</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Feature 2: Resource Utilization Heatmap */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('advanced.heatmapTitle')}</CardTitle>
                    <CardDescription>{t('advanced.heatmapDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex h-32 items-center justify-center">{t('common.loading')}</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <div className="min-w-[800px]">
                                {/* Header Row (Hours) */}
                                <div className="flex">
                                    <div className="w-16 shrink-0"></div>
                                    {HOURS.map(h => (
                                        <div key={h} className="flex-1 text-center text-xs text-muted-foreground">
                                            {h.toString().padStart(2, '0')}
                                        </div>
                                    ))}
                                </div>
                                {/* Rows (Days) */}
                                {DAYS.map((day, dayIdx) => (
                                    <div key={day} className="flex items-center mt-1">
                                        <div className="w-16 shrink-0 text-sm font-medium uppercase text-muted-foreground">
                                            {t(`advanced.${day}`)}
                                        </div>
                                        {HOURS.map(h => {
                                            const count = getCount(dayIdx, h);
                                            return (
                                                <div
                                                    key={h}
                                                    className={`flex-1 h-8 mx-0.5 rounded-sm transition-colors hover:opacity-80 ${getHeatmapColor(count, maxCount)}`}
                                                    title={`${t(`advanced.${day}`)} ${h}:00 - ${count} interactions`}
                                                />
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
