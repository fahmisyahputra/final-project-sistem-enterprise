'use client';

import { useEffect, useState } from 'react';
import { ArrowUpDown, List } from 'lucide-react';
import { analyticsApi } from '@/core/api/analytics';
import { RoleInteraction, Entity } from '@/core/types/analytics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/components/ui/table';

import { useTranslations } from '@/core/hooks';

export default function RoleInteractionsPage() {
    const { t } = useTranslations();
    const [data, setData] = useState<RoleInteraction[]>([]);
    const [allRoles, setAllRoles] = useState<Entity[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortDesc, setSortDesc] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [interactions, roles] = await Promise.all([
                    analyticsApi.getRoleInteractions(),
                    analyticsApi.getAllRoles(),
                ]);
                setData(interactions);
                setAllRoles(roles);
            } catch (error) {
                console.error('Failed to fetch role data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const sortedData = [...data].sort((a, b) => {
        return sortDesc ? b.weight - a.weight : a.weight - b.weight;
    });

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{t('roles.title')}</h2>
                <p className="text-muted-foreground">
                    {t('roles.description')}
                </p>
            </div>

            <Tabs defaultValue="interactions" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="interactions">{t('roles.interactions')}</TabsTrigger>
                    <TabsTrigger value="all-roles">{t('roles.allRoles')}</TabsTrigger>
                </TabsList>

                <TabsContent value="interactions">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('roles.matrixTitle')}</CardTitle>
                            <CardDescription>
                                {t('roles.matrixDesc')} ({data.length})
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{t('roles.roleA')}</TableHead>
                                            <TableHead>{t('roles.roleB')}</TableHead>
                                            <TableHead className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => setSortDesc(!sortDesc)}
                                                    className="flex items-center gap-1 ml-auto"
                                                >
                                                    {t('roles.strength')}
                                                    <ArrowUpDown className="h-4 w-4" />
                                                </Button>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center h-24">
                                                    {t('common.loading')}
                                                </TableCell>
                                            </TableRow>
                                        ) : sortedData.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center h-24">
                                                    {t('common.noResults')}
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            sortedData.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium">{item.role_a}</TableCell>
                                                    <TableCell>{item.role_b}</TableCell>
                                                    <TableCell className="text-right">{item.weight}</TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="all-roles">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('roles.listTitle')}</CardTitle>
                            <CardDescription>
                                {t('roles.listDesc')} ({allRoles.length})
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {allRoles.map((role, i) => (
                                    <div key={i} className="flex items-center gap-2 p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
                                        <List className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">{role.name}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
