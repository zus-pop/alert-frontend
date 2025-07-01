"use client";
import React, { useEffect, useState, useMemo } from "react";
import { fetchEnrollments, Enrollment } from "../../../services/enrollmentApi";
import { fetchSubjects, Subject } from "../../../services/subjectApi";
import { fetchCourses, Course } from "../../../services/courseApi";
import { fetchAttendances, Attendance, updateAttendance } from "../../../services/attendanceApi";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../../components/ui/accordion";
import { Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";

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

  // Tạo subjectMap để tra cứu nhanh subjectCode
  const subjectMap = useMemo(() => {
    const map: { [id: string]: Subject } = {};
    subjects.forEach(s => { map[s._id] = s; });
    return map;
  }, [subjects]);

  // Tạo courseMap để tra cứu nhanh subjectCode
  const courseMap = useMemo(() => {
    const map: { [id: string]: Course } = {};
    courses.forEach(c => { map[c._id] = c; });
    return map;
  }, [courses]);

  if (loading) return <div>Loading course enrollment list...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
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
                            {courseMap[enrollment.courseId]?.subjectId?.subjectCode || enrollment.courseId}
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
        </div>
      </div>
    </div>
  );
} 