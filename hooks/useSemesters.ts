'use client';

import { useCallback } from 'react';
import { 
  useQuery, 
  useMutation, 
  useQueryClient, 
  UseQueryResult 
} from '@tanstack/react-query';
import { 
  getSemesters, 
  getSemesterById, 
  createSemester, 
  updateSemester, 
  deleteSemester,
  Semester,
  SemestersQueryParams,
  SemestersResponse
} from '@/services/semesterApi';
import { useToast } from '@/components/ui/use-toast';

export function useSemesters(params?: SemestersQueryParams): UseQueryResult<SemestersResponse, Error> {
  return useQuery({
    queryKey: ['semesters', params],
    queryFn: () => getSemesters(params),
  });
}

export function useSemester(id: string): UseQueryResult<Semester, Error> {
  return useQuery({
    queryKey: ['semester', id],
    queryFn: () => getSemesterById(id),
    enabled: !!id, // Only run the query if id is provided
  });
}

export function useCreateSemester() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: Omit<Semester, '_id'>) => createSemester(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semesters'] });
      toast({
        title: "Semester created",
        description: "The semester has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create semester: ${error.message}`,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateSemester() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Semester, '_id'>> }) => 
      updateSemester(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['semesters'] });
      queryClient.invalidateQueries({ queryKey: ['semester', variables.id] });
      toast({
        title: "Semester updated",
        description: "The semester has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update semester: ${error.message}`,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteSemester() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (id: string) => deleteSemester(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semesters'] });
      toast({
        title: "Semester deleted",
        description: "The semester has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete semester: ${error.message}`,
        variant: "destructive",
      });
    },
  });
}
