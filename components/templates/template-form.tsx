'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Template, TemplateFormData, TemplateTheme } from '@/types/template';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { templateService } from '@/lib/services/template-service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  isPublic: z.boolean(),
  tags: z.array(z.string()),
  theme: z.object({
    primary: z.string(),
    secondary: z.string(),
    fonts: z.object({
      heading: z.string(),
      body: z.string(),
    }),
    spacing: z.object({
      padding: z.string(),
      margin: z.string(),
    }),
  }),
});

interface TemplateFormProps {
  template?: Template;
  mode: 'create' | 'edit';
}

export function TemplateForm({ template, mode }: TemplateFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: template || {
      name: '',
      description: '',
      category: '',
      isPublic: false,
      tags: [],
      theme: {
        primary: '#0066cc',
        secondary: '#4d4d4d',
        fonts: {
          heading: 'Inter',
          body: 'Inter',
        },
        spacing: {
          padding: '1rem',
          margin: '1rem',
        },
      },
    },
  });

  const onSubmit = async (data: TemplateFormData) => {
    try {
      setLoading(true);
      if (mode === 'create') {
        await templateService.createTemplate(data);
        toast.success('Template created successfully');
      } else if (template) {
        await templateService.updateTemplate(template.id, data);
        toast.success('Template updated successfully');
      }
      router.push('/dashboard/templates');
    } catch (error) {
      console.error('Failed to save template:', error);
      toast.error('Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter template name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter template description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="Enter template category" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Public Template</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Make this template available to other users
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Theme Settings</h3>
          
          <FormField
            control={form.control}
            name="theme.primary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Color</FormLabel>
                <FormControl>
                  <Input type="color" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="theme.secondary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secondary Color</FormLabel>
                <FormControl>
                  <Input type="color" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : mode === 'create' ? 'Create Template' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
} 