import axios from "axios";
const BASE_URL = "https://ai-alert-5ea310f83e0b.herokuapp.com";

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
  const res = await axios.get(`${BASE_URL}/api/courses`);
  return res.data.data;
} 