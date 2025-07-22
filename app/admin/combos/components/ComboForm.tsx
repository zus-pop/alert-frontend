import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import React from 'react';

const formSchema = z.object({
  comboCode: z.string().min(1, 'Combo code is required'),
  comboName: z.string().min(1, 'Combo name is required'),
  description: z.string().min(1, 'Description is required'),
  majorId: z.string().min(1, 'Major is required'),
});

export type ComboFormValues = z.infer<typeof formSchema>;

interface ComboFormProps {
  defaultValues?: Partial<ComboFormValues>;
  onSubmit: (data: ComboFormValues) => void;
  loading?: boolean;
  majors: { id: string; name: string }[];
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
}

export function ComboForm({
  defaultValues,
  onSubmit,
  loading,
  majors,
  submitLabel = 'Save Combo',
  cancelLabel = 'Cancel',
  onCancel,
}: ComboFormProps) {
  const form = useForm<ComboFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comboCode: '',
      comboName: '',
      description: '',
      majorId: '',
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="comboCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Combo Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter combo code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comboName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Combo Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter combo name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter combo description"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="majorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Major</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    <option value="">Select a major</option>
                    {majors.map((major) => (
                      <option key={major.id} value={major.id}>
                        {major.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              {cancelLabel}
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
