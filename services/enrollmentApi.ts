import axios from "axios";
const BASE_URL = "https://ai-alert-5ea310f83e0b.herokuapp.com";

export interface Grade {
  type: string;
  weight: number;
  score: number | null;
}

export interface Enrollment {
  _id: string;
  courseId: string;
  studentId: string;
  enrollmentDate: string;
  grade: Grade[];
  status: string;
}

export interface EnrollmentListResponse {
  data: Enrollment[];
  totalItems: number;
  totalPage: number;
}

export async function fetchEnrollments(page: number = 1, limit: number = 10): Promise<EnrollmentListResponse> {
  const res = await axios.get(`${BASE_URL}/api/enrollments`, {
    params: { page, limit }
  });
  return res.data;
} 