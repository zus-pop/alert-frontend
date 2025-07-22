import { api } from './api';

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

export async function getMajors(params?: any): Promise<Major[]> {
  const res = await api.get('/majors', { params });
  return res.data.data || res.data;
}

export async function getCombos(params?: any): Promise<Combo[]> {
  const res = await api.get('/combos', { params });
  return res.data.data || res.data;
}

export async function getCurriculums(params?: any): Promise<Curriculum[]> {
  const res = await api.get('/curriculums', { params });
  return res.data.data || res.data;
} 