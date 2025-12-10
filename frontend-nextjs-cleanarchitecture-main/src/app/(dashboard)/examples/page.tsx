'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { http } from '@/core/api';
import { ApiResponse } from '@/core/types';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CodeBlock,
  Input,
  Label,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui';

// Code snippets
const reactQueryCode = `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Define API functions
const postsApi = {
  getAll: async (): Promise<Post[]> => {
    const response = await fetch('/api/posts');
    return response.json();
  },

  getById: async (id: number): Promise<Post> => {
    const response = await fetch(\`/api/posts/\${id}\`);
    return response.json();
  },

  create: async (data: CreatePostData): Promise<Post> => {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    await fetch(\`/api/posts/\${id}\`, { method: 'DELETE' });
  },
};

// Query: Fetch data
const { data, isLoading, isError, refetch } = useQuery({
  queryKey: ['posts'],
  queryFn: postsApi.getAll,
});

// Mutation: Create/Update/Delete
const queryClient = useQueryClient();

const createMutation = useMutation({
  mutationFn: postsApi.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
    toast.success('Post created!');
  },
  onError: () => {
    toast.error('Failed to create post');
  },
});

// Use mutation
createMutation.mutate({ title: 'New Post', body: 'Content' });`;

const httpClientCode = `import { http } from '@/core/api';

// GET request
const users = await http.get<User[]>('/users');

// POST request
const newUser = await http.post<User>('/users', {
  name: 'John Doe',
  email: 'john@example.com',
});

// PUT request
const updatedUser = await http.put<User>('/users/1', {
  name: 'Jane Doe',
});

// PATCH request
const patchedUser = await http.patch<User>('/users/1', {
  email: 'jane@example.com',
});

// DELETE request
await http.delete('/users/1');

// Response format (ApiResponse<T>):
// {
//   success: boolean;
//   message: string;
//   data: T;
//   meta?: PaginationMeta;
// }`;

const queryOptionsCode = `// Query with options
const { data, isLoading } = useQuery({
  queryKey: ['posts', page, filters],
  queryFn: () => postsApi.getAll({ page, ...filters }),
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  refetchOnWindowFocus: false,
  enabled: !!userId, // Only fetch when userId exists
  retry: 3,
  retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
});

// Optimistic updates
const updateMutation = useMutation({
  mutationFn: postsApi.update,
  onMutate: async (newPost) => {
    await queryClient.cancelQueries({ queryKey: ['posts'] });
    const previousPosts = queryClient.getQueryData(['posts']);
    queryClient.setQueryData(['posts'], (old) =>
      old.map(p => p.id === newPost.id ? newPost : p)
    );
    return { previousPosts };
  },
  onError: (err, newPost, context) => {
    queryClient.setQueryData(['posts'], context.previousPosts);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  },
});`;

// Types
interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface CreatePostData {
  title: string;
  body: string;
  userId: number;
}

// API Functions (contoh penggunaan)
const postsApi = {
  // GET - Fetch all posts
  getAll: async (): Promise<Post[]> => {
    // Contoh menggunakan JSONPlaceholder API untuk demo
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
    return response.json();
  },

  // GET - Fetch single post
  getById: async (id: number): Promise<Post> => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    return response.json();
  },

  // POST - Create new post
  create: async (data: CreatePostData): Promise<Post> => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // DELETE - Delete post
  delete: async (id: number): Promise<void> => {
    await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: 'DELETE',
    });
  },
};

export default function ExamplesPage() {
  const queryClient = useQueryClient();
  const [newPostTitle, setNewPostTitle] = useState('');

  // Query: Fetch posts
  const {
    data: posts,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: postsApi.getAll,
  });

  // Mutation: Create post
  const createMutation = useMutation({
    mutationFn: postsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post created successfully!');
      setNewPostTitle('');
    },
    onError: () => {
      toast.error('Failed to create post');
    },
  });

  // Mutation: Delete post
  const deleteMutation = useMutation({
    mutationFn: postsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post deleted!');
    },
    onError: () => {
      toast.error('Failed to delete post');
    },
  });

  const handleCreatePost = () => {
    if (!newPostTitle.trim()) {
      toast.error('Please enter a title');
      return;
    }
    createMutation.mutate({
      title: newPostTitle,
      body: 'This is a new post body',
      userId: 1,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Examples</h1>
        <p className="text-muted-foreground">
          Contoh penggunaan React Query untuk data fetching
        </p>
      </div>

      {/* Create Post */}
      <Card>
        <CardHeader>
          <CardTitle>Create Post</CardTitle>
          <CardDescription>Contoh mutation untuk create data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="post-title" className="sr-only">
                Post Title
              </Label>
              <Input
                id="post-title"
                placeholder="Enter post title..."
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
              />
            </div>
            <Button onClick={handleCreatePost} isLoading={createMutation.isPending}>
              Create Post
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Posts</CardTitle>
            <CardDescription>Data dari JSONPlaceholder API</CardDescription>
          </div>
          <Button variant="outline" onClick={() => refetch()}>
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="py-8 text-center text-destructive">
              Failed to load posts. Please try again.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="w-24">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts?.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.id}</TableCell>
                    <TableCell>{post.title}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteMutation.mutate(post.id)}
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* React Query Usage */}
      <Card>
        <CardHeader>
          <CardTitle>React Query Usage</CardTitle>
          <CardDescription>Cara menggunakan React Query untuk data fetching</CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock code={reactQueryCode} title="React Query" defaultCollapsed={false} />
        </CardContent>
      </Card>

      {/* HTTP Client Example */}
      <Card>
        <CardHeader>
          <CardTitle>HTTP Client</CardTitle>
          <CardDescription>Menggunakan API client bawaan</CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock code={httpClientCode} title="HTTP Client" defaultCollapsed={false} />
        </CardContent>
      </Card>

      {/* Advanced Query Options */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Query Options</CardTitle>
          <CardDescription>Query options dan optimistic updates</CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock code={queryOptionsCode} title="Advanced Options" defaultCollapsed={false} />
        </CardContent>
      </Card>
    </div>
  );
}
