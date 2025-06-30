"use client";
import React, { useEffect, useState } from "react";
import { fetchSubjects, Subject, createSubject, updateSubject, deleteSubject } from "../../../services/subjectApi";
import { Pencil, Trash } from "lucide-react";

export default function SubjectManagerPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subjectCode: "", subjectName: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editForm, setEditForm] = useState({ subjectCode: "", subjectName: "" });
  const [editError, setEditError] = useState<string | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchSubjects(page, 10)
      .then((res) => {
        setSubjects(res.data);
        setTotalPage(res.totalPage);
        setLoading(false);
      })
      .catch(() => {
        setError("Không thể tải danh sách môn học");
        setLoading(false);
      });
  }, [page]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.subjectCode.trim() || !form.subjectName.trim()) {
      setFormError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    setSubmitting(true);
    try {
      await createSubject(form);
      setShowForm(false);
      setForm({ subjectCode: "", subjectName: "" });
      setLoading(true);
      fetchSubjects(page, 10).then((res) => {
        setSubjects(res.data);
        setTotalPage(res.totalPage);
        setLoading(false);
      });
    } catch (err) {
      setFormError("Thêm môn học thất bại!");
    }
    setSubmitting(false);
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setEditForm({ subjectCode: subject.subjectCode, subjectName: subject.subjectName });
    setEditError(null);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);
    if (!editForm.subjectCode.trim() || !editForm.subjectName.trim()) {
      setEditError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    setEditSubmitting(true);
    try {
      await updateSubject(editingSubject?._id!, editForm);
      setEditingSubject(null);
      setEditSubmitting(false);
      setLoading(true);
      fetchSubjects(page, 10).then((res) => {
        setSubjects(res.data);
        setTotalPage(res.totalPage);
        setLoading(false);
      });
    } catch (err) {
      setEditError("Cập nhật môn học thất bại!");
      setEditSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa môn học này?")) return;
    try {
      await deleteSubject(id);
      setLoading(true);
      fetchSubjects(page, 10).then((res) => {
        setSubjects(res.data);
        setTotalPage(res.totalPage);
        setLoading(false);
      });
    } catch (err) {
      alert("Xóa môn học thất bại!");
    }
  };

  if (loading) return <div>Đang tải danh sách môn học...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Quản lý môn học</h1>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              onClick={() => setShowForm((v) => !v)}
            >
              {showForm ? "Đóng" : "Thêm môn học"}
            </button>
          </div>
          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border">
              <div className="md:col-span-1 flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã môn học</label>
                <input
                  type="text"
                  name="subjectCode"
                  value={form.subjectCode}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="md:col-span-1 flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên môn học</label>
                <input
                  type="text"
                  name="subjectName"
                  value={form.subjectName}
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
                  {submitting ? "Đang thêm..." : "Thêm môn học"}
                </button>
              </div>
            </form>
          )}
          {editingSubject && (
            <form onSubmit={handleEditSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-yellow-50 p-4 rounded-lg border border-yellow-300">
              <div className="md:col-span-2 text-lg font-semibold text-yellow-800 mb-2">Chỉnh sửa môn học</div>
              <div className="md:col-span-1 flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã môn học</label>
                <input
                  type="text"
                  name="subjectCode"
                  value={editForm.subjectCode}
                  onChange={handleEditInputChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="md:col-span-1 flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên môn học</label>
                <input
                  type="text"
                  name="subjectName"
                  value={editForm.subjectName}
                  onChange={handleEditInputChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              {editError && <div className="md:col-span-2 text-red-600 text-sm">{editError}</div>}
              <div className="md:col-span-2 flex justify-end gap-2">
                <button
                  type="button"
                  className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-medium"
                  onClick={() => setEditingSubject(null)}
                  disabled={editSubmitting}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium"
                  disabled={editSubmitting}
                >
                  {editSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          )}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Mã môn học</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Tên môn học</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Ngày tạo</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Ngày cập nhật</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 text-gray-800">{subject.subjectCode}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-800">{subject.subjectName}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-800">{subject.createdAt ? new Date(subject.createdAt).toLocaleString() : ""}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-800">{subject.updatedAt ? new Date(subject.updatedAt).toLocaleString() : ""}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-800">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(subject)}
                          className="p-2 rounded hover:bg-yellow-100 transition-colors"
                          title="Sửa môn học"
                        >
                          <Pencil className="w-5 h-5 text-yellow-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(subject._id)}
                          className="p-2 rounded hover:bg-red-100 transition-colors"
                          title="Xóa môn học"
                        >
                          <Trash className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {subjects.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-8 text-gray-500">Không có môn học nào.</td></tr>
                )}
              </tbody>
            </table>
          </div>
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
  );
} 