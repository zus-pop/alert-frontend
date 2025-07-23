import { api } from './api';
import { 
  Major, 
  MajorCreateParams, 
  MajorQueryParams, 
  MajorResponse,
  MajorUpdateParams 
} from './majorApi.types';

export async function getMajors(params?: MajorQueryParams): Promise<MajorResponse> {
  const res = await api.get('/majors', { params });
  return res.data;
}

export async function getMajor(id: string): Promise<Major> {
  const res = await api.get(`/majors/${id}`);
  return res.data;
}

export async function createMajor(data: MajorCreateParams): Promise<Major> {
  const res = await api.post('/majors', data);
  return res.data;
}

export async function updateMajor(id: string, data: MajorUpdateParams): Promise<Major> {
  const res = await api.patch(`/majors/${id}`, data);
  return res.data;
}

export async function deleteMajor(id: string): Promise<void> {
  const res = await api.delete(`/majors/${id}`);
  return res.data;
}
