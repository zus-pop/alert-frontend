import { 
  useQuery, 
  useMutation, 
  useQueryClient, 
  UseQueryResult 
} from '@tanstack/react-query';
import { 
  getCurriculums, 
  getCurriculum, 
  createCurriculum, 
  updateCurriculum, 
  deleteCurriculum,
} from '@/services/curriculumApi';
import { 
  Curriculum, 
  CurriculumCreateParams, 
  CurriculumQueryParams, 
  CurriculumResponse,
  CurriculumUpdateParams 
} from '@/services/curriculumApi.types';
import { useToast } from '@/components/ui/use-toast';

// Helper function to ensure consistent query keys
const queryKeys = {
  all: ['curriculums'] as const,
  lists: () => [...queryKeys.all, 'list'] as const,
  list: (params?: CurriculumQueryParams) => [...queryKeys.lists(), params] as const,
  details: () => [...queryKeys.all, 'detail'] as const,
  detail: (id: string) => [...queryKeys.details(), id] as const,
};

export function useCurriculums(params?: CurriculumQueryParams): UseQueryResult<CurriculumResponse, Error> {
  return useQuery({
    queryKey: queryKeys.list(params),
    queryFn: () => getCurriculums(params),
  });
}

export function useCurriculum(id: string): UseQueryResult<Curriculum, Error> {
  return useQuery({
    queryKey: queryKeys.detail(id),
    queryFn: () => getCurriculum(id),
    enabled: !!id, // Only run the query if id is provided
  });
}

export function useCreateCurriculum() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: createCurriculum,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      toast({
        title: "Curriculum created",
        description: "The curriculum has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to create curriculum: ${error?.message || 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateCurriculum() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CurriculumUpdateParams }) => {
      console.log('Updating curriculum with data:', data);
      return updateCurriculum(id, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      toast({
        title: "Curriculum updated",
        description: "The curriculum has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to update curriculum: ${error?.message || 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteCurriculum() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: deleteCurriculum,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      toast({
        title: "Curriculum deleted",
        description: "The curriculum has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to delete curriculum: ${error?.message || 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });
} 