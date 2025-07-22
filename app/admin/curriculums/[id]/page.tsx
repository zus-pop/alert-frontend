'use client';
import { useRouter } from 'next/navigation';
import { useCurriculum, useUpdateCurriculum } from '@/hooks/useCurriculums';
import CurriculumForm from '../components/CurriculumForm';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Curriculum, SubjectSemester } from '@/services/curriculumApi.types';

// Define an interface for subjects with semester info in response
interface SubjectWithSemester {
  _id: string;
  subjectCode: string;
  subjectName: string;
  semesterNumber?: number;
}

export default function EditCurriculumPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const router = useRouter();
  const { toast } = useToast();
  const { data: curriculum, isLoading, error } = useCurriculum(id);
  const { mutate: updateCurriculum, isPending } = useUpdateCurriculum();

  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen p-6 rounded-md flex justify-center items-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-gray-500">Loading curriculum data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-50 min-h-screen p-6 rounded-md">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
        <button 
          onClick={() => router.push('/admin/curriculums')}
          className="text-blue-500 hover:underline"
        >
          Return to curriculum list
        </button>
      </div>
    );
  }

  // Transform curriculum data to form format with subject semester information
  const formDefaultValues = curriculum ? {
    curriculumName: curriculum.curriculumName,
    comboId: typeof curriculum.comboId === 'string' ? curriculum.comboId : (curriculum.comboId as any)?._id,
    subjects: curriculum.subjects?.map(subject => {
      // Handle different possible formats of subject data from API
      if (typeof subject === 'string') {
        // If it's just a string ID
        return { subjectId: subject, semesterNumber: 1 };
      } else if (subject._id) {
        const subjectWithSemester = subject as SubjectWithSemester;
        return {
          subjectId: subjectWithSemester._id,
          // Try to get semesterNumber from multiple possible locations in the object
          semesterNumber: 
            // First try direct semesterNumber property
            subjectWithSemester.semesterNumber !== undefined ? subjectWithSemester.semesterNumber : 
            // Then try nested data structure that might be returned by API
            (subject as any).semesterNumber !== undefined ? (subject as any).semesterNumber :
            // Default to 1 if not found
            1
        };
      } else {
        // Fallback for any other format
        return {
          subjectId: (subject as any).subjectId || (subject as any)._id,
          semesterNumber: (subject as any).semesterNumber || 1
        };
      }
    }) || []
  } : undefined;

  return (
    <div className="bg-slate-50 min-h-screen p-6 rounded-md">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Edit Curriculum</h2>
          <p className="text-gray-600 mt-1">Update curriculum information</p>
        </div>
      </div>
      
      <CurriculumForm
        defaultValues={formDefaultValues}
        onSubmit={data =>
          updateCurriculum({ id, data }, {
            onSuccess: () => {
              toast({
                title: "Success",
                description: "Curriculum updated successfully",
              });
              router.push('/admin/curriculums');
            },
            onError: (error: any) => {
              toast({
                title: "Error",
                description: error.message || "Failed to update curriculum",
                variant: "destructive",
              });
            }
          })
        }
        loading={isPending}
        submitLabel="Update Curriculum"
        cancelLabel="Cancel"
        onCancel={() => router.push('/admin/curriculums')}
      />
    </div>
  );
} 