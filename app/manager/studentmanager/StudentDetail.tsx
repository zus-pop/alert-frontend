"use client"

import type React from "react"
import { useState } from "react"
import type { Student } from "./StudentManager"

interface StudentDetailProps {
  student: Student
  onBack: () => void
  onUpdate: (updatedStudent: Student) => void
  onDelete: (studentId: string) => void
}

export const StudentDetail: React.FC<StudentDetailProps> = ({ student, onBack, onUpdate, onDelete }) => {
  const [editMode, setEditMode] = useState<"profile" | "academic" | "parent" | null>(null)
  const [formData, setFormData] = useState<Student>(student)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    onUpdate(formData)
    setEditMode(null)
  }

  const handleCancel = () => {
    setFormData(student)
    setEditMode(null)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Student Details: {student.fullName}</h1>
        </div>
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this student?")) {
              onDelete(student.id)
            }
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Delete Student
        </button>
      </div>

      {/* Profile Information */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-700">Profile Information</h2>
          {editMode === "profile" ? (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditMode("profile")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium text-gray-700 w-1/4">Full Name</td>
                <td className="py-3 px-4">
                  {editMode === "profile" ? (
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    student.fullName
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium text-gray-700">Date of Birth</td>
                <td className="py-3 px-4">
                  {editMode === "profile" ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    student.dateOfBirth
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium text-gray-700">Gender</td>
                <td className="py-3 px-4">
                  {editMode === "profile" ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    student.gender
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium text-gray-700">ID Card</td>
                <td className="py-3 px-4">
                  {editMode === "profile" ? (
                    <input
                      type="text"
                      name="idCard"
                      value={formData.idCard || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    student.idCard
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium text-gray-700">Address</td>
                <td className="py-3 px-4">
                  {editMode === "profile" ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    student.address
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium text-gray-700">Phone Number</td>
                <td className="py-3 px-4">
                  {editMode === "profile" ? (
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    student.phoneNumber
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium text-gray-700">Email</td>
                <td className="py-3 px-4">
                  {editMode === "profile" ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    student.email
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium text-gray-700">Date of Issue</td>
                <td className="py-3 px-4">
                  {editMode === "profile" ? (
                    <input
                      type="date"
                      name="dateOfIssue"
                      value={formData.dateOfIssue || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    student.dateOfIssue
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">Place of Issue</td>
                <td className="py-3 px-4">
                  {editMode === "profile" ? (
                    <input
                      type="text"
                      name="placeOfIssue"
                      value={formData.placeOfIssue || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    student.placeOfIssue
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Academic Information */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-700">Academic Information</h2>
          {editMode === "academic" ? (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditMode("academic")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Edit Academic
            </button>
          )}
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium text-gray-700 w-1/4">ID</td>
                <td className="py-3 px-4">
                  {editMode === "academic" ? (
                    <input
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    student.studentId
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium text-gray-700">Member Code</td>
                <td className="py-3 px-4">
                  {editMode === "academic" ? (
                    <input
                      type="text"
                      name="memberCode"
                      value={formData.memberCode || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    student.memberCode
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium text-gray-700">Mode</td>
                <td className="py-3 px-4">
                  {editMode === "academic" ? (
                    <input
                      type="text"
                      name="mode"
                      value={formData.mode || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    student.mode
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium text-gray-700">Status</td>
                <td className="py-3 px-4">
                  {editMode === "academic" ? (
                    <select
                      name="status"
                      value={formData.status || "Active"}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Graduated">Graduated</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  ) : (
                    student.status
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium text-gray-700">Current Term No</td>
                <td className="py-3 px-4">
                  {editMode === "academic" ? (
                    <input
                      type="number"
                      name="currentTermNo"
                      value={formData.currentTermNo || 0}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    student.currentTermNo
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">Major</td>
                <td className="py-3 px-4">
                  {editMode === "academic" ? (
                    <input
                      type="text"
                      name="major"
                      value={formData.major || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    student.major
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Parent Information */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-700">Parent Information</h2>
          {editMode === "parent" ? (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditMode("parent")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Edit Parent Info
            </button>
          )}
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium text-gray-700 w-1/4">Father's Name</td>
                <td className="py-3 px-4">
                  {editMode === "parent" ? (
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    student.fatherName
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium text-gray-700">Father's Phone</td>
                <td className="py-3 px-4">
                  {editMode === "parent" ? (
                    <input
                      type="text"
                      name="fatherPhone"
                      value={formData.fatherPhone || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    student.fatherPhone
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium text-gray-700">Father's Job</td>
                <td className="py-3 px-4">
                  {editMode === "parent" ? (
                    <input
                      type="text"
                      name="fatherJob"
                      value={formData.fatherJob || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    student.fatherJob
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium text-gray-700">Mother's Name</td>
                <td className="py-3 px-4">
                  {editMode === "parent" ? (
                    <input
                      type="text"
                      name="motherName"
                      value={formData.motherName || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    student.motherName
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium text-gray-700">Mother's Phone</td>
                <td className="py-3 px-4">
                  {editMode === "parent" ? (
                    <input
                      type="text"
                      name="motherPhone"
                      value={formData.motherPhone || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    student.motherPhone
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">Mother's Job</td>
                <td className="py-3 px-4">
                  {editMode === "parent" ? (
                    <input
                      type="text"
                      name="motherJob"
                      value={formData.motherJob || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    student.motherJob
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
