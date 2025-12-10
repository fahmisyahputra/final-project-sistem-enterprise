'use client';

import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CodeBlock,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Progress,
  Separator,
  Skeleton,
} from '@/shared/components/ui';

// Code snippets
const toastCode = `import { toast } from 'sonner';

// Basic toast
toast('Default notification');

// Success toast
toast.success('Success!', {
  description: 'Your action was completed successfully.',
});

// Error toast
toast.error('Error!', {
  description: 'Something went wrong. Please try again.',
});

// Warning toast
toast.warning('Warning!', {
  description: 'Please check your input.',
});

// Info toast
toast.info('Info', {
  description: 'Here is some useful information.',
});

// Promise toast (loading → success/error)
toast.promise(asyncFunction(), {
  loading: 'Loading...',
  success: 'Action completed!',
  error: 'Error occurred',
});`;

const dialogCode = `import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here.
      </DialogDescription>
    </DialogHeader>
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" defaultValue="John Doe" />
      </div>
    </div>
    <DialogFooter>
      <Button type="submit">Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`;

const alertDialogCode = `import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/components/ui';

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete Item</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={() => handleDelete()}>
        Continue
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`;

const progressCode = `import { Progress } from '@/shared/components/ui';

const [progress, setProgress] = useState(45);

<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span>Progress</span>
    <span>{progress}%</span>
  </div>
  <Progress value={progress} />
</div>

// Update progress
setProgress((prev) => Math.min(100, prev + 10));`;

const skeletonCode = `import { Skeleton } from '@/shared/components/ui';

// Avatar with text skeleton
<div className="flex items-center space-x-4">
  <Skeleton className="h-12 w-12 rounded-full" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-[200px]" />
    <Skeleton className="h-4 w-[150px]" />
  </div>
</div>

// Card skeleton
<div className="space-y-3">
  <Skeleton className="h-[125px] w-full rounded-xl" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
  </div>
</div>

// List skeleton
{[1, 2, 3].map((i) => (
  <div key={i} className="flex items-center space-x-3">
    <Skeleton className="h-10 w-10 rounded-full" />
    <div className="space-y-1.5 flex-1">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  </div>
))}`;

export default function FeedbackPage() {
  const [progress, setProgress] = useState(45);
  const [isLoading, setIsLoading] = useState(false);

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
        <p className="text-muted-foreground">
          Toast notifications, dialogs, progress, dan loading states
        </p>
      </div>

      {/* Toast Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Toast Notifications</CardTitle>
          <CardDescription>Menggunakan Sonner untuk notifikasi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => toast('Default toast notification')}>Default</Button>
            <Button
              variant="secondary"
              onClick={() =>
                toast.success('Success!', {
                  description: 'Your action was completed successfully.',
                })
              }
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Success
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                toast.error('Error!', {
                  description: 'Something went wrong. Please try again.',
                })
              }
            >
              <XCircle className="mr-2 h-4 w-4" />
              Error
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast.warning('Warning!', {
                  description: 'Please check your input before proceeding.',
                })
              }
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Warning
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast.info('Info', {
                  description: 'Here is some useful information.',
                })
              }
            >
              <Info className="mr-2 h-4 w-4" />
              Info
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
                  loading: 'Loading...',
                  success: 'Action completed!',
                  error: 'Error occurred',
                })
              }
            >
              Promise Toast
            </Button>
          </div>
          <CodeBlock code={toastCode} title="Toast Usage" />
        </CardContent>
      </Card>

      {/* Modal Dialog */}
      <Card>
        <CardHeader>
          <CardTitle>Modal Dialog</CardTitle>
          <CardDescription>Dialog untuk form atau konten interaktif</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when youre done.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john@example.com" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={() => toast.success('Profile updated!')}>
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <CodeBlock code={dialogCode} title="Dialog Usage" />
        </CardContent>
      </Card>

      {/* Alert Dialog */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Dialog</CardTitle>
          <CardDescription>Konfirmasi aksi penting seperti delete</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Item</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove
                  your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => toast.success('Item deleted!')}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <CodeBlock code={alertDialogCode} title="Alert Dialog Usage" />
        </CardContent>
      </Card>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progress</CardTitle>
          <CardDescription>Progress bar untuk menunjukkan kemajuan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setProgress((p) => Math.max(0, p - 10))}
            >
              -10%
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setProgress((p) => Math.min(100, p + 10))}
            >
              +10%
            </Button>
          </div>
          <CodeBlock code={progressCode} title="Progress Usage" />
        </CardContent>
      </Card>

      {/* Skeleton Loading */}
      <Card>
        <CardHeader>
          <CardTitle>Skeleton Loading</CardTitle>
          <CardDescription>Placeholder saat loading data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button onClick={simulateLoading} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Simulate Loading'}
          </Button>

          <Separator />

          {isLoading ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-primary/10" />
                <div className="space-y-1">
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-muted-foreground">john@example.com</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skeleton Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Skeleton Variants</CardTitle>
          <CardDescription>Berbagai bentuk skeleton</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Card Skeleton */}
            <div className="space-y-3">
              <Skeleton className="h-[125px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            {/* List Skeleton */}
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>

            {/* Text Skeleton */}
            <div className="space-y-3">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
          <CodeBlock code={skeletonCode} title="Skeleton Usage" />
        </CardContent>
      </Card>
    </div>
  );
}
