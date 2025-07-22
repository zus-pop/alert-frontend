import { api } from './api';

// Interface cho Major, Combo, Curriculum
export interface Major {
  _id: string;
  majorCode: string;
  majorName: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

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

export interface Curriculum {
  _id: string;
  curriculumName: string;
  comboId: string | {
    _id: string;
    comboCode: string;
    comboName: string;
    description?: string;
    majorId: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
  };
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  subjects: any[];
}

// CRUD cho major
export async function getMajors(params?: any): Promise<Major[]> {
  const res = await api.get('/majors', { params });
  return res.data.data || res.data;
}
export async function getMajor(id: string): Promise<Major> {
  const res = await api.get(`/majors/${id}`);
  return res.data;
}
export async function createMajor(data: Partial<Major>): Promise<Major> {
  const res = await api.post('/majors', data);
  return res.data;
}
export async function updateMajor(id: string, data: Partial<Major>): Promise<Major> {
  const res = await api.patch(`/majors/${id}`, data);
  return res.data;
}
export async function deleteMajor(id: string): Promise<void> {
  await api.delete(`/majors/${id}`);
}

// CRUD cho combo, curriculum (nếu cần)
export async function getCombos(params?: any): Promise<Combo[]> {
  const res = await api.get('/combos', { params });
  return res.data.data || res.data;
}
export async function getCurriculums(params?: any): Promise<Curriculum[]> {
  const res = await api.get('/curriculums', { params });
  return res.data.data || res.data;
}
