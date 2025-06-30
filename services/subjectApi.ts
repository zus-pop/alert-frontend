import { api } from './api';
import axios from "axios";

const BASE_URL = "https://ai-alert-5ea310f83e0b.herokuapp.com";

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

export const createSubject = async (data: { subjectCode: string; subjectName: string }) => {
  const response = await axios.post(`${BASE_URL}/api/subjects`, data);
  return response.data;
};

export const updateSubject = async (id: string, data: { subjectCode: string; subjectName: string }) => {
  const response = await axios.patch(`${BASE_URL}/api/subjects/${id}`, data);
  return response.data;
};

export const deleteSubject = async (id: string) => {
  const response = await axios.delete(`${BASE_URL}/api/subjects/${id}`);
  return response.data;
};

export interface SubjectListResponse {
  data: Subject[];
  totalItems: number;
  totalPage: number;
}

export async function fetchSubjects(page: number = 1, limit: number = 10): Promise<SubjectListResponse> {
  const res = await axios.get(`${BASE_URL}/api/subjects`, {
    params: { page, limit }
  });
  return res.data;
}

export interface CreateSubjectPayload {
  subjectCode: string;
  subjectName: string;
}
