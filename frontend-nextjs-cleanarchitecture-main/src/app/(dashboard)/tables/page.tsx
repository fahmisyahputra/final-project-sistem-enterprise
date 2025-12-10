'use client';

import { ArrowUpDown, ChevronLeft, ChevronRight, MoreHorizontal, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { useTranslations } from '@/core/hooks';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CodeBlock,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui';

// Code snippets
const basicTableCode = `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Role</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {users.map((user) => (
      <TableRow key={user.id}>
        <TableCell className="font-medium">{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.role}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`;

const advancedTableCode = `import { useState, useMemo } from 'react';

// 1. Define data type
interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
}

// 2. State for search, sort, pagination
const [search, setSearch] = useState('');
const [sortColumn, setSortColumn] = useState<keyof User>('id');
const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(5);

// 3. Filter and sort data
const filteredData = useMemo(() => {
  let data = [...users];

  // Search filter
  if (search) {
    data = data.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Sort
  data.sort((a, b) => {
    const modifier = sortDirection === 'asc' ? 1 : -1;
    return a[sortColumn].localeCompare(b[sortColumn]) * modifier;
  });

  return data;
}, [search, sortColumn, sortDirection]);

// 4. Pagination
const totalPages = Math.ceil(filteredData.length / pageSize);
const paginatedData = filteredData.slice(
  (currentPage - 1) * pageSize,
  currentPage * pageSize
);

// 5. Handle sort
const handleSort = (column: keyof User) => {
  if (sortColumn === column) {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  } else {
    setSortColumn(column);
    setSortDirection('asc');
  }
};`;

const statusBadgeCode = `// Status badge colors mapping
const statusColors = {
  active: 'success',
  inactive: 'destructive',
  pending: 'warning',
} as const;

// Usage in table cell
<TableCell>
  <Badge variant={statusColors[user.status]}>
    {user.status}
  </Badge>
</TableCell>`;

const actionMenuCode = `import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui';
import { MoreHorizontal } from 'lucide-react';

<TableCell>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={() => handleView(user.id)}>
        View
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => handleEdit(user.id)}>
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem
        className="text-destructive"
        onClick={() => handleDelete(user.id)}
      >
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</TableCell>`;

// Sample data
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

const users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', createdAt: '2024-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active', createdAt: '2024-01-20' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'pending', createdAt: '2024-02-01' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'inactive', createdAt: '2024-02-10' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin', status: 'active', createdAt: '2024-02-15' },
  { id: 6, name: 'Diana Lee', email: 'diana@example.com', role: 'Editor', status: 'active', createdAt: '2024-02-20' },
  { id: 7, name: 'Eve Martinez', email: 'eve@example.com', role: 'User', status: 'pending', createdAt: '2024-03-01' },
  { id: 8, name: 'Frank Garcia', email: 'frank@example.com', role: 'User', status: 'active', createdAt: '2024-03-05' },
  { id: 9, name: 'Grace Taylor', email: 'grace@example.com', role: 'Editor', status: 'inactive', createdAt: '2024-03-10' },
  { id: 10, name: 'Henry Anderson', email: 'henry@example.com', role: 'Admin', status: 'active', createdAt: '2024-03-15' },
];

const statusColors = {
  active: 'success',
  inactive: 'destructive',
  pending: 'warning',
} as const;

export default function TablesPage() {
  const { t } = useTranslations();
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof User>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let data = [...users];

    // Search filter
    if (search) {
      data = data.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort
    data.sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      const modifier = sortDirection === 'asc' ? 1 : -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * modifier;
      }
      return ((aValue as number) - (bValue as number)) * modifier;
    });

    return data;
  }, [search, sortColumn, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (column: keyof User) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('tables.title')}</h1>
        <p className="text-muted-foreground">{t('tables.subtitle')}</p>
      </div>

      {/* Basic Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('tables.basic')}</CardTitle>
          <CardDescription>{t('tables.basicDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.slice(0, 3).map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex-col items-stretch">
          <CodeBlock code={basicTableCode} title="Basic Table Usage" />
        </CardFooter>
      </Card>

      {/* Advanced Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('tables.advanced')}</CardTitle>
          <CardDescription>{t('tables.advancedDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('name')}
                      className="-ml-4 h-8"
                    >
                      Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('email')}
                      className="-ml-4 h-8"
                    >
                      Email
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="text-muted-foreground">{user.id}</TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Badge variant={statusColors[user.status]}>{user.status}</Badge>
                      </TableCell>
                      <TableCell>{user.createdAt}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {t('tables.showing')} {(currentPage - 1) * pageSize + 1} {t('tables.to')}{' '}
              {Math.min(currentPage * pageSize, filteredData.length)} {t('tables.of')} {filteredData.length} {t('tables.entries')}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                {t('tables.page')} {currentPage} {t('tables.of')} {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-4">
          <CodeBlock code={advancedTableCode} title="Advanced Table with Sorting & Pagination" />
          <CodeBlock code={statusBadgeCode} title="Status Badge Colors" />
          <CodeBlock code={actionMenuCode} title="Action Menu" />
        </CardFooter>
      </Card>
    </div>
  );
}
