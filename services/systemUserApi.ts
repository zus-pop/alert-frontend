import { api } from './api';

export interface SystemUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'MANAGER' | 'SUPERVISOR';
  password?: string;
}

export interface SystemUserCreateRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'MANAGER' | 'SUPERVISOR';
}

export interface SystemUserUpdateRequest {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: 'MANAGER' | 'SUPERVISOR';
}

export interface SystemUsersResponse {
  data: SystemUser[];
  totalItems: number;
  totalPage: number;
}

export interface SystemUsersQueryParams {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  order?: string;
  page?: number;
  limit?: number;
}

export const getSystemUsers = async (params?: SystemUsersQueryParams): Promise<SystemUsersResponse> => {
  const response = await api.get('/system-users', { params });
  return response.data;
};

export const getSystemUserById = async (id: string): Promise<SystemUser> => {
  const response = await api.get(`/system-users/${id}`);
  return response.data;
};

export const createSystemUser = async (userData: SystemUserCreateRequest): Promise<SystemUser> => {
  const response = await api.post('/system-users', userData);
  return response.data;
};

export const updateSystemUser = async (id: string, userData: SystemUserUpdateRequest): Promise<SystemUser> => {
  const response = await api.patch(`/system-users/${id}`, userData);
  return response.data;
};

export const deleteSystemUser = async (id: string): Promise<void> => {
  await api.delete(`/system-users/${id}`);
};
