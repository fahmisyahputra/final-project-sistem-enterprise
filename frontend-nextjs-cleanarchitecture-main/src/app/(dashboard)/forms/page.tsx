'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useTranslations } from '@/core/hooks';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  CodeBlock,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Slider,
  Switch,
  Textarea,
} from '@/shared/components/ui';

// Code snippets
const inputCode = `import { Input, Label } from '@/shared/components/ui';

// Basic Input
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="email@example.com" />
</div>

// With error state
<Input error placeholder="Has error..." />

// Disabled
<Input disabled placeholder="Disabled..." />`;

const selectCode = `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui';

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>`;

const textareaCode = `import { Textarea, Label } from '@/shared/components/ui';

<div className="space-y-2">
  <Label htmlFor="message">Message</Label>
  <Textarea
    id="message"
    placeholder="Type your message..."
    rows={4}
  />
</div>

// With error
<Textarea error placeholder="Has error..." />`;

const checkboxSwitchCode = `import { Checkbox, Switch, Label } from '@/shared/components/ui';

// Checkbox
<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms</Label>
</div>

// Switch
<div className="flex items-center space-x-2">
  <Switch id="notifications" />
  <Label htmlFor="notifications">Enable notifications</Label>
</div>`;

const sliderCode = `import { Slider, Label } from '@/shared/components/ui';

const [value, setValue] = useState([50]);

<div className="space-y-4">
  <Label>Volume: {value[0]}%</Label>
  <Slider
    value={value}
    onValueChange={setValue}
    max={100}
    step={1}
  />
</div>`;

const formValidationCode = `import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// 1. Define schema
const formSchema = z.object({
  name: z.string().min(2, 'Name min 2 characters'),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Message min 10 characters'),
});

type FormData = z.infer<typeof formSchema>;

// 2. Use form hook
const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
  reset,
} = useForm<FormData>({
  resolver: zodResolver(formSchema),
});

// 3. Handle submit
const onSubmit = async (data: FormData) => {
  await api.post('/contact', data);
  toast.success('Form submitted!');
  reset();
};

// 4. Render form
<form onSubmit={handleSubmit(onSubmit)}>
  <Input {...register('name')} error={!!errors.name} />
  {errors.name && <p className="text-destructive">{errors.name.message}</p>}

  <Input {...register('email')} error={!!errors.email} />
  {errors.email && <p className="text-destructive">{errors.email.message}</p>}

  <Textarea {...register('message')} error={!!errors.message} />
  {errors.message && <p className="text-destructive">{errors.message.message}</p>}

  <Button type="submit" isLoading={isSubmitting}>Submit</Button>
</form>`;

// Form Schema dengan Zod
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof formSchema>;

export default function FormsPage() {
  const { t } = useTranslations();
  const [sliderValue, setSliderValue] = useState([50]);
  const [switchValue, setSwitchValue] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
    toast.success('Form submitted successfully!');
    reset();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('forms.title')}</h1>
        <p className="text-muted-foreground">{t('forms.subtitle')}</p>
      </div>

      {/* Basic Inputs */}
      <Card>
        <CardHeader>
          <CardTitle>{t('forms.inputs')}</CardTitle>
          <CardDescription>{t('forms.inputsDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Text Input */}
          <div className="space-y-2">
            <Label htmlFor="text-input">Text Input</Label>
            <Input id="text-input" placeholder="Enter text..." />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password-input">Password Input</Label>
            <Input id="password-input" type="password" placeholder="Enter password..." />
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email-input">Email Input</Label>
            <Input id="email-input" type="email" placeholder="email@example.com" />
          </div>

          {/* Number Input */}
          <div className="space-y-2">
            <Label htmlFor="number-input">Number Input</Label>
            <Input id="number-input" type="number" placeholder="0" />
          </div>

          {/* Disabled Input */}
          <div className="space-y-2">
            <Label htmlFor="disabled-input">Disabled Input</Label>
            <Input id="disabled-input" disabled placeholder="Disabled..." />
          </div>

          {/* Error Input */}
          <div className="space-y-2">
            <Label htmlFor="error-input">Error Input</Label>
            <Input id="error-input" error placeholder="Has error..." />
            <p className="text-sm text-destructive">This field has an error</p>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch">
          <CodeBlock code={inputCode} title="Usage" />
        </CardFooter>
      </Card>

      {/* Select */}
      <Card>
        <CardHeader>
          <CardTitle>{t('forms.select')}</CardTitle>
          <CardDescription>{t('forms.selectDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Basic Select</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Country Select</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">Indonesia</SelectItem>
                <SelectItem value="my">Malaysia</SelectItem>
                <SelectItem value="sg">Singapore</SelectItem>
                <SelectItem value="th">Thailand</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch">
          <CodeBlock code={selectCode} title="Usage" />
        </CardFooter>
      </Card>

      {/* Textarea */}
      <Card>
        <CardHeader>
          <CardTitle>{t('forms.textarea')}</CardTitle>
          <CardDescription>{t('forms.textareaDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="textarea">Message</Label>
            <Textarea id="textarea" placeholder="Type your message here..." rows={4} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="textarea-error">With Error</Label>
            <Textarea id="textarea-error" error placeholder="Has error..." rows={3} />
            <p className="text-sm text-destructive">Message is required</p>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch">
          <CodeBlock code={textareaCode} title="Usage" />
        </CardFooter>
      </Card>

      {/* Checkbox & Switch */}
      <Card>
        <CardHeader>
          <CardTitle>{t('forms.toggles')}</CardTitle>
          <CardDescription>{t('forms.togglesDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={checkboxValue}
              onCheckedChange={(checked) => setCheckboxValue(checked as boolean)}
            />
            <Label htmlFor="terms">Accept terms and conditions</Label>
          </div>

          <Separator />

          <div className="flex items-center space-x-2">
            <Switch id="notifications" checked={switchValue} onCheckedChange={setSwitchValue} />
            <Label htmlFor="notifications">Enable notifications</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="disabled-switch" disabled />
            <Label htmlFor="disabled-switch">Disabled switch</Label>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch">
          <CodeBlock code={checkboxSwitchCode} title="Usage" />
        </CardFooter>
      </Card>

      {/* Slider */}
      <Card>
        <CardHeader>
          <CardTitle>{t('forms.slider')}</CardTitle>
          <CardDescription>{t('forms.sliderDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Volume: {sliderValue[0]}%</Label>
            <Slider value={sliderValue} onValueChange={setSliderValue} max={100} step={1} />
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch">
          <CodeBlock code={sliderCode} title="Usage" />
        </CardFooter>
      </Card>

      {/* Complete Form with Validation */}
      <Card>
        <CardHeader>
          <CardTitle>{t('forms.contactForm')}</CardTitle>
          <CardDescription>{t('forms.contactFormDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="form-name">Name</Label>
              <Input
                id="form-name"
                {...register('name')}
                error={!!errors.name}
                placeholder="Your name"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="form-email">Email</Label>
              <Input
                id="form-email"
                type="email"
                {...register('email')}
                error={!!errors.email}
                placeholder="your@email.com"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="form-message">Message</Label>
              <Textarea
                id="form-message"
                {...register('message')}
                error={!!errors.message}
                placeholder="Your message..."
                rows={4}
              />
              {errors.message && (
                <p className="text-sm text-destructive">{errors.message.message}</p>
              )}
            </div>

            <Button type="submit" isLoading={isSubmitting}>
              Submit
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col items-stretch">
          <CodeBlock code={formValidationCode} title="Form with Zod Validation" />
        </CardFooter>
      </Card>
    </div>
  );
}
