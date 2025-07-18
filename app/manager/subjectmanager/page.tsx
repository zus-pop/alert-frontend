"use client";
import React, { useEffect, useState } from "react";
import { fetchSubjects, Subject, createSubject, updateSubject, deleteSubject } from "../../../services/subjectApi";
import { Pencil, Trash } from "lucide-react";
import Select from 'react-select';

export default function SubjectManagerPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subjectCode: "", subjectName: "", prerequisite: [] as string[] });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editForm, setEditForm] = useState({ subjectCode: "", subjectName: "", prerequisite: [] as string[] });
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
        setError("Unable to load subject list");
        setLoading(false);
      });
  }, [page]);

  // Hàm handleInputChange cho input text
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.subjectCode.trim() || !form.subjectName.trim()) {
      setFormError("Please enter all required information!");
      return;
    }
    setSubmitting(true);
    try {
      await createSubject({
        subjectCode: form.subjectCode,
        subjectName: form.subjectName,
        prerequisite: form.prerequisite
      });
      setShowForm(false);
      setForm({ subjectCode: "", subjectName: "", prerequisite: [] });
      setLoading(true);
      fetchSubjects(page, 10).then((res) => {
        setSubjects(res.data);
        setTotalPage(res.totalPage);
        setLoading(false);
      });
    } catch (err) {
      setFormError("Failed to add subject!");
    }
    setSubmitting(false);
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setEditForm({
      subjectCode: subject.subjectCode,
      subjectName: subject.subjectName,
      prerequisite: (subject.prerequisite || []).map((p: any) => typeof p === 'string' ? p : p._id || p.subjectCode)
    });
    setEditError(null);
  };

  // Không cần handleEditInputChange cho prerequisite nữa

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);
    if (!editForm.subjectCode.trim() || !editForm.subjectName.trim()) {
      setEditError("Please enter all required information!");
      return;
    }
    setEditSubmitting(true);
    try {
      await updateSubject(editingSubject?._id!, {
        subjectCode: editForm.subjectCode,
        subjectName: editForm.subjectName,
        prerequisite: editForm.prerequisite
      });
      setEditingSubject(null);
      setEditSubmitting(false);
      setLoading(true);
      fetchSubjects(page, 10).then((res) => {
        setSubjects(res.data);
        setTotalPage(res.totalPage);
        setLoading(false);
      });
    } catch (err) {
      setEditError("Failed to update subject!");
      setEditSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    try {
      await deleteSubject(id);
      setLoading(true);
      fetchSubjects(page, 10).then((res) => {
        setSubjects(res.data);
        setTotalPage(res.totalPage);
        setLoading(false);
      });
    } catch (err) {
      alert("Failed to delete subject!");
    }
  };

  if (loading) return <div>Loading subject list...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Subject Management</h1>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              onClick={() => setShowForm((v) => !v)}
            >
              {showForm ? "Close" : "Add Subject"}
            </button>
          </div>
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-lg relative">
                <button type="button" onClick={() => setShowForm(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl">×</button>
                <div className="md:col-span-1 flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject Code</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                  <input
                    type="text"
                    name="subjectName"
                    value={form.subjectName}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">PreRequisite (optional)</label>
                  <Select
                    isMulti
                    name="prerequisite"
                    options={subjects.map(s => ({ value: s._id, label: s.subjectCode }))}
                    value={form.prerequisite.map(id => {
                      const subj = subjects.find(s => s._id === id);
                      return subj ? { value: subj._id, label: subj.subjectCode } : { value: id, label: id };
                    })}
                    onChange={opts => setForm(f => ({ ...f, prerequisite: opts.map((o: any) => o.value) }))}
                    classNamePrefix="react-select"
                    placeholder="Select prerequisite subjects"
                  />
                </div>
                {formError && <div className="md:col-span-2 text-red-600 text-sm">{formError}</div>}
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
                    disabled={submitting}
                  >
                    {submitting ? "Adding..." : "Add Subject"}
                  </button>
                </div>
              </form>
            </div>
          )}
          {editingSubject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <form onSubmit={handleEditSubmit} className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-lg relative border border-yellow-300">
                <button type="button" onClick={() => setEditingSubject(null)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl">×</button>
                <div className="md:col-span-2 text-lg font-semibold text-yellow-800 mb-2">Edit Subject</div>
                <div className="md:col-span-1 flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject Code</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                  <input
                    type="text"
                    name="subjectName"
                    value={editForm.subjectName}
                    onChange={handleEditInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">PreRequisite (optional)</label>
                  <Select
                    isMulti
                    name="prerequisite"
                    options={subjects.map(s => ({ value: s._id, label: s.subjectCode }))}
                    value={editForm.prerequisite.map(id => {
                      const subj = subjects.find(s => s._id === id);
                      return subj ? { value: subj._id, label: subj.subjectCode } : { value: id, label: id };
                    })}
                    onChange={opts => setEditForm(f => ({ ...f, prerequisite: opts.map((o: any) => o.value) }))}
                    classNamePrefix="react-select"
                    placeholder="Select prerequisite subjects"
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
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium"
                    disabled={editSubmitting}
                  >
                    {editSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Subject Code</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Subject Name</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">PreRequisite</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Created At</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Updated At</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 text-gray-800">{subject.subjectCode}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-800">{subject.subjectName}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-800">
                      {(subject.prerequisite && subject.prerequisite.length > 0)
                        ? subject.prerequisite.map(id => {
                            const idStr =
                              typeof id === 'string'
                                ? id
                                : (id && typeof id === 'object'
                                    ? ('subjectCode' in id
                                        ? id.subjectCode
                                        : ('_id' in id ? (id as any).id : '')
                                      )
                                    : ''
                                  );
                            const subj = subjects.find(s => s._id === idStr);
                            return subj ? subj.subjectCode : idStr;
                          }).join(', ')
                        : ''}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-800">{subject.createdAt ? new Date(subject.createdAt).toLocaleString() : ""}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-800">{subject.updatedAt ? new Date(subject.updatedAt).toLocaleString() : ""}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-800">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(subject)}
                          className="p-2 rounded hover:bg-yellow-100 transition-colors"
                          title="Edit Subject"
                        >
                          <Pencil className="w-5 h-5 text-yellow-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(subject._id)}
                          className="p-2 rounded hover:bg-red-100 transition-colors"
                          title="Delete Subject"
                        >
                          <Trash className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {subjects.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-8 text-gray-500">No subjects found.</td></tr>
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
  );
} 