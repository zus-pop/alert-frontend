import { api } from './api';

export interface Session {
  _id: string;
  courseId: string | { _id: string };
  title: string;
  startTime: string;
  endTime: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function fetchSessions(params: { courseId: string }) {
  const res = await api.get('/sessions', { params });
  return { data: res.data.data };
} 