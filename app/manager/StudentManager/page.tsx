"use client"

import React, { useEffect, useState } from "react"
import { StudentRow } from "../StudentRow/page"
import { fetchStudents, Student as ApiStudent, createStudent, CreateStudentPayload, updateStudent, restoreStudent, deleteStudent } from "../../../services/studentApi"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "../../../components/ui/dialog"

export default function StudentManagerPage() {
  const [students, setStudents] = useState<ApiStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<CreateStudentPayload>({
    studentCode: "",
    firstName: "",
    lastName: "",
    gender: "Male",
    email: ""
  })
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [editingStudent, setEditingStudent] = useState<ApiStudent | null>(null)
  const [editForm, setEditForm] = useState<CreateStudentPayload>({
    studentCode: "",
    firstName: "",
    lastName: "",
    gender: "Male",
    email: ""
  })
  const [editError, setEditError] = useState<string | null>(null)
  const [editSubmitting, setEditSubmitting] = useState(false)
  const [showDeleted, setShowDeleted] = useState(false)
  const [deletedStudents, setDeletedStudents] = useState<ApiStudent[]>([])

  useEffect(() => {
    setLoading(true)
    fetchStudents(page, 10)
      .then((res) => {
        setStudents(res.data)
        setTotalPage(res.totalPage)
        setLoading(false)
        // Lọc sinh viên đã xóa
        setDeletedStudents(res.data.filter((s: ApiStudent) => s.isDeleted))
      })
      .catch(() => {
        setError("Unable to load student list")
        setLoading(false)
      })
  }, [page])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    // Validate studentCode
    if (!/^[a-zA-Z0-9]{8}$/.test(form.studentCode)) {
      setFormError("Student code must be exactly 8 alphanumeric characters!")
      return
    }
    setSubmitting(true)
    try {
      // Chuyển giá trị giới tính về đúng chuẩn backend
      let genderValue = form.gender;
      if (genderValue === "Nam") genderValue = "Male";
      else if (genderValue === "Nữ") genderValue = "Female";
      else if (genderValue === "Khác") genderValue = "Other";
      await createStudent({ ...form, gender: genderValue })
      setShowForm(false)
      setForm({ studentCode: "", firstName: "", lastName: "", gender: "Male", email: "" })
      // Reload lại danh sách trang hiện tại
      setLoading(true)
      fetchStudents(page, 10).then((res) => {
        setStudents(res.data)
        setTotalPage(res.totalPage)
        setLoading(false)
      })
    } catch (err) {
      setFormError("Failed to add student!")
    }
    setSubmitting(false)
  }

  const handleEdit = (student: any) => {
    // Tìm lại object gốc từ students để lấy đúng _id theo id
    const original = students.find(s => s._id === student.id)
    if (!original) return
    setEditingStudent(original)
    setEditForm({
      studentCode: original.studentCode || "",
      firstName: original.firstName,
      lastName: original.lastName,
      gender: original.gender,
      email: original.email
    })
    setEditError(null)
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditError(null)
    if (!/^[a-zA-Z0-9]{8}$/.test(editForm.studentCode)) {
      setEditError("Student code must be exactly 8 alphanumeric characters!")
      return
    }
    setEditSubmitting(true)
    try {
      let genderValue = editForm.gender
      if (genderValue === "Nam") genderValue = "Male"
      else if (genderValue === "Nữ") genderValue = "Female"
      else if (genderValue === "Khác") genderValue = "Other"
      // Sử dụng _id từ editingStudent
      await updateStudent(editingStudent?._id!, { ...editForm, gender: genderValue })
      setEditingStudent(null)
      setEditSubmitting(false)
      setLoading(true)
      fetchStudents(page, 10).then((res) => {
        setStudents(res.data)
        setTotalPage(res.totalPage)
        setLoading(false)
      })
    } catch (err) {
      setEditError("Failed to update student!")
      setEditSubmitting(false)
    }
  }

  const handleDelete = async (studentId: string) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await deleteStudent(studentId)
      setLoading(true)
      fetchStudents(page, 10).then((res) => {
        setStudents(res.data)
        setTotalPage(res.totalPage)
        setDeletedStudents(res.data.filter((s: ApiStudent) => s.isDeleted))
        setLoading(false)
      })
    } catch (err) {
      alert("Failed to delete student!")
    }
  }

  const handleUpdateScoreOrAttendance = (studentId: string, field: "scores" | "attendance", subject: string, value: number) => {
    // Xử lý cập nhật điểm hoặc điểm danh
    console.log("Update", field, "for student", studentId, "subject", subject, "value", value)
  }

  const handleRestore = async (id: string) => {
    try {
      await restoreStudent(id)
      setLoading(true)
      fetchStudents(page, 10).then((res) => {
        setStudents(res.data)
        setTotalPage(res.totalPage)
        setDeletedStudents(res.data.filter((s: ApiStudent) => s.isDeleted))
        setLoading(false)
      })
    } catch (err) {
      alert("Failed to restore student!")
    }
  }

  if (loading) return <div>Loading student list...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Student Management</h1>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              onClick={() => setShowForm((v) => !v)}
            >
              {showForm ? "Close" : "Add Student"}
            </button>
          </div>
          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border">
              <div className="md:col-span-1 flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Code</label>
                <input
                  type="text"
                  name="studentCode"
                  value={form.studentCode}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                  maxLength={8}
                  required
                />
              </div>
              <div className="md:col-span-1 flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="md:col-span-1 flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="md:col-span-1 flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="md:col-span-2 flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              {formError && <div className="md:col-span-2 text-red-600 text-sm">{formError}</div>}
              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
                  disabled={submitting}
                >
                  {submitting ? "Adding..." : "Add Student"}
                </button>
              </div>
            </form>
          )}
          <Dialog open={!!editingStudent} onOpenChange={(open) => { if (!open) setEditingStudent(null) }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Student</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1 flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Code</label>
                  <input
                    type="text"
                    name="studentCode"
                    value={editForm.studentCode}
                    onChange={handleEditInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    maxLength={8}
                    required
                  />
                </div>
                <div className="md:col-span-1 flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={editForm.gender}
                    onChange={handleEditInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-1 flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={editForm.firstName}
                    onChange={handleEditInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="md:col-span-1 flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={editForm.lastName}
                    onChange={handleEditInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="md:col-span-2 flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                {editError && <div className="md:col-span-2 text-red-600 text-sm">{editError}</div>}
                <DialogFooter className="md:col-span-2 flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-medium"
                    onClick={() => setEditingStudent(null)}
                    disabled={editSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium"
                    disabled={editSubmitting}
                  >
                    {editSubmitting ? "Updating..." : "Update Changes"}
                  </button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <div className="flex justify-start mb-4">
            <button
              className={`px-3 py-1 rounded text-sm font-medium ${showDeleted ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-700'} mr-2`}
              onClick={() => setShowDeleted(false)}
            >
              Student List
            </button>
            <button
              className={`px-3 py-1 rounded text-sm font-medium ${showDeleted ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setShowDeleted(true)}
            >
              View Deleted Students
            </button>
          </div>
          {showDeleted ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Student Code</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Gender</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Restore</th>
                  </tr>
                </thead>
                <tbody>
                  {deletedStudents.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-8 text-gray-500">No deleted students.</td></tr>
                  )}
                  {deletedStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-gray-800">{student.firstName} {student.lastName}</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-800">{student.studentCode || ''}</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-800">{student.gender}</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-800">{student.email}</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-800">
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium"
                          onClick={() => handleRestore(student._id)}
                        >
                          Restore
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Student Code</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Gender</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <StudentRow
                      key={student._id}
                      student={{
                        id: student._id,
                        fullName: `${student.firstName} ${student.lastName}`,
                        studentId: student.studentCode || "",
                        gender: student.gender as any,
                        email: student.email,
                        password: student.password || "",
                        subjects: [],
                        scores: {},
                        attendance: {},
                      }}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onUpdateScoreOrAttendance={handleUpdateScoreOrAttendance}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {students.length === 0 && (
            <div className="text-center py-8 text-gray-500">No students found.</div>
          )}
          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-medium disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous Page
            </button>
            <span className="mx-2 text-gray-800">Page {page} / {totalPage}</span>
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-medium disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
              disabled={page === totalPage}
            >
              Next Page
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

