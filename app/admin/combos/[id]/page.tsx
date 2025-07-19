'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useCombo, useUpdateCombo } from '@/hooks/useCombos';
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
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ComboForm, ComboFormValues } from '../components/ComboForm';

// Define form validation schema
const formSchema = z.object({
  comboCode: z.string().min(1, 'Combo code is required'),
  comboName: z.string().min(1, 'Combo name is required'),
  description: z.string().min(1, 'Description is required'),
  majorId: z.string().min(1, 'Major is required'),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditComboPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const router = useRouter();
  const { toast } = useToast();
  const { data: combo, isLoading: isLoadingCombo, error } = useCombo(id);
  const { mutate: updateCombo, isPending: isUpdating } = useUpdateCombo();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comboCode: '',
      comboName: '',
      description: '',
      majorId: '',
    },
  });

  // Fill the form with combo data when it's loaded
  useEffect(() => {
    if (combo) {
      form.reset({
        comboCode: combo.comboCode,
        comboName: combo.comboName,
        description: combo.description,
        majorId: typeof combo.majorId === 'object' ? combo.majorId._id || '' : combo.majorId,
      });
    }
  }, [combo, form]);

  const onSubmit = (data: FormValues) => {
    updateCombo(
      {
        id,
        data,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Combo updated successfully',
          });
          router.push('/admin/combos');
        },
        onError: (error: any) => {
          toast({
            title: 'Error',
            description: error.message || 'Failed to update combo',
            variant: 'destructive',
          });
        },
      }
    );
  };

  if (error) {
    return <div className="text-center py-10 text-red-500">Error loading combo: {error.message}</div>;
  }

  // TODO: Add fetch for majors list when available
  const majors = [
    { id: '1', name: 'Software Engineering' },
    { id: '2', name: 'Information Technology' },
    { id: '3', name: 'Artificial Intelligence' },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Edit Combo</h2>
      <Card>
        <CardContent className="pt-6">
          {isLoadingCombo ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-24 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          ) : (
            <ComboForm
              defaultValues={combo ? {
                comboCode: combo.comboCode,
                comboName: combo.comboName,
                description: combo.description,
                majorId: typeof combo.majorId === 'object' ? combo.majorId._id || '' : combo.majorId,
              } : undefined}
              onSubmit={onSubmit}
              loading={isUpdating}
              majors={majors}
              submitLabel="Update Combo"
              cancelLabel="Cancel"
              onCancel={() => router.push('/admin/combos')}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
