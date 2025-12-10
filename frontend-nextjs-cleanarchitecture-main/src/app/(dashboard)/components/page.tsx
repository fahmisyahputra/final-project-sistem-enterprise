'use client';

import { ChevronRight, Copy, ImageIcon, Mail, Settings, User } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

import { useTranslations } from '@/core/hooks';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AspectRatio,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Carousel,
  CarouselItem,
  CodeBlock,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui';

const buttonCode = `import { Button } from '@/shared/components/ui';

// Variants
<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Settings /></Button>

// States
<Button isLoading>Loading</Button>
<Button disabled>Disabled</Button>`;

const badgeCode = `import { Badge } from '@/shared/components/ui';

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="info">Info</Badge>`;

const avatarCode = `import { Avatar, AvatarImage, AvatarFallback } from '@/shared/components/ui';

<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>

// With fallback only
<Avatar>
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

// Custom size
<Avatar className="h-14 w-14">
  <AvatarFallback>
    <User className="h-6 w-6" />
  </AvatarFallback>
</Avatar>`;

const accordionCode = `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui';

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Question 1?</AccordionTrigger>
    <AccordionContent>
      Answer to question 1.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Question 2?</AccordionTrigger>
    <AccordionContent>
      Answer to question 2.
    </AccordionContent>
  </AccordionItem>
</Accordion>`;

const tabsCode = `import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui';

<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    Account settings content here.
  </TabsContent>
  <TabsContent value="password">
    Password settings content here.
  </TabsContent>
</Tabs>`;

const dropdownCode = `import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/components/ui';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuItem>Log out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`;

const tooltipCode = `import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui';

<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="outline">Hover me</Button>
  </TooltipTrigger>
  <TooltipContent>
    <p>This is a tooltip!</p>
  </TooltipContent>
</Tooltip>`;

const cardCode = `import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description here.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>`;

const carouselCode = `import { Carousel, CarouselItem } from '@/shared/components/ui';

<Carousel autoPlay interval={5000} showDots showArrows>
  <CarouselItem>
    <div className="bg-primary/10 p-8 text-center">Slide 1</div>
  </CarouselItem>
  <CarouselItem>
    <div className="bg-primary/10 p-8 text-center">Slide 2</div>
  </CarouselItem>
  <CarouselItem>
    <div className="bg-primary/10 p-8 text-center">Slide 3</div>
  </CarouselItem>
</Carousel>`;

const aspectRatioCode = `import { AspectRatio } from '@/shared/components/ui';
import Image from 'next/image';

<AspectRatio ratio={16 / 9}>
  <Image
    src="/image.jpg"
    alt="Image"
    fill
    className="rounded-lg object-cover"
  />
</AspectRatio>

// Different ratios
<AspectRatio ratio={4 / 3}>...</AspectRatio>
<AspectRatio ratio={1}>...</AspectRatio>`;

export default function ComponentsPage() {
  const { t } = useTranslations();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('components.title')}</h1>
        <p className="text-muted-foreground">{t('components.subtitle')}</p>
      </div>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>{t('components.buttons')}</CardTitle>
          <CardDescription>{t('components.buttonsDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          <Separator />
          <div className="flex flex-wrap gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          <Separator />
          <div className="flex flex-wrap gap-4">
            <Button isLoading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch">
          <CodeBlock code={buttonCode} title="Usage" />
        </CardFooter>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>{t('components.badges')}</CardTitle>
          <CardDescription>{t('components.badgesDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="info">Info</Badge>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch">
          <CodeBlock code={badgeCode} title="Usage" />
        </CardFooter>
      </Card>

      {/* Card Example */}
      <Card>
        <CardHeader>
          <CardTitle>Card</CardTitle>
          <CardDescription>Flexible card component for content display</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Card</CardTitle>
                <CardDescription>Simple card example</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This is a basic card with header, content, and footer.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Learn More</Button>
              </CardFooter>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="text-lg">Highlighted Card</CardTitle>
                <CardDescription>With primary border</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Cards can be customized with different border colors.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-lg">Filled Card</CardTitle>
                <CardDescription className="text-primary-foreground/70">
                  Primary background
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-primary-foreground/80">
                  Cards can also have filled backgrounds.
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch">
          <CodeBlock code={cardCode} title="Usage" />
        </CardFooter>
      </Card>

      {/* Avatar */}
      <Card>
        <CardHeader>
          <CardTitle>{t('components.avatar')}</CardTitle>
          <CardDescription>{t('components.avatarDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar className="h-14 w-14">
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch">
          <CodeBlock code={avatarCode} title="Usage" />
        </CardFooter>
      </Card>

      {/* Carousel */}
      <Card>
        <CardHeader>
          <CardTitle>Carousel</CardTitle>
          <CardDescription>Image/content carousel with navigation</CardDescription>
        </CardHeader>
        <CardContent>
          <Carousel autoPlay interval={4000} className="max-w-md">
            <CarouselItem>
              <div className="flex h-40 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <div className="text-center">
                  <h3 className="text-xl font-bold">Slide 1</h3>
                  <p className="text-sm opacity-80">First carousel item</p>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="flex h-40 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-teal-500 text-white">
                <div className="text-center">
                  <h3 className="text-xl font-bold">Slide 2</h3>
                  <p className="text-sm opacity-80">Second carousel item</p>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="flex h-40 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <div className="text-center">
                  <h3 className="text-xl font-bold">Slide 3</h3>
                  <p className="text-sm opacity-80">Third carousel item</p>
                </div>
              </div>
            </CarouselItem>
          </Carousel>
        </CardContent>
        <CardFooter className="flex-col items-stretch">
          <CodeBlock code={carouselCode} title="Usage" />
        </CardFooter>
      </Card>

      {/* Aspect Ratio / Image */}
      <Card>
        <CardHeader>
          <CardTitle>Aspect Ratio & Images</CardTitle>
          <CardDescription>Maintain consistent aspect ratios for media</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="mb-2 text-sm font-medium">16:9</p>
              <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg bg-muted">
                <div className="flex h-full items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              </AspectRatio>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">4:3</p>
              <AspectRatio ratio={4 / 3} className="overflow-hidden rounded-lg bg-muted">
                <div className="flex h-full items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              </AspectRatio>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">1:1</p>
              <AspectRatio ratio={1} className="overflow-hidden rounded-lg bg-muted">
                <div className="flex h-full items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              </AspectRatio>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch">
          <CodeBlock code={aspectRatioCode} title="Usage" />
        </CardFooter>
      </Card>

      {/* Accordion */}
      <Card>
        <CardHeader>
          <CardTitle>{t('components.accordion')}</CardTitle>
          <CardDescription>{t('components.accordionDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is Clean Architecture?</AccordionTrigger>
              <AccordionContent>
                Clean Architecture is an architectural pattern that separates concerns into
                independent layers. Inner layers (domain/business logic) do not depend on outer
                layers (framework, database, UI).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Why use shadcn/ui?</AccordionTrigger>
              <AccordionContent>
                shadcn/ui is not a typical component library, but a collection of reusable
                components that can be copy-pasted directly into your project. This gives you full
                control over styling and behavior.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How to add new components?</AccordionTrigger>
              <AccordionContent>
                Create a new file in src/shared/components/ui/, then export from index.ts. Follow
                the existing patterns for consistency.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        <CardFooter className="flex-col items-stretch">
          <CodeBlock code={accordionCode} title="Usage" />
        </CardFooter>
      </Card>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>{t('components.tabs')}</CardTitle>
          <CardDescription>{t('components.tabsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="account" className="w-full">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="mt-4">
              <p className="text-sm text-muted-foreground">
                Manage your account settings and preferences here.
              </p>
            </TabsContent>
            <TabsContent value="password" className="mt-4">
              <p className="text-sm text-muted-foreground">
                Change your password and security settings.
              </p>
            </TabsContent>
            <TabsContent value="settings" className="mt-4">
              <p className="text-sm text-muted-foreground">
                Configure your application settings.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex-col items-stretch">
          <CodeBlock code={tabsCode} title="Usage" />
        </CardFooter>
      </Card>

      {/* Dropdown Menu */}
      <Card>
        <CardHeader>
          <CardTitle>{t('components.dropdown')}</CardTitle>
          <CardDescription>{t('components.dropdownDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Open Menu <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                Messages
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
        <CardFooter className="flex-col items-stretch">
          <CodeBlock code={dropdownCode} title="Usage" />
        </CardFooter>
      </Card>

      {/* Tooltip */}
      <Card>
        <CardHeader>
          <CardTitle>{t('components.tooltip')}</CardTitle>
          <CardDescription>{t('components.tooltipDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This is a tooltip!</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => copyToClipboard('Copied text!')}>
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? 'Copied!' : 'Copy to clipboard'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch">
          <CodeBlock code={tooltipCode} title="Usage" />
        </CardFooter>
      </Card>
    </div>
  );
}
