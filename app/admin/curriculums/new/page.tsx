'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { useCreateCurriculum } from '@/hooks/useCurriculums';
import { useToast } from '@/components/ui/use-toast';
import CurriculumForm from '../components/CurriculumForm';
import { useCombos } from '@/hooks/useCombos';
import { useSubjects } from '@/hooks/useSubjects';
import { CurriculumCreateParams } from '@/services/curriculumApi.types';

export default function NewCurriculumPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: createCurriculum, isPending } = useCreateCurriculum();
  
  // Fetch data needed for the form
  const { data: combosData, isLoading: isLoadingCombos } = useCombos();
  const { data: subjectsData, isLoading: isLoadingSubjects } = useSubjects();

  const onSubmit = (data: CurriculumCreateParams) => {
    createCurriculum(data, {
      onSuccess: () => {
        router.push('/admin/curriculums');
      },
      onError: (error: any) => {
        toast({
          title: 'Error',
          description: error.message || 'Failed to create curriculum',
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Add New Curriculum</h2>
      <Card>
        <CardContent className="pt-6">
          <CurriculumForm
            onSubmit={onSubmit}
            loading={isPending || isLoadingCombos || isLoadingSubjects}
            submitLabel="Create Curriculum"
            cancelLabel="Cancel"
            onCancel={() => router.push('/admin/curriculums')}
          />
        </CardContent>
      </Card>
    </div>
  );
} 