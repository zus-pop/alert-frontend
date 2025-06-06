"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Student } from "./StudentManager"

interface StudentFormProps {
  student?: Student | null
  onSubmit: (student: Student | Omit<Student, "id">) => void
  onCancel: () => void
}

export const StudentForm: React.FC<StudentFormProps> = ({ student, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    gender: "Male" as "Male" | "Female" | "Other",
    email: "",
    password: "",
    subjects: [] as string[],
    scores: {} as { [subject: string]: number },
    attendance: {} as { [subject: string]: number },
  })

  const [newSubject, setNewSubject] = useState("")

  const availableSubjects = ["EXE101", "MMA301", "SWD392", "SDN302", "PRN211", "DBI202", "PRO192"]

  useEffect(() => {
    if (student) {
      setFormData({
        fullName: student.fullName,
        studentId: student.studentId,
        gender: student.gender,
        email: student.email,
        password: student.password,
        subjects: student.subjects,
        scores: student.scores,
        attendance: student.attendance,
      })
    }
  }, [student])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddSubject = (subject: string) => {
    if (subject && !formData.subjects.includes(subject)) {
      const updatedSubjects = [...formData.subjects, subject]
      setFormData((prev) => ({
        ...prev,
        subjects: updatedSubjects,
        scores: { ...prev.scores, [subject]: 0 },
        attendance: { ...prev.attendance, [subject]: 0 },
      }))
      setNewSubject("")
    }
  }

  const handleRemoveSubject = (subject: string) => {
    const updatedSubjects = formData.subjects.filter((s) => s !== subject)
    const updatedScores = { ...formData.scores }
    const updatedAttendance = { ...formData.attendance }
    delete updatedScores[subject]
    delete updatedAttendance[subject]

    setFormData((prev) => ({
      ...prev,
      subjects: updatedSubjects,
      scores: updatedScores,
      attendance: updatedAttendance,
    }))
  }

  const handleScoreChange = (subject: string, value: string) => {
    const numValue = Number.parseFloat(value) || 0
    setFormData((prev) => ({
      ...prev,
      scores: { ...prev.scores, [subject]: numValue },
    }))
  }

  const handleAttendanceChange = (subject: string, value: string) => {
    const numValue = Number.parseFloat(value) || 0
    setFormData((prev) => ({
      ...prev,
      attendance: { ...prev.attendance, [subject]: numValue },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (student) {
      onSubmit({ ...formData, id: student.id })
    } else {
      onSubmit(formData)
    }
  }

  return (
    <div className="bg-gray-100 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{student ? "Edit Student" : "Add New Student"}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
          <div className="flex gap-2 mb-2">
            <select
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a subject</option>
              {availableSubjects
                .filter((subject) => !formData.subjects.includes(subject))
                .map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
            </select>
            <button
              type="button"
              onClick={() => handleAddSubject(newSubject)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Add Subject
            </button>
          </div>

          <div className="space-y-2">
            {formData.subjects.map((subject) => (
              <div key={subject} className="flex items-center gap-4 p-3 bg-white rounded-lg border">
                <span className="font-medium w-20">{subject}</span>
                <div className="flex items-center gap-2">
                  <label className="text-sm">Score:</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.scores[subject] || 0}
                    onChange={(e) => handleScoreChange(subject, e.target.value)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm">Attendance:</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.attendance[subject] || 0}
                    onChange={(e) => handleAttendanceChange(subject, e.target.value)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded"
                  />
                  <span className="text-sm">%</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSubject(subject)}
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {student ? "Update Student" : "Add Student"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
