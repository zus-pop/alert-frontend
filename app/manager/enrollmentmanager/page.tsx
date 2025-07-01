"use client";
import React, { useEffect, useState, useMemo } from "react";
import { fetchEnrollments, Enrollment, createEnrollment, updateEnrollment, deleteEnrollment } from "../../../services/enrollmentApi";
import { fetchSubjects, Subject } from "../../../services/subjectApi";
import { fetchCourses, Course } from "../../../services/courseApi";
import { fetchAttendances, Attendance, updateAttendance } from "../../../services/attendanceApi";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../../components/ui/accordion";
import { Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { useToast } from "../../../hooks/use-toast";
import { EnrollmentInput, GradeInput } from "../../../services/enrollmentApi";
import { fetchStudents, Student } from "../../../services/studentApi";

interface EnrollmentFormProps {
  onSubmit: (data: EnrollmentInput) => void;
  onCancel: () => void;
  courses: Course[];
  students: any[]; // Nếu có type Student thì dùng Student[]
  subjectMap: { [id: string]: Subject };
  initialData?: EnrollmentInput;
}

function EnrollmentForm({ onSubmit, onCancel, courses, students, subjectMap, initialData }: EnrollmentFormProps) {
  const [form, setForm] = useState<EnrollmentInput>(
    initialData || { courseId: "", studentId: "", grade: [] }
  );

  const addGrade = () => setForm((f: EnrollmentInput) => ({
    ...f,
    grade: [...f.grade, { type: "", score: 0, weight: 0 }]
  }));

  const removeGrade = (idx: number) => setForm((f: EnrollmentInput) => ({
    ...f,
    grade: f.grade.filter((_: GradeInput, i: number) => i !== idx)
  }));

  const updateGrade = (idx: number, key: keyof GradeInput, value: any) => setForm((f: EnrollmentInput) => ({
    ...f,
    grade: f.grade.map((g: GradeInput, i: number) => i === idx ? { ...g, [key]: value } : g)
  }));

  // Tạo danh sách subjectCode cho gợi ý
  const subjectCodeOptions = courses.map(c => {
    const subjectId = typeof c.subjectId === "string" ? c.subjectId : c.subjectId?._id;
    return {
      value: c._id,
      label: subjectMap[subjectId]?.subjectCode || c._id
    };
  });

  // Tạo danh sách student cho gợi ý
  const studentOptions = students.map(s => ({
    value: s._id,
    label: `${s._id} - ${s.lastName} ${s.firstName}${s.email ? ` (${s.email})` : ""}`
  }));

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-4"
    >
      <div>
        <label>Subject Code (courseId)</label>
        <input
          type="text"
          value={form.courseId}
          onChange={e => setForm(f => ({ ...f, courseId: e.target.value }))}
          required
          className="border px-2 py-1 w-full"
          list="courseId-list"
          placeholder="Nhập hoặc chọn subject code"
        />
        <datalist id="courseId-list">
          {subjectCodeOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </datalist>
      </div>
      <div>
        <label>Student ID</label>
        <input
          type="text"
          value={form.studentId}
          onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))}
          required
          className="border px-2 py-1 w-full"
          list="studentId-list"
          placeholder="Nhập hoặc chọn student ID"
        />
        <datalist id="studentId-list">
          {studentOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </datalist>
      </div>
      <div>
        <label>Grade</label>
        {form.grade.map((g, idx) => (
          <div key={idx} className="flex gap-2 items-center mb-2">
            <input
              type="text"
              placeholder="Type"
              value={g.type}
              onChange={e => updateGrade(idx, "type", e.target.value)}
              className="border px-2 py-1"
            />
            <input
              type="number"
              placeholder="Score"
              value={g.score}
              onChange={e => updateGrade(idx, "score", Number(e.target.value))}
              className="border px-2 py-1 w-20"
            />
            <input
              type="number"
              placeholder="Weight"
              value={g.weight}
              onChange={e => updateGrade(idx, "weight", Number(e.target.value))}
              className="border px-2 py-1 w-20"
            />
            <button type="button" onClick={() => removeGrade(idx)} className="text-red-500">X</button>
          </div>
        ))}
        <button type="button" onClick={addGrade} className="text-blue-600 mt-2">+ Thêm grade</button>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Lưu</button>
        <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={onCancel}>Hủy</button>
      </div>
    </form>
  );
}

export default function EnrollmentManagerPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [attLoading, setAttLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<{id: string, name: string, enrolls: Enrollment[]} | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(null);
  const [students, setStudents] = useState<Student[]>([]);

  const refetchAttendances = () => {
    setAttLoading(true);
    fetchAttendances(1, 2000).then(res => setAttendances(res.data)).finally(() => setAttLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchEnrollments(page, 100)
    ])
      .then(([enrollRes]) => {
        setEnrollments(enrollRes.data);
        setTotalPage(enrollRes.totalPage);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load course enrollment list");
        setLoading(false);
      });
    // Fetch subjects riêng
    fetchSubjects(1, 1000).then(res => setSubjects(res.data));
    // Fetch courses riêng
    fetchCourses().then(setCourses);
    // Fetch students
    fetchStudents(1, 1000).then(res => setStudents(res.data));
    // Fetch attendances
    refetchAttendances();
  }, [page]);

  // Group enrollments by studentId._id
  const enrollmentByStudent: { [studentId: string]: Enrollment[] } = {};
  enrollments.forEach((e) => {
    const id = e.studentId._id;
    if (!enrollmentByStudent[id]) enrollmentByStudent[id] = [];
    enrollmentByStudent[id].push(e);
  });

  // Tạo courseMap để tra cứu nhanh subjectCode
  const courseMap = useMemo(() => {
    const map: { [id: string]: Course } = {};
    courses.forEach(c => { map[c._id] = c; });
    return map;
  }, [courses]);

  // Hàm thêm enrollment
  async function handleAddEnrollment(data: EnrollmentInput) {
    try {
      await createEnrollment(data);
      toast({ title: "Thêm enrollment thành công!" });
      setShowAddModal(false);
      // Refetch lại enrollments
      fetchEnrollments(page, 100).then(res => setEnrollments(res.data));
    } catch (err) {
      toast({ title: "Thêm enrollment thất bại!", variant: "destructive" });
    }
  }
  // Hàm sửa enrollment
  async function handleEditEnrollment(id: string, data: EnrollmentInput) {
    try {
      await updateEnrollment(id, data);
      toast({ title: "Cập nhật enrollment thành công!" });
      setShowEditModal(false);
      setEditingEnrollment(null);
      fetchEnrollments(page, 100).then(res => setEnrollments(res.data));
    } catch (err) {
      toast({ title: "Cập nhật enrollment thất bại!", variant: "destructive" });
    }
  }
  // Hàm xóa enrollment
  async function handleDeleteEnrollment(id: string) {
    if (!window.confirm("Bạn có chắc muốn xóa enrollment này?")) return;
    try {
      await deleteEnrollment(id);
      toast({ title: "Xóa enrollment thành công!" });
      fetchEnrollments(page, 100).then(res => setEnrollments(res.data));
    } catch (err) {
      toast({ title: "Xóa enrollment thất bại!", variant: "destructive" });
    }
  }

  // Ở ngoài EnrollmentForm, tạo subjectMap và truyền vào
  const subjectMap = useMemo(() => {
    const map: { [id: string]: Subject } = {};
    subjects.forEach(s => { map[s._id] = s; });
    return map;
  }, [subjects]);

  if (loading) return <div>Loading course enrollment list...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Nút thêm enrollment ở đầu */}
        <div className="flex justify-end mb-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setShowAddModal(true)}>
            Thêm Enrollment
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Course Enrollment Management</h1>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Full Name</th>
                  <th className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">Student Code</th>
                  <th className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">Enrollments This Semester</th>
                  <th className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(enrollmentByStudent).map(([studentId, enrolls]) => {
                  const student = enrolls[0].studentId;
                  return (
                    <tr key={studentId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="border border-gray-100 px-4 py-3 text-gray-800">
                        <div className="flex items-center gap-2">
                          {student.image && (
                            <img src={student.image} alt="avatar" className="w-8 h-8 rounded-full object-cover border" />
                          )}
                          <div>
                            <div className="font-semibold">{student.lastName} {student.firstName}</div>
                            <div className="text-xs text-gray-500">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-100 px-4 py-3 text-center text-gray-800">{/* studentCode nếu có */}</td>
                      <td className="border border-gray-100 px-4 py-3 text-center text-gray-800">{enrolls.length}</td>
                      <td className="border border-gray-100 px-4 py-3 text-center">
                        <button
                          className="text-blue-600 hover:text-blue-800 p-2"
                          title="View details"
                          onClick={() => setSelectedStudent({id: studentId, name: student.lastName + ' ' + student.firstName, enrolls})}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {Object.keys(enrollmentByStudent).length === 0 && (
                  <tr><td colSpan={4} className="text-center py-8 text-gray-500">No enrollments found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Modal xem chi tiết đăng ký */}
          <Dialog open={!!selectedStudent} onOpenChange={open => { if (!open) setSelectedStudent(null); }}>
            <DialogContent className="max-w-6xl w-full bg-white rounded-lg shadow-xl">
              <DialogHeader>
                <DialogTitle>Enrollment details for {selectedStudent?.name}</DialogTitle>
              </DialogHeader>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse mt-2 min-w-[900px]">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Subject Code</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Enrollment Date</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Grade</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Attendance</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStudent?.enrolls.map((enrollment) => {
                      const attendanceOfEnrollment = attendances.filter(
                        att => att.enrollmentId === enrollment._id
                      );
                      const attendedCount = attendanceOfEnrollment.filter(att => att.status !== "NOT YET").length;
                      const totalCount = attendanceOfEnrollment.length;
                      return (
                        <tr key={enrollment._id} className="hover:bg-gray-50">
                          <td className="border border-gray-100 px-4 py-3 text-gray-800">
                            {
                              (() => {
                                const course = courseMap[enrollment.courseId];
                                if (!course) return enrollment.courseId;
                                const subjectId = typeof course.subjectId === "string" ? course.subjectId : course.subjectId?._id;
                                return subjectMap[subjectId]?.subjectCode || subjectId || enrollment.courseId;
                              })()
                            }
                          </td>
                          <td className="border border-gray-100 px-4 py-3 text-gray-800">{enrollment.enrollmentDate ? new Date(enrollment.enrollmentDate).toLocaleDateString() : ""}</td>
                          <td className="border border-gray-100 px-4 py-3 text-gray-800">
                            {enrollment.status === "IN PROGRESS" && (
                              <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-xs">
                                IN PROGRESS
                              </span>
                            )}
                            {enrollment.status === "PASSED" && (
                              <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 font-semibold text-xs">
                                PASSED
                              </span>
                            )}
                            {enrollment.status === "NOT PASSED" && (
                              <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 font-semibold text-xs">
                                NOT PASSED
                              </span>
                            )}
                          </td>
                          <td className="border border-gray-100 px-4 py-3 text-gray-800">
                            <ul>
                              {enrollment.grade.map((g, idx) => (
                                <li key={idx}>
                                  <span className="font-medium">{g.type}:</span> {g.score !== null ? g.score : "-"} (weight {g.weight})
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="border border-gray-100 px-4 py-3 text-gray-800">
                            <details>
                              <summary>
                                {attendedCount}/{totalCount}
                              </summary>
                              <div className="max-h-96 overflow-y-auto mt-2">
                                <table className="text-xs border w-full">
                                  <thead>
                                    <tr>
                                      <th className="border px-2 py-1">Session</th>
                                      <th className="border px-2 py-1">Status</th>
                                      <th className="border px-2 py-1">Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(() => {
                                      // Luôn sort lại attendance theo createdAt tăng dần trước khi render
                                      const sortedAttendance = [...attendanceOfEnrollment].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                                      return sortedAttendance.map((att, idx) => (
                                        <tr key={att._id} className="hover:bg-gray-50">
                                          <td className="border px-2 py-1">{idx + 1}</td>
                                          <td className="border px-2 py-1">
                                            {att.status === "ATTENDED" && (
                                              <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 font-semibold text-xs">ATTENDED</span>
                                            )}
                                            {att.status === "ABSENT" && (
                                              <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 font-semibold text-xs">ABSENT</span>
                                            )}
                                            {att.status === "NOT YET" && (
                                              <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-xs">NOT YET</span>
                                            )}
                                          </td>
                                          <td className="border px-2 py-1">
                                            <div className="flex gap-2">
                                              {att.status === "NOT YET" && (
                                                <>
                                                  <button
                                                    className="px-2 py-1 rounded text-xs bg-red-500 text-white flex items-center"
                                                    disabled={updatingId === att._id}
                                                    title="Đánh dấu vắng"
                                                    onClick={async () => {
                                                      setUpdatingId(att._id);
                                                      await updateAttendance(att._id, { status: "ABSENT" });
                                                      await refetchAttendances();
                                                      setUpdatingId(null);
                                                    }}
                                                  >
                                                    <span className="font-bold">✗</span>
                                                  </button>
                                                  <button
                                                    className="px-2 py-1 rounded text-xs bg-green-500 text-white flex items-center"
                                                    disabled={updatingId === att._id}
                                                    title="Điểm danh"
                                                    onClick={async () => {
                                                      setUpdatingId(att._id);
                                                      await updateAttendance(att._id, { status: "ATTENDED" });
                                                      await refetchAttendances();
                                                      setUpdatingId(null);
                                                    }}
                                                  >
                                                    <span className="font-bold">✓</span>
                                                  </button>
                                                </>
                                              )}
                                              {att.status === "ATTENDED" && (
                                                <button
                                                  className="px-2 py-1 rounded text-xs bg-red-500 text-white flex items-center"
                                                  disabled={updatingId === att._id}
                                                  title="Đánh dấu vắng"
                                                  onClick={async () => {
                                                    setUpdatingId(att._id);
                                                    await updateAttendance(att._id, { status: "ABSENT" });
                                                    await refetchAttendances();
                                                    setUpdatingId(null);
                                                  }}
                                                >
                                                  <span className="font-bold">✗</span>
                                                </button>
                                              )}
                                              {att.status === "ABSENT" && (
                                                <button
                                                  className="px-2 py-1 rounded text-xs bg-green-500 text-white flex items-center"
                                                  disabled={updatingId === att._id}
                                                  title="Điểm danh"
                                                  onClick={async () => {
                                                    setUpdatingId(att._id);
                                                    await updateAttendance(att._id, { status: "ATTENDED" });
                                                    await refetchAttendances();
                                                    setUpdatingId(null);
                                                  }}
                                                >
                                                  <span className="font-bold">✓</span>
                                                </button>
                                              )}
                                            </div>
                                          </td>
                                        </tr>
                                      ));
                                    })()}
                                  </tbody>
                                </table>
                              </div>
                            </details>
                          </td>
                          <td className="border border-gray-100 px-4 py-3 text-gray-800">
                            <div className="flex gap-2">
                              <button
                                className="text-blue-600 hover:underline mr-2"
                                onClick={() => {
                                  setEditingEnrollment(enrollment);
                                  setShowEditModal(true);
                                }}
                              >
                                Sửa
                              </button>
                              <button
                                className="text-red-600 hover:underline"
                                onClick={() => handleDeleteEnrollment(enrollment._id)}
                              >
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </DialogContent>
          </Dialog>
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
          {/* Modal thêm enrollment */}
          {showAddModal && (
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm Enrollment</DialogTitle>
                </DialogHeader>
                <EnrollmentForm
                  onSubmit={handleAddEnrollment}
                  onCancel={() => setShowAddModal(false)}
                  courses={courses}
                  students={students}
                  subjectMap={subjectMap}
                />
              </DialogContent>
            </Dialog>
          )}
          {/* Modal sửa enrollment */}
          {showEditModal && editingEnrollment && (
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sửa Enrollment</DialogTitle>
                </DialogHeader>
                <EnrollmentForm
                  initialData={{
                    courseId: editingEnrollment.courseId,
                    studentId: editingEnrollment.studentId._id,
                    grade: editingEnrollment.grade as GradeInput[],
                  }}
                  onSubmit={data => handleEditEnrollment(editingEnrollment._id, data)}
                  onCancel={() => setShowEditModal(false)}
                  courses={courses}
                  students={students}
                  subjectMap={subjectMap}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
} 