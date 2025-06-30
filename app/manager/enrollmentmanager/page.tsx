"use client";
import React, { useEffect, useState } from "react";
import { fetchEnrollments, Enrollment } from "../../../services/enrollmentApi";
import { fetchStudents, Student } from "../../../services/studentApi";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../../components/ui/accordion";
import { Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";

export default function EnrollmentManagerPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<{id: string, name: string, enrolls: Enrollment[]} | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchEnrollments(page, 100), // lấy nhiều để group
      fetchStudents(1, 1000)
    ])
      .then(([enrollRes, studentRes]) => {
        setEnrollments(enrollRes.data);
        setTotalPage(enrollRes.totalPage);
        setStudents(studentRes.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Không thể tải danh sách đăng ký môn học");
        setLoading(false);
      });
  }, [page]);

  // Group enrollments by studentId
  const enrollmentByStudent: { [studentId: string]: Enrollment[] } = {};
  enrollments.forEach((e) => {
    if (!enrollmentByStudent[e.studentId]) enrollmentByStudent[e.studentId] = [];
    enrollmentByStudent[e.studentId].push(e);
  });

  const getStudentInfo = (studentId: string) => {
    const student = students.find(s => s._id === studentId);
    if (!student) return { fullName: studentId, studentCode: "" };
    return { fullName: `${student.firstName} ${student.lastName}`, studentCode: student.studentCode || "" };
  };

  if (loading) return <div>Đang tải danh sách đăng ký môn học...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Quản lý đăng ký môn học</h1>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Họ và tên</th>
                  <th className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">Mã số sinh viên</th>
                  <th className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">Số đăng ký trong kỳ</th>
                  <th className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(enrollmentByStudent).map(([studentId, enrolls]) => {
                  const info = getStudentInfo(studentId);
                  return (
                    <tr key={studentId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="border border-gray-100 px-4 py-3 text-gray-800">{info.fullName}</td>
                      <td className="border border-gray-100 px-4 py-3 text-center text-gray-800">{info.studentCode}</td>
                      <td className="border border-gray-100 px-4 py-3 text-center text-gray-800">{enrolls.length}</td>
                      <td className="border border-gray-100 px-4 py-3 text-center">
                        <button
                          className="text-blue-600 hover:text-blue-800 p-2"
                          title="Xem chi tiết"
                          onClick={() => setSelectedStudent({id: studentId, name: info.fullName, enrolls})}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {Object.keys(enrollmentByStudent).length === 0 && (
                  <tr><td colSpan={4} className="text-center py-8 text-gray-500">Không có đăng ký nào.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Modal xem chi tiết đăng ký */}
          <Dialog open={!!selectedStudent} onOpenChange={open => { if (!open) setSelectedStudent(null); }}>
            <DialogContent className="max-w-3xl w-full bg-white rounded-lg shadow-xl">
              <DialogHeader>
                <DialogTitle>Chi tiết đăng ký của {selectedStudent?.name}</DialogTitle>
              </DialogHeader>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Mã môn học</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Ngày đăng ký</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Trạng thái</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Điểm</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStudent?.enrolls.map((enrollment) => (
                      <tr key={enrollment._id} className="hover:bg-gray-50">
                        <td className="border border-gray-100 px-4 py-3 text-gray-800">{enrollment.courseId}</td>
                        <td className="border border-gray-100 px-4 py-3 text-gray-800">{enrollment.enrollmentDate ? new Date(enrollment.enrollmentDate).toLocaleDateString() : ""}</td>
                        <td className="border border-gray-100 px-4 py-3 text-gray-800">{enrollment.status}</td>
                        <td className="border border-gray-100 px-4 py-3 text-gray-800">
                          <ul>
                            {enrollment.grade.map((g, idx) => (
                              <li key={idx}>
                                <span className="font-medium">{g.type}:</span> {g.score !== null ? g.score : "-"} (hệ số {g.weight})
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
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