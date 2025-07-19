'use client';
import { useRouter } from 'next/navigation';
import { useCreateCurriculum } from '@/hooks/useCurriculums';
import CurriculumForm from '../components/CurriculumForm';
import { useToast } from '@/hooks/use-toast';

export default function NewCurriculumPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: createCurriculum, isPending } = useCreateCurriculum();

  return (
    <div className="bg-slate-50 min-h-screen p-6 rounded-md">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Add Curriculum</h2>
          <p className="text-gray-600 mt-1">Create a new curriculum for students</p>
        </div>
      </div>
      
      <CurriculumForm
        onSubmit={data =>
          createCurriculum(data, {
            onSuccess: () => {
              toast({
                title: "Success",
                description: "Curriculum created successfully",
              });
              router.push('/admin/curriculums');
            },
            onError: (error: any) => {
              toast({
                title: "Error",
                description: error.message || "Failed to create curriculum",
                variant: "destructive",
              });
            }
          })
        }
        loading={isPending}
        submitLabel="Create Curriculum"
        cancelLabel="Cancel"
        onCancel={() => router.push('/admin/curriculums')}
      />
    </div>
  );
} 