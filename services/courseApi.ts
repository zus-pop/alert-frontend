import { api } from './api';

export interface Course {
  _id: string;
  title?: string;
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

export async function updateCourse(id: string, data: { title?: string; semesterId?: string; image?: File | null }) {
  const formData = new FormData();
  if (data.title !== undefined) formData.append('title', data.title);
  if (data.semesterId !== undefined) formData.append('semesterId', data.semesterId);
  if (data.image) formData.append('image', data.image);
  const res = await api.patch(`/courses/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
} 