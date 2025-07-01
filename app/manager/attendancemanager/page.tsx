"use client";
import React, { useEffect, useState } from "react";
import { fetchAttendances, Attendance, AttendanceListResponse } from "../../../services/attendanceApi";
import { fetchEnrollments, Enrollment, EnrollmentListResponse } from "../../../services/enrollmentApi";
import { fetchStudents, Student, StudentListResponse } from "../../../services/studentApi";
import { fetchSubjects, Subject, SubjectListResponse } from "../../../services/subjectApi";

export default function AttendanceManagerPage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetchAttendances(1, 1000),
      fetchEnrollments(1, 1000),
      fetchStudents(1, 1000),
      fetchSubjects(1, 1000)
    ])
      .then(([attRes, enrollRes, stuRes, subRes]: [AttendanceListResponse, EnrollmentListResponse, StudentListResponse, SubjectListResponse]) => {
        setAttendances(attRes.data);
        setEnrollments(enrollRes.data);
        setStudents(stuRes.data);
        setSubjects(subRes.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load attendance data");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading attendance data...</div>;
  if (error) return <div>{error}</div>;

  // Group logic: Student -> Course -> Attendances
  const studentMap = Object.fromEntries(students.map(s => [s._id, s]));
  const subjectMap = Object.fromEntries(subjects.map(s => [s._id, s]));
  const enrollmentMap = Object.fromEntries(enrollments.map(e => [e._id, e]));

  // Group enrollments by student
  const enrollmentsByStudent: { [studentId: string]: Enrollment[] } = {};
  enrollments.forEach(e => {
    if (!enrollmentsByStudent[e.studentId]) enrollmentsByStudent[e.studentId] = [];
    enrollmentsByStudent[e.studentId].push(e);
  });

  // Group attendances by enrollmentId
  const attendancesByEnrollment: { [enrollmentId: string]: Attendance[] } = {};
  attendances.forEach(a => {
    if (!attendancesByEnrollment[a.enrollmentId]) attendancesByEnrollment[a.enrollmentId] = [];
    attendancesByEnrollment[a.enrollmentId].push(a);
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Attendance by Student & Course</h1>
          {students.length === 0 && <div>No students found.</div>}
          {students.map(student => (
            <div key={student._id} className="mb-8">
              <h2 className="text-xl font-semibold text-blue-700 mb-2">
                {student.lastName} {student.firstName} ({student.studentCode || student.email})
              </h2>
              {(enrollmentsByStudent[student._id] || []).length === 0 ? (
                <div className="ml-4 text-gray-500">No enrollments.</div>
              ) : (
                enrollmentsByStudent[student._id].map(enrollment => (
                  <div key={enrollment._id} className="ml-4 mb-4">
                    <h3 className="text-lg font-medium text-green-700 mb-1">
                      Course: {subjectMap[enrollment.courseId]?.subjectName || enrollment.courseId}
                    </h3>
                    <table className="w-full border-collapse mb-2">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-200 px-2 py-1 text-left text-xs">Session ID</th>
                          <th className="border border-gray-200 px-2 py-1 text-center text-xs">Status</th>
                          <th className="border border-gray-200 px-2 py-1 text-center text-xs">Created At</th>
                          <th className="border border-gray-200 px-2 py-1 text-center text-xs">Updated At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(attendancesByEnrollment[enrollment._id] || []).map(att => (
                          <tr key={att._id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="border border-gray-100 px-2 py-1 text-xs">{att.sessionId}</td>
                            <td className="border border-gray-100 px-2 py-1 text-center text-xs">{att.status}</td>
                            <td className="border border-gray-100 px-2 py-1 text-center text-xs">{att.createdAt ? new Date(att.createdAt).toLocaleString() : ""}</td>
                            <td className="border border-gray-100 px-2 py-1 text-center text-xs">{att.updatedAt ? new Date(att.updatedAt).toLocaleString() : ""}</td>
                          </tr>
                        ))}
                        {(attendancesByEnrollment[enrollment._id] || []).length === 0 && (
                          <tr><td colSpan={4} className="text-center text-gray-400">No attendance records.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 