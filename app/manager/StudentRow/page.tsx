"use client"

import type React from "react"
import { useState } from "react"
import type { Student } from "../studentmanager/StudentManager"
import { Pencil, Trash } from "lucide-react"

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
            className="p-2 rounded hover:bg-yellow-100 transition-colors"
            title="Sửa sinh viên"
          >
            <Pencil className="w-5 h-5 text-yellow-600" />
          </button>
          <button
            onClick={() => {
              if (window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
                onDelete(student.id)
              }
            }}
            className="p-2 rounded hover:bg-red-100 transition-colors"
            title="Xóa sinh viên"
          >
            <Trash className="w-5 h-5 text-red-600" />
          </button>
        </div>
      </td>
    </tr>
  )
}
