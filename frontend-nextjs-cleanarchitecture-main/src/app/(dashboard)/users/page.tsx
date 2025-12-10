'use client';

import { useEffect, useState } from 'react';
import { User as UserIcon } from 'lucide-react';
import { analyticsApi } from '@/core/api/analytics';
import { UserCollaboration, Entity } from '@/core/types/analytics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
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

export default function UserCollaborationPage() {
    const { t } = useTranslations();
    const [data, setData] = useState<UserCollaboration[]>([]);
    const [allUsers, setAllUsers] = useState<Entity[]>([]);
    const [loading, setLoading] = useState(false);
    const [month, setMonth] = useState('2024-04');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [collaboration, users] = await Promise.all([
                    analyticsApi.getUserCollaboration(month),
                    analyticsApi.getAllUsers(),
                ]);
                setData(collaboration);
                setAllUsers(users);
            } catch (error) {
                console.error('Failed to fetch user data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [month]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{t('users.title')}</h2>
                <p className="text-muted-foreground">
                    {t('users.description')}
                </p>
            </div>

            <Tabs defaultValue="collaboration" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="collaboration">{t('users.collaboration')}</TabsTrigger>
                    <TabsTrigger value="all-users">{t('users.allUsers')}</TabsTrigger>
                </TabsList>

                <TabsContent value="collaboration" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('users.filterMonth')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <label htmlFor="month" className="text-sm font-medium">{t('users.selectMonth')}</label>
                                <Input
                                    type="month"
                                    id="month"
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('users.listTitle')}</CardTitle>
                            <CardDescription>
                                {t('users.listDesc')} ({data.length})
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{t('users.userA')}</TableHead>
                                            <TableHead>{t('roles.roleA')}</TableHead>
                                            <TableHead>{t('users.userB')}</TableHead>
                                            <TableHead>{t('roles.roleB')}</TableHead>
                                            <TableHead className="text-right">{t('users.weight')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center h-24">
                                                    {t('common.loading')}
                                                </TableCell>
                                            </TableRow>
                                        ) : data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center h-24">
                                                    {t('common.noResults')}
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            data.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium">{item.user_a}</TableCell>
                                                    <TableCell className="text-muted-foreground">{item.role_a}</TableCell>
                                                    <TableCell className="font-medium">{item.user_b}</TableCell>
                                                    <TableCell className="text-muted-foreground">{item.role_b}</TableCell>
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

                <TabsContent value="all-users">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('users.allUsersTitle')}</CardTitle>
                            <CardDescription>
                                {t('users.allUsersDesc')} ({allUsers.length})
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {allUsers.map((user, i) => (
                                    <div key={i} className="flex items-center gap-2 p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
                                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">{user.name}</span>
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
