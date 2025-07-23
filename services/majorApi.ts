import { api } from './api';
import { 
  Major, 
  MajorCreateParams, 
  MajorQueryParams, 
  MajorResponse,
  MajorUpdateParams 
} from './majorApi.types';

// KHÔNG định nghĩa lại interface Major ở đây!

export interface Combo {
  _id: string;
  comboCode: string;
  comboName: string;
  description?: string;
  majorId: string | { majorCode: string; majorName: string };
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// CRUD cho major
export async function getMajors(params?: MajorQueryParams): Promise<MajorResponse> {
  const res = await api.get('/majors', { params });
  return res.data;
}

// CRUD cho combo
export async function getCombos(params?: any): Promise<Combo[]> {
  const res = await api.get('/combos', { params });
  return res.data.data || res.data;
}