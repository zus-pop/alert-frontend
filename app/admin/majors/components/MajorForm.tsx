'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { MajorCreateParams } from '@/services/majorApi.types';

const formSchema = z.object({
  majorCode: z.string().min(1, 'Major code is required').max(10, 'Major code must be 10 characters or less'),
  majorName: z.string().min(1, 'Major name is required'),
});

export type MajorFormValues = MajorCreateParams;

export default function MajorForm({
  defaultValues,
  onSubmit,
  loading,
  submitLabel,
  cancelLabel,
  onCancel,
}: {
  defaultValues?: Partial<MajorFormValues>;
  onSubmit: (data: MajorFormValues) => void;
  loading?: boolean;
  submitLabel: string;
  cancelLabel: string;
  onCancel: () => void;
}) {
  const form = useForm<MajorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || { majorCode: '', majorName: '' },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="majorCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Major Code</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. SE, IT, BA" 
                    {...field} 
                    className="w-full p-2 border rounded-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="majorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Major Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. Software Engineering, Information Technology" 
                    {...field} 
                    className="w-full p-2 border rounded-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="font-medium"
          >
            {cancelLabel}
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 font-medium"
          >
            {loading ? (
              <><span className="animate-pulse mr-2">●</span>{submitLabel}...</>
            ) : (
              submitLabel
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
