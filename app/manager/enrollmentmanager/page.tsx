"use client";
import React, { useEffect, useState, useMemo } from "react";
import { fetchStudents, Student, updateStudent } from "../../../services/studentApi";
import { getMajors, getCombos, Combo } from "../../../services/majorApi";
import { Major } from "../../../services/majorApi.types";
import { Curriculum, CurriculumQueryParams, CurriculumResponse } from "../../../services/curriculumApi.types";
import { getCurriculums } from "../../../services/curriculumApi";
import { fetchCourses, Course } from "../../../services/courseApi";
import { createEnrollment, fetchEnrollments, deleteEnrollment } from "../../../services/enrollmentApi";
import { useToast } from "../../../hooks/use-toast";
import Select from 'react-select';
import AttendanceDialog from '../../../components/attendance/AttendanceDialog';

// Mock student data with curriculum info until API is updated
const mockStudentData = (student: Student): Student & { majorId?: string, comboId?: string, curriculumId?: string, learnedSemester?: number } => ({
  ...student,
  // Add mock data here if needed, e.g.,
  // curriculumId: '687f2c2319152cf6d81c8a03',
  // learnedSemester: 1
});

export default function EnrollmentManagerPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<(Student & { majorId?: string, comboId?: string, curriculumId?: string, learnedSemester?: number }) | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    fetchStudents(1, 1000) // Fetch all students
      .then((res) => {
        setStudents(res.data.map(mockStudentData));
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load student list");
        setLoading(false);
      });
  }, []);

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    return students.filter(s =>
      s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentCode?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  if (loading) return <div className="p-6">Loading student list...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Column: Student List */}
      <div className="w-1/3 bg-white border-r border-gray-200 h-screen overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Students</h2>
          <input
            type="text"
            placeholder="Search by name or code..."
            className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ul className="divide-y divide-gray-200">
          {filteredStudents.map(student => (
            <li
              key={student._id}
              className={`p-4 cursor-pointer hover:bg-blue-50 ${selectedStudent?._id === student._id ? 'bg-blue-100' : ''}`}
              onClick={() => setSelectedStudent(student)}
            >
              <div className="font-semibold">{student.firstName} {student.lastName}</div>
              <div className="text-sm text-gray-500">{student.studentCode}</div>
            </li>
          ))}
          {filteredStudents.length === 0 && (
            <li className="p-4 text-center text-gray-500">No students found.</li>
          )}
        </ul>
      </div>

      {/* Right Column: Enrollment Details */}
      <div className="w-2/3 h-screen overflow-y-auto p-6">
        {selectedStudent ? (
          <EnrollmentDetails
            student={selectedStudent}
            onUpdateStudent={(updatedStudent) => {
              // Update student in the list
              setStudents(prev => prev.map(s => s._id === updatedStudent._id ? { ...s, ...updatedStudent } : s));
              setSelectedStudent(prev => prev ? { ...prev, ...updatedStudent } : null);
              toast({ title: "Student updated successfully!" });
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <h3 className="text-xl font-semibold">Select a student</h3>
              <p>Choose a student from the list to manage their enrollment.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- EnrollmentDetails Component ---
interface EnrollmentDetailsProps {
  student: Student & { majorId?: string, comboId?: string, curriculumId?: string, learnedSemester?: number };
  onUpdateStudent: (updatedStudent: Partial<Student & { majorId?: string, comboId?: string, curriculumId?: string }>) => void;
}

function EnrollmentDetails({ student, onUpdateStudent }: EnrollmentDetailsProps) {
  const [majors, setMajors] = useState<Major[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [currentCurriculum, setCurrentCurriculum] = useState<Curriculum | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollableCourses, setEnrollableCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());
  // Thêm state lưu enrollments để mapping từ courseId sang enrollmentId
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [attendanceDialog, setAttendanceDialog] = useState<{ open: boolean, enrollmentId: string, courseId: string, studentId: string } | null>(null);

  const [selectedMajor, setSelectedMajor] = useState(student.majorId || "");
  const [selectedCombo, setSelectedCombo] = useState(student.comboId || "");
  const [selectedCurriculum, setSelectedCurriculum] = useState(student.curriculumId || "");
  const [isEditing, setIsEditing] = useState(false);

  // Đặt getCourseId ở ngoài để dùng chung cho nhiều hàm
  const getCourseId = (courseId: any) => {
    if (courseId && typeof courseId === 'object' && '_id' in courseId) {
      return courseId._id;
    }
    return courseId;
  };

  // --- Effects to fetch data ---
  useEffect(() => {
    // Reset state when student changes
    setIsEditing(false);
    setSelectedMajor(student.majorId || "");
    setSelectedCombo(student.comboId || "");
    setSelectedCurriculum(student.curriculumId || "");
    setSelectedCourses(new Set());
  
    // Fetch curriculum details if ID exists
    if (student.curriculumId) {
      getCurriculums({ _id: student.curriculumId } as any).then(res => {
        if (res && res.data && res.data.length > 0) {
          setCurrentCurriculum(res.data[0]);
        }
      });
    } else {
      setCurrentCurriculum(null);
    }
  }, [student]);
  
  useEffect(() => {
    // Fetch initial data for dropdowns
    getMajors().then(res => setMajors(res.data)); // nếu res.data là array
    fetchCourses().then((courses: Course[]) => setCourses(courses)); // Fetch all courses
  }, []);

  useEffect(() => {
    if (selectedMajor) getCombos({ majorId: selectedMajor }).then(setCombos);
  }, [selectedMajor]);

  useEffect(() => {
    if (selectedCombo) getCurriculums({ comboId: selectedCombo }).then(res => setCurriculums(res.data));
  }, [selectedCombo]);

  const fetchAndSetEnrollments = (studentId: string) => {
    fetchEnrollments(1, 1000).then(res => {
      const studentEnrollments = res.data.filter(e => e.studentId._id === studentId);
      setEnrollments(studentEnrollments);
      // Lấy đúng _id của course, kiểm tra nếu courseId là object
      const enrolled = studentEnrollments.map(e => getCourseId(e.courseId));
      setEnrolledCourseIds(new Set(enrolled));
      setSelectedCourses(new Set());
    });
  };

  // Fetch enrollments của student khi student thay đổi
  useEffect(() => {
    if (student._id) {
      fetchAndSetEnrollments(student._id);
    }
  }, [student]);

  // 1. Lọc subject đúng kỳ từ curriculum
  const subjectsForSemester = useMemo(() => {
    if (!currentCurriculum || !student.learnedSemester || !currentCurriculum.subjects) return [];
    return currentCurriculum.subjects.filter(
      (s: any) => Number((s as any).semesterNumber) === Number(student.learnedSemester)
    );
  }, [currentCurriculum, student.learnedSemester]);

  // 2. Lấy tất cả course ứng với các subject này
  const coursesBySubject = useMemo(() => {
    const map: { [subjectId: string]: Course[] } = {};
    subjectsForSemester.forEach((subject: any) => {
      map[subject._id] = courses.filter((c: Course) => c.subjectId._id === subject._id);
    });
    return map;
  }, [subjectsForSemester, courses]);

  // Tách 2 danh sách course: availableCourses và enrolledCourses
  const availableCoursesBySubject = useMemo(() => {
    const map: { [subjectId: string]: Course[] } = {};
    subjectsForSemester.forEach((subject: any) => {
      map[subject._id] = courses.filter((c: Course) => c.subjectId._id === subject._id && !enrolledCourseIds.has(c._id));
    });
    return map;
  }, [subjectsForSemester, courses, enrolledCourseIds]);

  const enrolledCoursesBySubject = useMemo(() => {
    const map: { [subjectId: string]: Course[] } = {};
    subjectsForSemester.forEach((subject: any) => {
      map[subject._id] = courses.filter((c: Course) => c.subjectId._id === subject._id && enrolledCourseIds.has(c._id));
    });
    return map;
  }, [subjectsForSemester, courses, enrolledCourseIds]);

  const handleCourseSelection = (courseId: string) => {
    setSelectedCourses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  const handleEnroll = async () => {
    if (selectedCourses.size === 0) {
      toast({ title: "Please select at least one course to enroll.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await Promise.all(Array.from(selectedCourses).map(courseId =>
        createEnrollment({ courseId, studentId: student._id, grade: [] })
      ));
      toast({ title: "Enrollment successful!", description: `Enrolled student in ${selectedCourses.size} courses.` });
      setSelectedCourses(new Set());
      await fetchCourses().then((courses: Course[]) => setCourses(courses)); // fetch lại courses
      fetchAndSetEnrollments(student._id); // fetch lại enrollments
    } catch (error) {
      toast({ title: "Enrollment failed.", description: "An error occurred while enrolling the student.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveCurriculum = async () => {
    if (!selectedMajor || !selectedCombo || !selectedCurriculum) {
      alert("Please select Major, Combo, and Curriculum.");
      return;
    }
    try {
      await updateStudent(student._id, {
        majorId: selectedMajor,
        comboId: selectedCombo,
        curriculumId: selectedCurriculum
      });
      // Fetch lại student và curriculum mới nhất
      const updatedStudentRes = await fetchStudents(1, 1000);
      const updatedStudent = updatedStudentRes.data.find(s => s._id === student._id);
      onUpdateStudent(updatedStudent || {});
      getCurriculums({ _id: selectedCurriculum } as any).then(res => {
        if (res && res.data && res.data.length > 0) {
          setCurrentCurriculum(res.data[0]);
        }
      });
      setIsEditing(false);
    } catch (error) {
      alert("Failed to update student curriculum.");
    }
  };
  
  // Hàm xoá enrollment
  const handleDeleteEnrollment = async (courseId: string) => {
    const enrollment = enrollments.find(e => getCourseId(e.courseId) === courseId);
    if (!enrollment) return;
    if (!window.confirm('Are you sure you want to delete this enrollment?')) return;
    try {
      await deleteEnrollment(enrollment._id);
      // Cập nhật enrollments trước, sau đó cập nhật courses
      await fetchAndSetEnrollments(student._id);
      await fetchCourses().then(setCourses);
      toast({ title: 'Enrollment deleted!' });
    } catch (err) {
      toast({ title: 'Failed to delete enrollment', variant: 'destructive' });
    }
  };

  // Thêm log debug
  useEffect(() => {
    console.log('enrollments', enrollments);
    console.log('courses', courses);
    console.log('enrolledCourseIds', Array.from(enrolledCourseIds));
    if (typeof enrolledCoursesBySubject !== 'undefined') {
      console.log('enrolledCoursesBySubject', enrolledCoursesBySubject);
    }
  }, [enrollments, courses, enrolledCourseIds, enrolledCoursesBySubject]);

  // --- Render logic ---
  if (!student.curriculumId && !isEditing) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4">Set Student's Curriculum</h3>
        <p className="mb-4 text-sm text-gray-600">This student does not have a curriculum set. Please select one to proceed with enrollment.</p>
        <button
          onClick={() => setIsEditing(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Set Curriculum
        </button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h3 className="text-lg font-bold">Editing Curriculum for {student.firstName}</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700">Major</label>
          <Select
            options={majors.map(m => ({ value: m._id, label: m.majorName }))}
            value={majors.map(m => ({ value: m._id, label: m.majorName })).find(m => m.value === selectedMajor)}
            onChange={opt => setSelectedMajor(opt?.value || "")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Combo</label>
          <Select
            options={combos.map(c => ({ value: c._id, label: c.comboName }))}
            value={combos.map(c => ({ value: c._id, label: c.comboName })).find(c => c.value === selectedCombo)}
            onChange={opt => setSelectedCombo(opt?.value || "")}
            isDisabled={!selectedMajor}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Curriculum</label>
           <Select
            options={curriculums.map(cur => ({ value: cur._id, label: cur.curriculumName }))}
            value={curriculums.map(cur => ({ value: cur._id, label: cur.curriculumName })).find(cur => cur.value === selectedCurriculum)}
            onChange={opt => setSelectedCurriculum(opt?.value || "")}
            isDisabled={!selectedCombo}
          />
        </div>
        <div className="flex gap-2">
          <button onClick={handleSaveCurriculum} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Save</button>
          <button onClick={() => setIsEditing(false)} className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold">{student.firstName} {student.lastName}</h3>
          <p className="text-gray-600">
            Enrolling for Semester: <span className="font-semibold">{student.learnedSemester || 'N/A'}</span>
          </p>
        </div>
        <button onClick={() => setIsEditing(true)} className="text-sm text-blue-600 hover:underline">
          Change Curriculum
        </button>
      </div>
      <div className="mt-6">
        <h4 className="text-lg font-semibold">Available Courses to Enroll for Semester {student.learnedSemester}</h4>
        {subjectsForSemester.length > 0 ? (
          <div className="mt-4 space-y-2">
            {subjectsForSemester.map(subject => (
              <div key={subject._id} className="border rounded-lg mb-2">
                <div
                  className="flex items-center p-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedSubject(expandedSubject === subject._id ? null : subject._id)}
                >
                  <span className="font-medium text-gray-800">{subject.subjectCode} - {subject.subjectName}</span>
                  <span className="ml-2 text-xs text-gray-500">(Semester: {(subject as any).semesterNumber})</span>
                  <span className="ml-auto text-blue-600">{expandedSubject === subject._id ? '▲' : '▼'}</span>
                </div>
                {expandedSubject === subject._id && (
                  <div className="pl-6 pb-3">
                    {availableCoursesBySubject[subject._id] && availableCoursesBySubject[subject._id].length > 0 ? (
                      availableCoursesBySubject[subject._id].map(course => (
                        <div key={course._id} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={course._id}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            checked={selectedCourses.has(course._id)}
                            onChange={() => handleCourseSelection(course._id)}
                          />
                          <label htmlFor={course._id} className="ml-3 block text-sm font-medium text-gray-700">
                            Course: {course.title || course.subjectId?.subjectName || course._id}
                          </label>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 text-sm">No available course for this subject.</div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4">
              <button
                onClick={handleEnroll}
                disabled={isSubmitting || selectedCourses.size === 0}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                {isSubmitting ? 'Enrolling...' : `Enroll in ${selectedCourses.size} Courses`}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-8 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
            <p>No subjects found for semester {student.learnedSemester}.</p>
            <p className="text-sm">This could be because no subjects are scheduled for this semester yet, or the curriculum is not fully defined.</p>
          </div>
        )}

        {/* Enrolled Courses Section */}
        <h4 className="text-lg font-semibold mt-8">Enrolled Courses</h4>
        {subjectsForSemester.length > 0 ? (
          <div className="mt-4 space-y-2">
            {subjectsForSemester.map(subject => (
              <div key={subject._id} className="border rounded-lg mb-2">
                <div className="flex items-center p-3 bg-gray-50">
                  <span className="font-medium text-gray-800">{subject.subjectCode} - {subject.subjectName}</span>
                  <span className="ml-2 text-xs text-gray-500">(Semester: {(subject as any).semesterNumber})</span>
                </div>
                <div className="pl-6 pb-3">
                  {enrolledCoursesBySubject[subject._id] && enrolledCoursesBySubject[subject._id].length > 0 ? (
                    enrolledCoursesBySubject[subject._id].map(course => (
                      <div key={course._id} className="flex items-center mb-2">
                        <span className="ml-3 block text-sm font-medium text-gray-700">
                          Course: {course.title || course.subjectId?.subjectName || course._id}
                        </span>
                        <button
                          className="ml-4 px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs"
                          onClick={() => handleDeleteEnrollment(course._id)}
                        >
                          Delete
                        </button>
                        <button
                          className="ml-2 px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs"
                          onClick={() => setAttendanceDialog({ open: true, enrollmentId: (enrollments.find(e => getCourseId(e.courseId) === course._id)?._id || ''), courseId: course._id, studentId: student._id })}
                        >
                          Check Attendance
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-sm">No enrolled course for this subject.</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      {attendanceDialog && (
        <AttendanceDialog
          open={attendanceDialog.open}
          onClose={() => setAttendanceDialog(null)}
          enrollmentId={attendanceDialog.enrollmentId}
          courseId={attendanceDialog.courseId}
          studentId={attendanceDialog.studentId}
        />
      )}
    </div>
  );
} 