'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Subject } from '@/services/subjectApi';
import { useCreateSubject, useUpdateSubject } from '@/hooks/useSubjects';

const subjectSchema = z.object({
  subjectCode: z.string().min(1, { message: 'Subject code is required' }),
  subjectName: z.string().min(1, { message: 'Subject name is required' }),
});

type FormValues = z.infer<typeof subjectSchema>;

interface SubjectFormProps {
  subject?: Subject;
  isEditing?: boolean;
}

export function SubjectForm({ subject, isEditing = false }: SubjectFormProps) {
  const router = useRouter();
  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject();

  const form = useForm<FormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      subjectCode: subject?.subjectCode || '',
      subjectName: subject?.subjectName || '',
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      if (isEditing && subject?._id) {
        await updateSubject.mutateAsync({
          id: subject._id,
          data,
        });
      } else {
        await createSubject.mutateAsync(data);
      }
      router.push('/admin/subjects');
    } catch (error) {
      console.error('Failed to submit subject:', error);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Subject' : 'Create Subject'}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="subjectCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter subject code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subjectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter subject name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/subjects')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createSubject.isPending || updateSubject.isPending}
            >
              {(createSubject.isPending || updateSubject.isPending) ? 'Saving...' : 'Save'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
