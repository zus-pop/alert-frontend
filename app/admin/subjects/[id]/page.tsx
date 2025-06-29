'use client';

import { useSubject } from '@/hooks/useSubjects';
import { SubjectForm } from '../components/SubjectForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

interface EditSubjectPageProps {
  params: {
    id: string;
  };
}

export default function EditSubjectPage({ params }: EditSubjectPageProps) {
  const { data: subject, isLoading, isError, error } = useSubject(params.id);

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
          Error loading subject: {error?.message || 'Unknown error'}
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-muted-foreground py-8">
          Subject not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <SubjectForm subject={subject} isEditing />
    </div>
  );
}
