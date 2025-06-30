import { api } from './api';

export interface Semester {
  _id: string;
  semesterName: string;
  startDate: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface SemestersResponse {
  data: Semester[];
  totalItems: number;
  totalPage: number;
}

export interface SemestersQueryParams {
  page?: number;
  limit?: number;
  semesterName?: string;
  startDate?: string;
  endDate?: string;
  order?: 'asc' | 'desc' | 'ascending' | 'descending';
}

export const getSemesters = async (params?: SemestersQueryParams): Promise<SemestersResponse> => {
  const response = await api.get('/semesters', { params });
  return response.data;
};

export const getSemesterById = async (id: string): Promise<Semester> => {
  const response = await api.get(`/semesters/${id}`);
  return response.data;
};

export const createSemester = async (semesterData: Omit<Semester, '_id'>): Promise<Semester> => {
  const response = await api.post('/semesters', semesterData);
  return response.data;
};


export const updateSemester = async (id: string, semesterData: Partial<Omit<Semester, '_id'>>): Promise<Semester> => {
  try {
    const response = await api.patch(`/semesters/${id}`, semesterData);
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

export const deleteSemester = async (id: string): Promise<void> => {
  await api.delete(`/semesters/${id}`);
};
