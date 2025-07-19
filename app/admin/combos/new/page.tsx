'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { useCreateCombo } from '@/hooks/useCombos';
import { useToast } from '@/components/ui/use-toast';
import { ComboForm, ComboFormValues } from '../components/ComboForm';
import { useMajors } from '@/hooks/useMajors';

export default function NewComboPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: createCombo, isPending } = useCreateCombo();
  
  // Fetch majors from API
  const { data: majorsData, isLoading: isMajorsLoading } = useMajors();
  
  // Transform majors data to the format expected by ComboForm
  const majors = majorsData?.data?.map(major => ({
    id: major._id,
    name: major.majorName
  })) || [];

  const onSubmit = (data: ComboFormValues) => {
    createCombo(data, {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Combo created successfully',
        });
        router.push('/admin/combos');
      },
      onError: (error: any) => {
        toast({
          title: 'Error',
          description: error.message || 'Failed to create combo',
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Add New Combo</h2>
      <Card>
        <CardContent className="pt-6">
          <ComboForm
            onSubmit={onSubmit}
            loading={isPending || isMajorsLoading}
            majors={majors}
            submitLabel="Create Combo"
            cancelLabel="Cancel"
            onCancel={() => router.push('/admin/combos')}
          />
        </CardContent>
      </Card>
    </div>
  );
} 