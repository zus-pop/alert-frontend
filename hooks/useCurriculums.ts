import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCurriculums, getCurriculum, createCurriculum, updateCurriculum, deleteCurriculum } from '@/services/curriculumApi';
import { 
  Curriculum, 
  CurriculumCreateParams, 
  CurriculumQueryParams, 
  CurriculumResponse,
  CurriculumUpdateParams 
} from '@/services/curriculumApi.types';

export function useCurriculums(params?: CurriculumQueryParams) {
  return useQuery<CurriculumResponse>({
    queryKey: ['curriculums', params],
    queryFn: () => getCurriculums(params),
  });
}

export function useCurriculum(id: string) {
  return useQuery<Curriculum>({
    queryKey: ['curriculum', id],
    queryFn: () => getCurriculum(id),
    enabled: !!id,
  });
}

export function useCreateCurriculum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CurriculumCreateParams) => createCurriculum(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['curriculums'] }),
  });
}

export function useUpdateCurriculum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: CurriculumUpdateParams }) => updateCurriculum(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['curriculums'] });
      queryClient.invalidateQueries({ queryKey: ['curriculum', variables.id] });
    },
  });
}

export function useDeleteCurriculum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCurriculum,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['curriculums'] }),
  });
} 