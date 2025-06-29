import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import {
  SystemUser,
  SystemUserCreateRequest,
  SystemUserUpdateRequest,
  SystemUsersQueryParams,
  createSystemUser,
  deleteSystemUser,
  getSystemUserById,
  getSystemUsers,
  updateSystemUser
} from '@/services/systemUserApi';

// Keys for React Query
export const systemUserKeys = {
  all: ['systemUsers'] as const,
  lists: () => [...systemUserKeys.all, 'list'] as const,
  list: (filters: SystemUsersQueryParams) => [...systemUserKeys.lists(), filters] as const,
  details: () => [...systemUserKeys.all, 'detail'] as const,
  detail: (id: string) => [...systemUserKeys.details(), id] as const,
};

// Hook to fetch system users with pagination and filters
export const useSystemUsers = (params: SystemUsersQueryParams = {}) => {
  return useQuery({
    queryKey: systemUserKeys.list(params),
    queryFn: () => getSystemUsers(params),
    placeholderData: (previousData) => previousData,
  });
};

// Hook to fetch a single system user by ID
export const useSystemUserById = (id: string) => {
  return useQuery({
    queryKey: systemUserKeys.detail(id),
    queryFn: () => getSystemUserById(id),
    enabled: !!id,
  });
};

// Hook to create a new system user
export const useCreateSystemUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: SystemUserCreateRequest) => createSystemUser(userData),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'System user created successfully',
      });
      queryClient.invalidateQueries({ queryKey: systemUserKeys.lists() });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create system user',
      });
    },
  });
};

// Hook to update an existing system user
export const useUpdateSystemUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SystemUserUpdateRequest }) => 
      updateSystemUser(id, data),
    onSuccess: (_, variables) => {
      toast({
        title: 'Success',
        description: 'System user updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: systemUserKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: systemUserKeys.lists() });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update system user',
      });
    },
  });
};

// Hook to delete a system user
export const useDeleteSystemUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteSystemUser(id),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'System user deleted successfully',
      });
      // Invalidate all system users queries to refresh the data
      queryClient.invalidateQueries({ queryKey: systemUserKeys.lists() });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete system user',
      });
    },
  });
};
