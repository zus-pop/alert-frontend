"use client";
import React, { useEffect, useState } from "react";
import { fetchCourses } from "../../../services/courseApi";
import { fetchSubjects, Subject } from "../../../services/subjectApi";
import { getSemesters, Semester } from "../../../services/semesterApi";
import { api } from "../../../services/api";
import { Pencil, Trash, Plus, X, Upload, Save } from "lucide-react";

export default function CourseManagerPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  // Cập nhật state form để có titleInput và title cho từng subject
  const [form, setForm] = useState({
    semesterId: "",
    subjectInput: "",
    titleInput: "",
    imageInput: null as File | null,
    imageInputUrl: "",
    subjects: [] as { subjectId: string, title: string, image: File | null, imageUrl: string, subjectCode: string, subjectName: string }[]
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({ subjectId: "", semesterId: "", image: null as File | null });
  const [editError, setEditError] = useState<string | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [filterSemester, setFilterSemester] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get("/courses?limit=1000").then(res => res.data.data),
      fetchSubjects(1, 1000).then(res => res.data),
      getSemesters({ page: 1, limit: 1000 }).then(res => res.data),
    ])
      .then(([courses, subjects, semesters]) => {
        setCourses(courses);
        setSubjects(subjects);
        setSemesters(semesters);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load course list");
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, files } = e.target as any;
    if (name === "imageInput") {
      const file = files[0];
      setForm(f => ({
        ...f,
        imageInput: file,
        imageInputUrl: file ? URL.createObjectURL(file) : ""
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAddSubject = () => {
    if (!form.subjectInput || !form.titleInput || !form.imageInput) return;
    const subjectObj = subjects.find(s => s._id === form.subjectInput);
    if (!subjectObj) return;
    if (form.subjects.some(s => s.subjectId === form.subjectInput && s.title === form.titleInput)) return; // No duplicate
    setForm(f => ({
      ...f,
      subjects: [
        ...f.subjects,
        {
          subjectId: form.subjectInput,
          title: form.titleInput,
          image: form.imageInput,
          imageUrl: form.imageInputUrl,
          subjectCode: subjectObj.subjectCode,
          subjectName: subjectObj.subjectName
        }
      ],
      subjectInput: "",
      titleInput: "",
      imageInput: null,
      imageInputUrl: ""
    }));
  };

  const handleRemoveSubject = (subjectId: string) => {
    setForm(f => ({ ...f, subjects: f.subjects.filter(s => s.subjectId !== subjectId) }));
  };

  const handleSubjectImageChange = (subjectId: string, file: File | null) => {
    setForm(f => ({
      ...f,
      subjects: f.subjects.map(s =>
        s.subjectId === subjectId
          ? { ...s, image: file, imageUrl: file ? URL.createObjectURL(file) : "" }
          : s
      )
    }));
  };

  // 1. Khi chọn đủ các trường (titleInput, subjectInput, semesterId, imageInput), cho phép bấm Save ngay mà không cần phải ấn dấu +
  // 2. Nút + chỉ dùng để thêm nhiều course vào 1 kỳ (giữ nguyên logic add vào danh sách subjects)
  // 3. Nếu chỉ muốn tạo 1 course, khi bấm Save sẽ tự động lấy thông tin từ các trường input hiện tại (nếu chưa add vào danh sách subjects) và submit luôn

  // Sửa handleSubmit để nếu form.subjects.length === 0, sẽ lấy thông tin từ các trường input hiện tại và submit như 1 course
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    let subjectsToSubmit = form.subjects;
    // Nếu chưa add vào danh sách, nhưng đã điền đủ các trường, thì submit luôn
    if (subjectsToSubmit.length === 0 && form.titleInput && form.subjectInput && form.semesterId && form.imageInput) {
      const subjectObj = subjects.find(s => s._id === form.subjectInput);
      if (subjectObj) {
        subjectsToSubmit = [{
          subjectId: form.subjectInput,
          title: form.titleInput,
          image: form.imageInput,
          imageUrl: form.imageInputUrl,
          subjectCode: subjectObj.subjectCode,
          subjectName: subjectObj.subjectName
        }];
      }
    }
    if (!form.semesterId || subjectsToSubmit.length === 0) {
      setFormError("Please select a semester and fill all fields!");
      return;
    }
    if (subjectsToSubmit.some(s => !s.image || !s.title)) {
      setFormError("Each course must have a title and image!");
      return;
    }
    setSubmitting(true);
    try {
      await Promise.all(subjectsToSubmit.map((s) => {
        const formData = new FormData();
        formData.append("title", s.title);
        formData.append("subjectId", s.subjectId);
        formData.append("semesterId", form.semesterId);
        if (s.image) formData.append("image", s.image);
        return api.post("/courses", formData, { headers: { "Content-Type": "multipart/form-data" } });
      }));
      setShowForm(false);
      setForm({ semesterId: "", subjectInput: "", titleInput: "", imageInput: null, imageInputUrl: "", subjects: [] });
      setLoading(true);
      api.get("/courses?limit=1000").then(res => setCourses(res.data.data)).finally(() => setLoading(false));
    } catch (err) {
      setFormError("Failed to add courses!");
    }
    setSubmitting(false);
  };

  const handleEdit = (course: any) => {
    setEditingCourse(course);
    setEditForm({
      subjectId: course.subjectId._id,
      semesterId: course.semesterId._id,
      image: null,
    });
    setEditError(null);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, files } = e.target as any;
    if (name === "image") {
      setEditForm({ ...editForm, image: files[0] });
    } else {
      setEditForm({ ...editForm, [name]: value });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);
    if (!editForm.subjectId || !editForm.semesterId) {
      setEditError("Please select all information!");
      return;
    }
    setEditSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("subjectId", editForm.subjectId);
      formData.append("semesterId", editForm.semesterId);
      if (editForm.image) formData.append("image", editForm.image);
      await api.patch(`/courses/${editingCourse._id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      setEditingCourse(null);
      setEditSubmitting(false);
      setLoading(true);
      api.get("/courses?limit=1000").then(res => setCourses(res.data.data)).finally(() => setLoading(false));
    } catch (err) {
      setEditError("Failed to update course!");
      setEditSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await api.delete(`/courses/${id}`);
      setLoading(true);
      api.get("/courses?limit=1000").then(res => setCourses(res.data.data)).finally(() => setLoading(false));
    } catch (err) {
      alert("Failed to delete course!");
    }
  };

  if (loading) return <div>Loading course list...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-gray-800">Course Management</h1>
            <div className="flex gap-4 items-center">
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg min-w-[180px]"
                value={filterSemester}
                onChange={e => setFilterSemester(e.target.value)}
              >
                <option value="">All semesters</option>
                {semesters.map(s => (
                  <option key={s._id} value={s._id}>{s.semesterName}</option>
                ))}
              </select>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                onClick={() => setShowForm((v) => !v)}
              >
                {showForm ? "Close" : "Add Course"}
              </button>
            </div>
          </div>
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-2xl relative">
                <button onClick={() => setShowForm(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"><X className="w-6 h-6" /></button>
                <h2 className="text-3xl font-bold mb-6 text-center">Add Courses</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-1">Semester</label>
                    <select
                      name="semesterId"
                      value={form.semesterId}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-lg w-full"
                      required
                    >
                      <option value="">Select semester</option>
                      {semesters.map(s => (
                        <option key={s._id} value={s._id}>{s.semesterName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-base font-medium text-gray-700 mb-1">Course Title</label>
                    <input
                      type="text"
                      name="titleInput"
                      value={form.titleInput || ""}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-lg w-full"
                      placeholder="Enter course title"
                      required
                    />
                  </div>
                  <div className="flex gap-4 items-end flex-row w-full">
                    <div className="flex-1">
                      <label className="block text-base font-medium text-gray-700 mb-1">Subject</label>
                      <select
                        name="subjectInput"
                        value={form.subjectInput}
                        onChange={handleInputChange}
                        className="px-3 py-2 border border-gray-300 rounded-lg w-full"
                      >
                        <option value="">Select subject</option>
                        {subjects.map(s => (
                          <option key={s._id} value={s._id}>{s.subjectCode} - {s.subjectName}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-2 justify-end mt-6">
                        {form.imageInputUrl && (
                          <div className="w-28 h-16 rounded-lg border overflow-hidden bg-gray-100 flex items-center justify-center">
                            <img src={form.imageInputUrl} alt="preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <label className="flex items-center justify-center cursor-pointer w-8 h-8 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 ml-2" title="Upload image">
                          <Upload className="w-4 h-4 text-blue-600" />
                          <input
                            type="file"
                            name="imageInput"
                            accept="image/*"
                            onChange={handleInputChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="bg-blue-600 hover:bg-blue-700 text-white w-8 h-8 rounded-lg flex items-center justify-center"
                      onClick={handleAddSubject}
                      disabled={!form.subjectInput || !form.titleInput || !form.imageInput}
                      title="Add subject"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {/* List of added subjects */}
                  {form.subjects.length > 0 && (
                    <div className="space-y-2">
                      {form.subjects.map((s) => (
                        <div key={s.subjectId} className="flex items-center border rounded-lg p-2 bg-gray-50 gap-4 min-h-[56px]">
                          <div className="flex-1 flex items-center h-12">
                            <div className="font-medium text-center truncate w-full">{s.title} ({s.subjectCode} - {s.subjectName})</div>
                          </div>
                          <div className="flex-1 flex items-center justify-center h-12">
                            {s.imageUrl && (
                              <div className="w-20 h-12 rounded-lg border overflow-hidden bg-gray-100 flex items-center justify-center">
                                <img src={s.imageUrl} alt="preview" className="w-full h-full object-cover" />
                              </div>
                            )}
                            <label className="flex items-center justify-center cursor-pointer w-8 h-8 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 ml-2" title="Upload image">
                              <Upload className="w-4 h-4 text-blue-600" />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={e => handleSubjectImageChange(s.subjectId, e.target.files?.[0] || null)}
                                className="hidden"
                              />
                            </label>
                          </div>
                          <div className="flex items-center justify-center h-12">
                            <button
                              type="button"
                              className="ml-2 p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center"
                              onClick={() => handleRemoveSubject(s.subjectId)}
                              title="Remove subject"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {formError && <div className="text-red-600 text-sm">{formError}</div>}
                  <div className="flex justify-end gap-2">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white w-8 h-8 rounded-lg flex items-center justify-center"
                      disabled={submitting}
                      title="Save courses"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {editingCourse && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
              <form onSubmit={handleEditSubmit} className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-xl relative border-2 border-yellow-200 animate-fade-in">
                <button type="button" onClick={() => setEditingCourse(null)} className="absolute top-4 right-4 text-gray-400 hover:text-yellow-600 text-3xl font-bold">×</button>
                <h2 className="text-2xl font-bold text-center mb-8 text-yellow-700 tracking-wide">Edit Course</h2>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col">
                    <label className="block text-base font-semibold text-gray-700 mb-2">Subject</label>
                    <select
                      name="subjectId"
                      value={editForm.subjectId}
                      onChange={handleEditInputChange}
                      className="px-4 py-3 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-yellow-400"
                      required
                    >
                      <option value="">Select subject</option>
                      {subjects.map(s => (
                        <option key={s._id} value={s._id}>{s.subjectCode} - {s.subjectName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-base font-semibold text-gray-700 mb-2">Semester</label>
                    <select
                      name="semesterId"
                      value={editForm.semesterId}
                      onChange={handleEditInputChange}
                      className="px-4 py-3 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-yellow-400"
                      required
                    >
                      <option value="">Select semester</option>
                      {semesters.map(s => (
                        <option key={s._id} value={s._id}>{s.semesterName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-base font-semibold text-gray-700 mb-2">Image</label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleEditInputChange}
                      className="px-4 py-3 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  {editError && <div className="text-red-600 text-base text-center font-semibold mt-2">{editError}</div>}
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-xl font-bold text-lg"
                      onClick={() => setEditingCourse(null)}
                      disabled={editSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg transition-all duration-200"
                      disabled={editSubmitting}
                    >
                      {editSubmitting ? "Saving..." : "Save changes"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
          {/* Thay thế bảng bằng grid card */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses
              .filter(c => !filterSemester || c.semesterId?._id === filterSemester)
              .slice((page-1)*pageSize, page*pageSize)
              .map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-2xl shadow p-4 flex flex-col transition-transform duration-200 hover:scale-105 hover:shadow-xl hover:bg-blue-50 cursor-pointer"
              >
                {course.image && (
                  <img
                    src={course.image}
                    alt="course"
                    className="w-full h-32 object-cover rounded-xl mb-3 border"
                  />
                )}
                <div className="flex-1">
                  <div className="font-bold text-lg text-blue-700">
                    {course.title || course.subjectId?.subjectCode}
                  </div>
                  <div className="text-gray-800 mb-1">
                    {course.subjectId?.subjectCode} - {course.subjectId?.subjectName}
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Semester: {course.semesterId?.semesterName}</div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(course)}
                    className="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded font-medium"
                    title="Edit Course"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded font-medium"
                    title="Delete Course"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {courses.filter(c => !filterSemester || c.semesterId?._id === filterSemester).length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">No courses found.</div>
            )}
          </div>
          {/* Pagination */}
          {(() => {
            const filtered = courses.filter(c => !filterSemester || c.semesterId?._id === filterSemester);
            return filtered.length > pageSize && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-medium disabled:opacity-50"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span className="mx-2 text-gray-800">Page {page} / {Math.ceil(filtered.length / pageSize)}</span>
                <button
                  className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-medium disabled:opacity-50"
                  onClick={() => setPage((p) => Math.min(Math.ceil(filtered.length / pageSize), p + 1))}
                  disabled={page === Math.ceil(filtered.length / pageSize)}
                >
                  Next
                </button>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
} 