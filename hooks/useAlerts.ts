import { useApiGet, useApiPatch } from './useApi';
import { Alert, AlertsQueryParams, SupervisorResponse } from '@/services/alertApi';

export const useAlerts = (params?: AlertsQueryParams) => {
  const { 
    data, 
    isLoading, 
    isError, 
    refetch 
  } = useApiGet<{
    data: Alert[];
    totalItems: number;
    totalPage: number;
  }>('/alerts', ['alerts', JSON.stringify(params)], {
    enabled: true,
  });

  return {
    alerts: data?.data || [],
    totalItems: data?.totalItems || 0,
    totalPages: data?.totalPage || 0,
    isLoading,
    isError,
    refetch
  };
};

export const useAlert = (id: string) => {
  const { 
    data: alert, 
    isLoading, 
    isError 
  } = useApiGet<Alert>(`/alerts/${id}`, ['alerts', id], {
    enabled: !!id,
  });

  return {
    alert,
    isLoading,
    isError
  };
};

export const useUpdateAlert = () => {
  const updateAlertMutation = useApiPatch<{
    supervisorResponse?: SupervisorResponse;
    status?: 'NOT RESPONDED' | 'RESPONDED';
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  }, Alert>('/alerts', {
    onSuccess: (data: Alert) => {
      // You can add a success toast notification here
    }
  });

  const updateAlert = async (id: string, data: {
    supervisorResponse?: SupervisorResponse;
    status?: 'NOT RESPONDED' | 'RESPONDED';
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  }) => {
    return updateAlertMutation.mutateAsync({ id, data });
  };

  return {
    updateAlert,
    isLoading: updateAlertMutation.isPending,
    isError: updateAlertMutation.isError,
    isSuccess: updateAlertMutation.isSuccess,
  };
};
