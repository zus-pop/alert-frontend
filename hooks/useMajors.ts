import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMajors, getMajor, createMajor, updateMajor, deleteMajor } from '@/services/majorApi';
import { 
  Major, 
  MajorCreateParams, 
  MajorQueryParams, 
  MajorResponse,
  MajorUpdateParams 
} from '@/services/majorApi.types';

export function useMajors(params?: MajorQueryParams) {
  return useQuery<MajorResponse>({
    queryKey: ['majors', params],
    queryFn: () => getMajors(params),
  });
}

export function useMajor(id: string) {
  return useQuery<Major>({
    queryKey: ['major', id],
    queryFn: () => getMajor(id),
    enabled: !!id,
  });
}

export function useCreateMajor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MajorCreateParams) => createMajor(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['majors'] }),
  });
}

export function useUpdateMajor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: MajorUpdateParams }) => updateMajor(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['majors'] });
      queryClient.invalidateQueries({ queryKey: ['major', variables.id] });
    },
  });
}

export function useDeleteMajor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMajor,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['majors'] }),
  });
}
