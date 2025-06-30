"use client"

import type React from "react"
import { useState } from "react"
import type { Student } from "../studentmanager/StudentManager"

interface StudentRowProps {
  student: Student
  onEdit: (student: Student) => void
  onDelete: (studentId: string) => void
  onUpdateScoreOrAttendance: (studentId: string, field: "scores" | "attendance", subject: string, value: number) => void
}

export const StudentRow: React.FC<StudentRowProps> = ({ student, onEdit, onDelete, onUpdateScoreOrAttendance }) => {
  const [editingScore, setEditingScore] = useState<string | null>(null)
  const [editingAttendance, setEditingAttendance] = useState<string | null>(null)

  const handleScoreChange = (subject: string, value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      onUpdateScoreOrAttendance(student.id, "scores", subject, numValue)
    }
    setEditingScore(null)
  }

  const handleAttendanceChange = (subject: string, value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      onUpdateScoreOrAttendance(student.id, "attendance", subject, numValue)
    }
    setEditingAttendance(null)
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="border border-gray-300 px-4 py-3 text-gray-800">{student.fullName}</td>
      <td className="border border-gray-300 px-4 py-3 text-gray-800">{student.studentId}</td>
      <td className="border border-gray-300 px-4 py-3 text-gray-800">{student.gender}</td>
      <td className="border border-gray-300 px-4 py-3 text-gray-800">{student.email}</td>
      <td className="border border-gray-300 px-4 py-3 text-gray-800">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(student)}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            Sửa
          </button>
          <button
            onClick={() => {
              if (window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
                onDelete(student.id)
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            Xóa
          </button>
        </div>
      </td>
    </tr>
  )
}
