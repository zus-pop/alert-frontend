'use client';
import { useRouter } from 'next/navigation';
import { useCreateMajor } from '@/hooks/useMajors';
import MajorForm from '../components/MajorForm';
import { useToast } from '@/hooks/use-toast';

export default function NewMajorPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: createMajor, isPending } = useCreateMajor();

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-slate-800">Add Major</h2>
      <MajorForm
        onSubmit={(data) =>
          createMajor(data, {
            onSuccess: () => {
              toast({
                title: "Major created",
                description: "The major has been created successfully.",
              });
              router.push('/admin/majors');
            },
            onError: (error) => {
              toast({
                title: "Error",
                description: `Failed to create major: ${error.message}`,
                variant: "destructive",
              });
            }
          })
        }
        loading={isPending}
        submitLabel="Create Major"
        cancelLabel="Cancel"
        onCancel={() => router.push('/admin/majors')}
      />
    </div>
  );
}
