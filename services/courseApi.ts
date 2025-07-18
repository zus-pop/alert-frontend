import { api } from './api';

export interface Course {
  _id: string;
  subjectId: {
    _id: string;
    subjectCode: string;
    subjectName: string;
  };
  semesterId: {
    _id: string;
    semesterName: string;
    startDate: string;
    endDate: string;
  };
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export async function fetchCourses(): Promise<Course[]> {
  const res = await api.get('/courses');
  return res.data.data;
} 