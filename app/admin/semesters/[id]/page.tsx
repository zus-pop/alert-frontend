'use client';

import { useSemester } from '@/hooks/useSemesters';
import { SemesterForm } from '../components/SemesterForm';
import { Loader2 } from 'lucide-react';

interface EditSemesterPageProps {
  params: {
    id: string;
  };
}

export default function EditSemesterPage({ params }: EditSemesterPageProps) {
  const { data: semester, isLoading, isError, error } = useSemester(params.id);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-destructive py-8">
          Error loading semester: {error?.message || 'Unknown error'}
        </div>
      </div>
    );
  }

  if (!semester) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-muted-foreground py-8">
          Semester not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <SemesterForm semester={semester} isEditing />
    </div>
  );
}
