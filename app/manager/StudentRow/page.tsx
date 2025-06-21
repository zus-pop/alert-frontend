"use client"

import type React from "react"
import { useState } from "react"
import type { Student } from "../StudentManager/page"

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
      <td className="border border-gray-300 px-4 py-3">{student.fullName}</td>
      <td className="border border-gray-300 px-4 py-3">{student.studentId}</td>
      <td className="border border-gray-300 px-4 py-3">{student.gender}</td>
      <td className="border border-gray-300 px-4 py-3">{student.email}</td>
      <td className="border border-gray-300 px-4 py-3">
        <span className="text-gray-400">••••••••</span>
      </td>
      <td className="border border-gray-300 px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {student.subjects.map((subject) => (
            <span key={subject} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
              {subject}
            </span>
          ))}
        </div>
      </td>
      <td className="border border-gray-300 px-4 py-3">
        <div className="space-y-1">
          {student.subjects.map((subject) => (
            <div key={subject} className="flex items-center gap-2">
              <span className="text-sm font-medium w-16">{subject}:</span>
              {editingScore === subject ? (
                <input
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={student.scores[subject] || 0}
                  onBlur={(e) => handleScoreChange(subject, e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleScoreChange(subject, (e.target as HTMLInputElement).value)
                    }
                  }}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                  autoFocus
                />
              ) : (
                <span
                  onClick={() => setEditingScore(subject)}
                  className="cursor-pointer hover:bg-yellow-100 px-2 py-1 rounded text-sm"
                >
                  {student.scores[subject] || 0}
                </span>
              )}
            </div>
          ))}
        </div>
      </td>
      <td className="border border-gray-300 px-4 py-3">
        <div className="space-y-1">
          {student.subjects.map((subject) => (
            <div key={subject} className="flex items-center gap-2">
              <span className="text-sm font-medium w-16">{subject}:</span>
              {editingAttendance === subject ? (
                <input
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={student.attendance[subject] || 0}
                  onBlur={(e) => handleAttendanceChange(subject, e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAttendanceChange(subject, (e.target as HTMLInputElement).value)
                    }
                  }}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                  autoFocus
                />
              ) : (
                <span
                  onClick={() => setEditingAttendance(subject)}
                  className="cursor-pointer hover:bg-yellow-100 px-2 py-1 rounded text-sm"
                >
                  {student.attendance[subject] || 0}%
                </span>
              )}
            </div>
          ))}
        </div>
      </td>
      <td className="border border-gray-300 px-4 py-3">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(student)}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this student?")) {
                onDelete(student.id)
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
