'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Semester } from '@/services/semesterApi';
import { useCreateSemester, useUpdateSemester } from '@/hooks/useSemesters';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const semesterSchema = z.object({
  semesterName: z.string().min(1, { message: 'Semester name is required' }),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
}).refine(data => {
  return data.startDate < data.endDate;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

type FormValues = z.infer<typeof semesterSchema>;

interface SemesterFormProps {
  semester?: Semester;
  isEditing?: boolean;
}

export function SemesterForm({ semester, isEditing = false }: SemesterFormProps) {
  const router = useRouter();
  const createSemester = useCreateSemester();
  const updateSemester = useUpdateSemester();

  // Parse ISO date strings to Date objects if editing
  const defaultValues = {
    semesterName: semester?.semesterName || '',
    startDate: semester?.startDate ? new Date(semester.startDate) : undefined,
    endDate: semester?.endDate ? new Date(semester.endDate) : undefined,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(semesterSchema),
    defaultValues,
  });

  async function onSubmit(data: FormValues) {
    try {
      // Format dates as ISO strings for API
      const formattedData = {
        ...data,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
      };

      if (isEditing && semester?._id) {
        await updateSemester.mutateAsync({
          id: semester._id,
          data: formattedData,
        });
      } else {
        await createSemester.mutateAsync(formattedData);
      }
      router.push('/admin/semesters');
    } catch (error) {
      console.error('Failed to submit semester:', error);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Semester' : 'Create Semester'}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="semesterName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semester Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter semester name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select start date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select end date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/semesters')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createSemester.isPending || updateSemester.isPending}
            >
              {(createSemester.isPending || updateSemester.isPending) ? 'Saving...' : 'Save'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
