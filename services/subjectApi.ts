import { api } from './api';

export interface Subject {
  _id: string;
  subjectCode: string;
  subjectName: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
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

export const createSubject = async (subjectData: Omit<Subject, '_id'>): Promise<Subject> => {
  const response = await api.post('/subjects', subjectData);
  return response.data;
};

export const updateSubject = async (id: string, subjectData: Partial<Omit<Subject, '_id'>>): Promise<Subject> => {
  try {
    const response = await api.patch(`/subjects/${id}`, subjectData);
    return response.data;
  } catch (error: any) {
    console.error('Update error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

export const deleteSubject = async (id: string): Promise<void> => {
  await api.delete(`/subjects/${id}`);
};
