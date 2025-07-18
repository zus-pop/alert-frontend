"use client"
import { StudentForm } from '../../manager/studentmanager/StudentForm'
import { useRouter } from 'next/navigation'
import { createStudent } from '@/services/studentApi';

export interface StudentFormInput {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  password: string;
}

export default function AddStudentPage() {
  const router = useRouter();

  const handleAddStudent = async (studentData: StudentFormInput) => {
    try {
      const body = {
        studentCode: `S${Date.now()}`,
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        gender: studentData.gender,
        email: studentData.email,
        password: studentData.password
      }
      await createStudent(body);
      router.push('/manager')
    } catch (err: any) {
      console.error("Lỗi hệ thống:", err)
      alert('Lỗi hệ thống!')
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Add New Student</h2>
      <StudentForm
        onSubmit={handleAddStudent}
        onCancel={() => router.push('/manager')}
      />
    </div>
  )
}
