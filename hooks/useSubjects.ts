'use client';

import { useCallback } from 'react';
import { 
  useQuery, 
  useMutation, 
  useQueryClient, 
  UseQueryResult 
} from '@tanstack/react-query';
import { 
  getSubjects, 
  getSubjectById, 
  createSubject, 
  updateSubject, 
  deleteSubject,
  Subject,
  SubjectsQueryParams,
  SubjectsResponse
} from '@/services/subjectApi';
import { useToast } from '@/components/ui/use-toast';

// Helper function to ensure consistent query keys
const queryKeys = {
  all: ['subjects'] as const,
  lists: () => [...queryKeys.all, 'list'] as const,
  list: (params?: SubjectsQueryParams) => [...queryKeys.lists(), params] as const,
  details: () => [...queryKeys.all, 'detail'] as const,
  detail: (id: string) => [...queryKeys.details(), id] as const,
};

export function useSubjects(params?: SubjectsQueryParams): UseQueryResult<SubjectsResponse, Error> {
  return useQuery({
    queryKey: queryKeys.list(params),
    queryFn: () => getSubjects(params),
  });
}

export function useSubject(id: string): UseQueryResult<Subject, Error> {
  return useQuery({
    queryKey: queryKeys.detail(id),
    queryFn: () => getSubjectById(id),
    enabled: !!id, // Only run the query if id is provided
  });
}

export function useCreateSubject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Omit<Subject, '_id'>) => createSubject(data),
    
    onSuccess: (data, variables, context) => {
      // BƯỚC 1: Thêm dòng log này
      console.log('Mutation successful, onSuccess callback fired!');
      console.log('Attempting to refetch with key:', queryKeys.lists());
 toast({
 title: "Subject created",
description: "The subject has been created successfully.",
});
queryClient.refetchQueries({ queryKey: queryKeys.lists() });
},
    
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create subject: ${error.message}`,
        variant: "destructive",
      });
    },
  });
}



export function useUpdateSubject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Subject, '_id'>> }) => 
      updateSubject(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches to prevent them overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: queryKeys.detail(id) });
      await queryClient.cancelQueries({ queryKey: queryKeys.lists() });
      
      // Snapshot the previous value
      const previousSubject = queryClient.getQueryData<Subject>(queryKeys.detail(id));
      
      // Apply optimistic update to detail view
      if (previousSubject) {
        queryClient.setQueryData(queryKeys.detail(id), {
          ...previousSubject,
          ...data,
        });
      }
      
      // Apply optimistic update to any lists containing this subject
      const previousLists = queryClient.getQueriesData<SubjectsResponse>({ 
        queryKey: queryKeys.lists(),
        predicate: (query) => query.queryKey.length >= 2 
      });
      
      for (const [queryKey, previousList] of previousLists) {
        if (previousList) {
          queryClient.setQueryData(queryKey, {
            ...previousList,
            data: previousList.data.map(subject => 
              subject._id === id 
                ? { ...subject, ...data, updatedAt: new Date().toISOString() } 
                : subject
            )
          });
        }
      }
      
      return { previousSubject, previousLists };
    },
    onSuccess: (updatedSubject, { id }) => {
      // Update with the confirmed data from the server
      queryClient.setQueryData(queryKeys.detail(id), updatedSubject);
      
      // Update any list queries that might contain this item
      const listQueries = queryClient.getQueriesData<SubjectsResponse>({ 
        queryKey: queryKeys.lists()
      });
      
      for (const [queryKey, listData] of listQueries) {
        if (listData) {
          queryClient.setQueryData(queryKey, {
            ...listData,
            data: listData.data.map(subject => 
              subject._id === id ? updatedSubject : subject
            )
          });
        }
      }
      
      toast({
        title: "Subject updated",
        description: "The subject has been updated successfully.",
      });
    },
    onError: (error, { id }, context) => {
      // Revert the optimistic update for the detail
      if (context?.previousSubject) {
        queryClient.setQueryData(queryKeys.detail(id), context.previousSubject);
      }
      
      // Revert the optimistic update for any lists
      if (context?.previousLists) {
        for (const [queryKey, previousList] of context.previousLists) {
          queryClient.setQueryData(queryKey, previousList);
        }
      }
      
      toast({
        title: "Error",
        description: `Failed to update subject: ${error.message}`,
        variant: "destructive",
      });
    },
    // Always refetch after error or success for consistency
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
    }
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteSubject(id),
    // BỎ onMutate (optimistic update)
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      toast({
        title: "Subject deleted",
        description: "The subject has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete subject: ${error.message}`,
        variant: "destructive",
      });
    },
  });
}
