"use client"

import React, { useEffect, useState } from "react"
import { StudentRow } from "../StudentRow/page"
import { fetchStudents, Student as ApiStudent, createStudent, CreateStudentPayload } from "../../../services/studentApi"

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

  useEffect(() => {
    setLoading(true)
    fetchStudents(page, 10)
      .then((res) => {
        setStudents(res.data)
        setTotalPage(res.totalPage)
        setLoading(false)
      })
      .catch(() => {
        setError("Không thể tải danh sách sinh viên")
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
      setFormError("Student code phải đúng 8 ký tự chữ và số!")
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
      setFormError("Thêm sinh viên thất bại!")
    }
    setSubmitting(false)
  }

  if (loading) return <div>Đang tải danh sách sinh viên...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Student Management System</h1>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              onClick={() => setShowForm((v) => !v)}
            >
              {showForm ? "Đóng" : "Thêm sinh viên"}
            </button>
          </div>
          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border">
              <div className="md:col-span-1 flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã sinh viên</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                  <option value="Other">Khác</option>
                </select>
              </div>
              <div className="md:col-span-1 flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
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
                  {submitting ? "Đang thêm..." : "Thêm sinh viên"}
                </button>
              </div>
            </form>
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
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <StudentRow
                    key={student._id}
                    student={{
                      id: student._id,
                      fullName: `${student.firstName} ${student.lastName}`,
                      studentId: student.studentCode,
                      gender: student.gender as any,
                      email: student.email,
                      password: student.password || "",
                      subjects: [],
                      scores: {},
                      attendance: {},
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>
          {students.length === 0 && (
            <div className="text-center py-8 text-gray-500">Không có sinh viên nào.</div>
          )}
          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-medium disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Trang trước
            </button>
            <span className="mx-2 text-gray-800">Trang {page} / {totalPage}</span>
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-medium disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
              disabled={page === totalPage}
            >
              Trang sau
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

