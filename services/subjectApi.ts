import { api } from './api';

export interface Subject {
  _id: string;
  subjectCode: string;
  subjectName: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  prerequisite?: { subjectCode: string; subjectName: string }[];
}

export interface SubjectsResponse {
  data: Subject[];
  totalItems: number;
  totalPage: number;
}

export interface SubjectsQueryParams {
  page?: number;
  limit?: number;
  subjectCode?: string;
  subjectName?: string;
  order?: 'asc' | 'desc' | 'ascending' | 'descending';
}

export const getSubjects = async (params?: SubjectsQueryParams): Promise<SubjectsResponse> => {
  const response = await api.get('/subjects', { params });
  return response.data;
};

export const getSubjectById = async (id: string): Promise<Subject> => {
  const response = await api.get(`/subjects/${id}`);
  return response.data;
};

export const createSubject = async (data: { subjectCode: string; subjectName: string; prerequisite?: string[] }) => {
  const response = await api.post('/subjects', data);
  return response.data;
};

export const updateSubject = async (id: string, data: { subjectCode: string; subjectName: string; prerequisite?: string[] }) => {
  const response = await api.patch(`/subjects/${id}`, data);
  return response.data;
};

export const deleteSubject = async (id: string) => {
  const response = await api.delete(`/subjects/${id}`);
  return response.data;
};

export interface SubjectListResponse {
  data: Subject[];
  totalItems: number;
  totalPage: number;
}

export async function fetchSubjects(page: number = 1, limit: number = 10): Promise<SubjectListResponse> {
  const res = await api.get('/subjects', {
    params: { page, limit }
  });
  return res.data;
}

export interface CreateSubjectPayload {
  subjectCode: string;
  subjectName: string;
}
