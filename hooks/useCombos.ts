'use client';

import { 
  useQuery, 
  useMutation, 
  useQueryClient, 
  UseQueryResult 
} from '@tanstack/react-query';
import { 
  getCombos, 
  getComboById, 
  createCombo, 
  updateCombo, 
  deleteCombo,
  Combo,
  CombosQueryParams,
  CombosResponse
} from '@/services/comboApi';
import { useToast } from '@/components/ui/use-toast';

// Helper function to ensure consistent query keys
const queryKeys = {
  all: ['combos'] as const,
  lists: () => [...queryKeys.all, 'list'] as const,
  list: (params?: CombosQueryParams) => [...queryKeys.lists(), params] as const,
  details: () => [...queryKeys.all, 'detail'] as const,
  detail: (id: string) => [...queryKeys.details(), id] as const,
};

export function useCombos(params?: CombosQueryParams): UseQueryResult<CombosResponse, Error> {
  return useQuery({
    queryKey: queryKeys.list(params),
    queryFn: () => getCombos(params),
  });
}

export function useCombo(id: string): UseQueryResult<Combo, Error> {
  return useQuery({
    queryKey: queryKeys.detail(id),
    queryFn: () => getComboById(id),
    enabled: !!id, // Only run the query if id is provided
  });
}

export function useCreateCombo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: createCombo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      toast({
        title: "Combo created",
        description: "The combo has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to create combo: ${error?.message || 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateCombo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      updateCombo(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      toast({
        title: "Combo updated",
        description: "The combo has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to update combo: ${error?.message || 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteCombo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: deleteCombo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      toast({
        title: "Combo deleted",
        description: "The combo has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to delete combo: ${error?.message || 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });
}
