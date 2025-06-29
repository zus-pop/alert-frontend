"use client"

import type React from "react"
import { useState } from "react"
import { StudentRow } from "../StudentRow/page"
import { StudentForm } from "../StudentForm/page"

export interface Student {
  id: string
  fullName: string
  studentId: string
  gender: "Male" | "Female" | "Other"
  email: string
  password: string
  subjects: string[]
  scores: { [subject: string]: number }
  attendance: { [subject: string]: number }
}

export const StudentManager: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      fullName: "John Doe",
      studentId: "ST001",
      gender: "Male",
      email: "john.doe@example.com",
      password: "password123",
      subjects: ["EXE101", "MMA301", "SWD392"],
      scores: { EXE101: 85, MMA301: 92, SWD392: 78 },
      attendance: { EXE101: 95, MMA301: 88, SWD392: 92 },
    },
    {
      id: "2",
      fullName: "Jane Smith",
      studentId: "ST002",
      gender: "Female",
      email: "jane.smith@example.com",
      password: "password456",
      subjects: ["SDN302", "MMA301", "SWD392"],
      scores: { SDN302: 90, MMA301: 87, SWD392: 94 },
      attendance: { SDN302: 92, MMA301: 85, SWD392: 98 },
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)

  const handleAddStudent = (studentData: Omit<Student, "id">) => {
    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString(),
    }
    setStudents([...students, newStudent])
    setShowForm(false)
  }

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(students.map((student) => (student.id === updatedStudent.id ? updatedStudent : student)))
    setEditingStudent(null)
    setShowForm(false)
  }

  const handleDeleteStudent = (studentId: string) => {
    setStudents(students.filter((student) => student.id !== studentId))
  }

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student)
    setShowForm(true)
  }

  const handleUpdateScoreOrAttendance = (
    studentId: string,
    field: "scores" | "attendance",
    subject: string,
    value: number,
  ) => {
    setStudents(
      students.map((student) => {
        if (student.id === studentId) {
          return {
            ...student,
            [field]: {
              ...student[field],
              [subject]: value,
            },
          }
        }
        return student
      }),
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Student Management System</h1>
            <button
              onClick={() => {
                setEditingStudent(null)
                setShowForm(true)
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Add New Student
            </button>
          </div>

          {showForm && (
            <div className="mb-6">
              <StudentForm
                student={editingStudent}
                onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent}
                onCancel={() => {
                  setShowForm(false)
                  setEditingStudent(null)
                }}
              />
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Full Name</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Student ID</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Gender</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Password</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Subjects</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Scores</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Attendance</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <StudentRow
                    key={student.id}
                    student={student}
                    onEdit={handleEditStudent}
                    onDelete={handleDeleteStudent}
                    onUpdateScoreOrAttendance={handleUpdateScoreOrAttendance}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {students.length === 0 && (
            <div className="text-center py-8 text-gray-500">No students found. Add a new student to get started.</div>
          )}
        </div>
      </div>
    </div>
  )
}
