'use client';
import { useRouter } from 'next/navigation';
import { useMajor, useUpdateMajor } from '@/hooks/useMajors';
import MajorForm from '../components/MajorForm';
import { useToast } from '@/hooks/use-toast';

export default function EditMajorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: major, isLoading } = useMajor(params.id);
  const { mutate: updateMajor, isPending } = useUpdateMajor();

  if (isLoading) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!major) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        <div className="bg-red-50 text-red-500 p-4 rounded-md border border-red-200">
          <p className="font-medium">Major not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-slate-800">Edit Major</h2>
      <MajorForm
        defaultValues={{
          majorCode: major.majorCode,
          majorName: major.majorName,
        }}
        onSubmit={(data) =>
          updateMajor(
            {
              id: params.id,
              data,
            },
            {
              onSuccess: () => {
                toast({
                  title: "Major updated",
                  description: "The major has been updated successfully.",
                });
                router.push('/admin/majors');
              },
              onError: (error) => {
                toast({
                  title: "Error",
                  description: `Failed to update major: ${error.message}`,
                  variant: "destructive",
                });
              },
            }
          )
        }
        loading={isPending}
        submitLabel="Update Major"
        cancelLabel="Cancel"
        onCancel={() => router.push('/admin/majors')}
      />
    </div>
  );
}
