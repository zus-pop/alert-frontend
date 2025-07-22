"use client"

import type React from "react"
import { useState } from "react"
import type { Student } from "../../../services/studentApi"

interface StudentRowProps {
  student: Student
  onEdit: (student: Student) => void
  onDelete: (studentId: string) => void
  onUpdateScoreOrAttendance: (studentId: string, field: "scores" | "attendance", subject: string, value: number) => void
  onViewDetails: (studentId: string) => void
}

export const StudentRow: React.FC<StudentRowProps> = ({ student, onEdit, onDelete, onViewDetails }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="border border-gray-300 px-4 py-3">{student.studentCode}</td>
      <td className="border border-gray-300 px-4 py-3">{student.firstName} {student.lastName}</td>
      <td className="border border-gray-300 px-4 py-3">{student.gender}</td>
      <td className="border border-gray-300 px-4 py-3">{student.email}</td>
      <td className="border border-gray-300 px-4 py-3">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onViewDetails(student._id)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            View Details
          </button>
          <button
            onClick={() => onEdit(student)}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this student?")) {
                onDelete(student._id)
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}
