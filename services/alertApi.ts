import { api } from './api';

export interface Grade {
  type: string;
  weight: number;
  score: number | null;
}

export interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
}

export interface Subject {
  _id: string;
  subjectCode: string;
  subjectName: string;
}

export interface Semester {
  _id: string;
  semesterName: string;
  startDate: string;
  endDate: string;
}

export interface Course {
  _id: string;
  subjectId: Subject | null;
  semesterId: Semester;
}

export interface Enrollment {
  _id: string;
  courseId: Course;
  studentId: Student;
  enrollmentDate: string;
  grade: Grade[];
  status: 'IN PROGRESS' | 'PASSED' | 'NOT PASSED';
}

export interface SupervisorResponse {
  response: string;
  plan: string;
  createdAt?: string;
  _id?: string;
}

export interface Alert {
  _id: string;
  enrollmentId: Enrollment;
  title: string;
  content: string;
  supervisorResponse?: SupervisorResponse;
  date: string;
  status: 'NOT RESPONDED' | 'RESPONDED' | 'RESOLVED';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  isRead: boolean;
}

export interface AlertsResponse {
  data: Alert[];
  totalItems: number;
  totalPage: number;
}

export interface AlertsQueryParams {
  title?: string;
  status?: string;
  riskLevel?: string;
  enrollmentId?: string;
  order?: string;
  page?: number;
  limit?: number;
}

export const getAlerts = async (params?: AlertsQueryParams): Promise<AlertsResponse> => {
  const response = await api.get('/alerts', { params });
  return response.data;
};

export const getAlertById = async (id: string): Promise<Alert> => {
  const response = await api.get(`/alerts/${id}`);
  return response.data;
};

export const updateAlert = async (
  id: string, 
  data: { 
    supervisorResponse?: SupervisorResponse;
    status?: 'NOT RESPONDED' | 'RESPONDED' | 'RESOLVED';
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  }
): Promise<Alert> => {
  const response = await api.patch(`/alerts/${id}`, data);
  return response.data;
};
