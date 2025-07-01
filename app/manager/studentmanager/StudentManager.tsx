"use client"

import type React from "react"
import { useState } from "react"
import { StudentRow } from "./StudentRow"
import { StudentForm } from "./StudentForm"
import { StudentDetail } from "./StudentDetail"

export interface Student {
  id: string
  fullName: string
  studentId: string
  gender: "Male" | "Female" | "Other"
  email: string
  password: string
  subjects: string[]
  scores: { [subject: string]: number }
  attendance: { [subject: string]: number }
  // Profile information
  dateOfBirth?: string
  idCard?: string
  address?: string
  phoneNumber?: string
  dateOfIssue?: string
  placeOfIssue?: string
  // Academic information
  memberCode?: string
  mode?: string
  status?: "Active" | "Inactive" | "Graduated" | "On Leave"
  currentTermNo?: number
  major?: string
  // Avatar
  image?: string
  // Parent information
  fatherName?: string
  fatherPhone?: string
  fatherJob?: string
  motherName?: string
  motherPhone?: string
  motherJob?: string
}

export const StudentManager: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      fullName: "Bùi Hải Dương",
      studentId: "SE173590",
      gender: "Male",
      email: "duongbhse173590@fpt.edu.vn",
      password: "password123",
      subjects: ["EXE101", "MMA301", "SWD392"],
      scores: { EXE101: 85, MMA301: 92, SWD392: 78 },
      attendance: { EXE101: 95, MMA301: 88, SWD392: 92 },
      // Profile information
      dateOfBirth: "2003-01-30",
      idCard: "123456789012",
      address: "123 Main St, Anytown, AT 12345",
      phoneNumber: "0827577752",
      dateOfIssue: "2017-01-10",
      placeOfIssue: "HoChiMinh",
      // Academic information
      memberCode: "DuongBHSE173590",
      mode: "Full-time",
      status: "Active",
      currentTermNo: 3,
      major: "Software Engineering",
      // Parent information
      fatherName: "Trịnh Trần Phương Tuấn",
      fatherPhone: "0828192733",
      fatherJob: "Engineer",
      motherName: "Mary Doe",
      motherPhone: "555-876-5432",
      motherJob: "Doctor",
    },
    {
      id: "2",
      fullName: "Nguyễn Thanh Tùng",
      studentId: "SE182292",
      gender: "Female",
      email: "mtp@example.com",
      password: "password456",
      subjects: ["SDN302", "MMA301", "SWD392"],
      scores: { SDN302: 90, MMA301: 87, SWD392: 94 },
      attendance: { SDN302: 92, MMA301: 85, SWD392: 98 },
      // thông tin cá nhân
      dateOfBirth: "1994-08-22",
      idCard: "987654321098",
      address: "456 Oak Ave, Somewhere, SW 54321",
      phoneNumber: "555-234-5678",
      dateOfIssue: "2017-03-20",
      placeOfIssue: "Somewhere",
      // thông tin học thuật
      memberCode: "MC002",
      mode: "Part-time",
      status: "Active",
      currentTermNo: 2,
      major: "Information Technology",
      // thông tin phụ huynh
      fatherName: "William Smith",
      fatherPhone: "555-765-4321",
      fatherJob: "Accountant",
      motherName: "Elizabeth Smith",
      motherPhone: "555-654-3210",
      motherJob: "Teacher",
    },
    
    {
    id: "3",
    fullName: "Trần Minh Quân",
    studentId: "SE174321",
    gender: "Male",
    email: "quanse174321@fpt.edu.vn",
    password: "pass123",
    subjects: ["PRJ301", "DBI202", "SWD392"],
    scores: { PRJ301: 88, DBI202: 91, SWD392: 80 },
    attendance: { PRJ301: 90, DBI202: 89, SWD392: 85 },
    dateOfBirth: "2002-05-14",
    idCard: "123456780001",
    address: "789 Green St, Cityville",
    phoneNumber: "0912345678",
    dateOfIssue: "2018-06-01",
    placeOfIssue: "Cityville",
    memberCode: "QuanTMSE174321",
    mode: "Full-time",
    status: "Active",
    currentTermNo: 4,
    major: "Software Engineering",
    fatherName: "Trần Văn An",
    fatherPhone: "0988888888",
    fatherJob: "Teacher",
    motherName: "Nguyễn Thị Hoa",
    motherPhone: "0977777777",
    motherJob: "Nurse",
  },
  {
    id: "4",
    fullName: "Lê Thị Mai",
    studentId: "SE174322",
    gender: "Female",
    email: "mailtmse174322@fpt.edu.vn",
    password: "abc12345",
    subjects: ["MLN101", "SWT301", "PRN211"],
    scores: { MLN101: 77, SWT301: 83, PRN211: 90 },
    attendance: { MLN101: 95, SWT301: 87, PRN211: 92 },
    dateOfBirth: "2001-09-20",
    idCard: "123456780002",
    address: "1010 Lake Rd, Hanoi",
    phoneNumber: "0987123456",
    dateOfIssue: "2017-11-05",
    placeOfIssue: "Hanoi",
    memberCode: "MaiLTSE174322",
    mode: "Full-time",
    status: "Active",
    currentTermNo: 5,
    major: "Information Systems",
    fatherName: "Lê Văn Hùng",
    fatherPhone: "0909123456",
    fatherJob: "Driver",
    motherName: "Phạm Thị Lan",
    motherPhone: "0911123456",
    motherJob: "Office Staff",
  },
  {
    id: "5",
    fullName: "Phạm Anh Tuấn",
    studentId: "SE174323",
    gender: "Male",
    email: "tuanpatse174323@fpt.edu.vn",
    password: "tuantuantuan",
    subjects: ["PRJ301", "DBI202", "JPD113"],
    scores: { PRJ301: 93, DBI202: 88, JPD113: 75 },
    attendance: { PRJ301: 97, DBI202: 90, JPD113: 85 },
    dateOfBirth: "2002-07-15",
    idCard: "123456780003",
    address: "999 Red St, Danang",
    phoneNumber: "0923456789",
    dateOfIssue: "2018-04-10",
    placeOfIssue: "Danang",
    memberCode: "TuanPASE174323",
    mode: "Full-time",
    status: "Active",
    currentTermNo: 4,
    major: "Software Engineering",
    fatherName: "Phạm Văn Bảo",
    fatherPhone: "0933222111",
    fatherJob: "Electrician",
    motherName: "Trần Thị Nhung",
    motherPhone: "0944112233",
    motherJob: "Cashier",
  },
  {
    id: "6",
    fullName: "Đỗ Khánh Linh",
    studentId: "SE174324",
    gender: "Female",
    email: "linhdkse174324@fpt.edu.vn",
    password: "khanhlinh@2024",
    subjects: ["MAD101", "PRO192", "SWE201"],
    scores: { MAD101: 84, PRO192: 76, SWE201: 88 },
    attendance: { MAD101: 91, PRO192: 93, SWE201: 89 },
    dateOfBirth: "2003-03-25",
    idCard: "123456780004",
    address: "888 Flower Blvd, HCM",
    phoneNumber: "0909090909",
    dateOfIssue: "2019-08-30",
    placeOfIssue: "HCM",
    memberCode: "LinhDKSE174324",
    mode: "Full-time",
    status: "Active",
    currentTermNo: 3,
    major: "Artificial Intelligence",
    fatherName: "Đỗ Văn Long",
    fatherPhone: "0988776655",
    fatherJob: "Architect",
    motherName: "Ngô Thị Hương",
    motherPhone: "0933665544",
    motherJob: "Lecturer",
  },
  {
    id: "7",
    fullName: "Ngô Bảo Châu",
    studentId: "SE174325",
    gender: "Male",
    email: "chaunbse174325@fpt.edu.vn",
    password: "nbchau123",
    subjects: ["JPD113", "SWT301", "SWD392"],
    scores: { JPD113: 80, SWT301: 85, SWD392: 82 },
    attendance: { JPD113: 88, SWT301: 90, SWD392: 87 },
    dateOfBirth: "2001-12-01",
    idCard: "123456780005",
    address: "77 Insight Lane, Hue",
    phoneNumber: "0966223344",
    dateOfIssue: "2017-09-12",
    placeOfIssue: "Hue",
    memberCode: "ChauNBSE174325",
    mode: "Part-time",
    status: "Active",
    currentTermNo: 5,
    major: "Cybersecurity",
    fatherName: "Ngô Văn Thành",
    fatherPhone: "0955667788",
    fatherJob: "Banker",
    motherName: "Hoàng Thị Tuyết",
    motherPhone: "0911998877",
    motherJob: "HR Manager",
  },
  {
    id: "8",
    fullName: "Nguyễn Mỹ Linh",
    studentId: "SE174326",
    gender: "Female",
    email: "linhnmse174326@fpt.edu.vn",
    password: "linhlinh",
    subjects: ["DBI202", "MLN101", "PRJ301"],
    scores: { DBI202: 89, MLN101: 90, PRJ301: 95 },
    attendance: { DBI202: 96, MLN101: 98, PRJ301: 99 },
    dateOfBirth: "2002-10-05",
    idCard: "123456780006",
    address: "59 Cloud Rd, Haiphong",
    phoneNumber: "0944332211",
    dateOfIssue: "2018-12-03",
    placeOfIssue: "Haiphong",
    memberCode: "LinhNMSE174326",
    mode: "Full-time",
    status: "Active",
    currentTermNo: 4,
    major: "Data Science",
    fatherName: "Nguyễn Văn Hòa",
    fatherPhone: "0922113344",
    fatherJob: "Analyst",
    motherName: "Trần Kim Ngân",
    motherPhone: "0933224455",
    motherJob: "Shop Owner",
  },
  {
    id: "9",
    fullName: "Lý Trường Thịnh",
    studentId: "SE174327",
    gender: "Male",
    email: "thinhltse174327@fpt.edu.vn",
    password: "truongthinh",
    subjects: ["PRN211", "PRJ301", "DBI202"],
    scores: { PRN211: 72, PRJ301: 85, DBI202: 80 },
    attendance: { PRN211: 88, PRJ301: 92, DBI202: 90 },
    dateOfBirth: "2001-04-18",
    idCard: "123456780007",
    address: "45 Dream Ave, HCM",
    phoneNumber: "0911556677",
    dateOfIssue: "2019-01-20",
    placeOfIssue: "HCM",
    memberCode: "ThinhLTSE174327",
    mode: "Part-time",
    status: "Active",
    currentTermNo: 6,
    major: "Software Engineering",
    fatherName: "Lý Văn Tâm",
    fatherPhone: "0988997788",
    fatherJob: "Photographer",
    motherName: "Nguyễn Thị Đào",
    motherPhone: "0911223344",
    motherJob: "Pharmacist",
  },
  {
    id: "10",
    fullName: "Đặng Thùy Dương",
    studentId: "SE174328",
    gender: "Female",
    email: "duongdtse174328@fpt.edu.vn",
    password: "duongpass",
    subjects: ["SWE201", "MLN101", "SWT301"],
    scores: { SWE201: 85, MLN101: 88, SWT301: 90 },
    attendance: { SWE201: 92, MLN101: 90, SWT301: 95 },
    dateOfBirth: "2002-06-21",
    idCard: "123456780008",
    address: "22 Ocean Blvd, Nha Trang",
    phoneNumber: "0900123123",
    dateOfIssue: "2019-03-15",
    placeOfIssue: "Nha Trang",
    memberCode: "DuongDTSE174328",
    mode: "Full-time",
    status: "Active",
    currentTermNo: 3,
    major: "Software Engineering",
    fatherName: "Đặng Văn Khoa",
    fatherPhone: "0933555777",
    fatherJob: "Consultant",
    motherName: "Lê Thị Thanh",
    motherPhone: "0944666888",
    motherJob: "Entrepreneur",
  },
  {
    id: "11",
    fullName: "Vũ Đức Huy",
    studentId: "SE174329",
    gender: "Male",
    email: "huyvdse174329@fpt.edu.vn",
    password: "huyhuy",
    subjects: ["DBI202", "SWE201", "SWD392"],
    scores: { DBI202: 79, SWE201: 82, SWD392: 84 },
    attendance: { DBI202: 89, SWE201: 91, SWD392: 87 },
    dateOfBirth: "2001-11-11",
    idCard: "123456780009",
    address: "64 Riverbank Rd, Can Tho",
    phoneNumber: "0911888777",
    dateOfIssue: "2017-12-12",
    placeOfIssue: "Can Tho",
    memberCode: "HuyVDSE174329",
    mode: "Full-time",
    status: "Active",
    currentTermNo: 4,
    major: "Information Systems",
    fatherName: "Vũ Văn Đạt",
    fatherPhone: "0933445566",
    fatherJob: "Police Officer",
    motherName: "Phạm Thị Nhàn",
    motherPhone: "0900998877",
    motherJob: "Secretary",
  }


  ])

  const [showForm, setShowForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [viewingStudentId, setViewingStudentId] = useState<string | null>(null)

  const handleAddStudent = (studentData: Omit<Student, "id">) => {
    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString(),
    }
    setStudents([...students, newStudent])
    setShowForm(false)
  }

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(students.map((student) => (student.id === updatedStudent.id ? updatedStudent : student)))
    setEditingStudent(null)
    setShowForm(false)
  }

  const handleDeleteStudent = (studentId: string) => {
    setStudents(students.filter((student) => student.id !== studentId))
    if (viewingStudentId === studentId) {
      setViewingStudentId(null)
    }
  }

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student)
    setShowForm(true)
  }

  const handleUpdateScoreOrAttendance = (
    studentId: string,
    field: "scores" | "attendance",
    subject: string,
    value: number,
  ) => {
    setStudents(
      students.map((student) => {
        if (student.id === studentId) {
          return {
            ...student,
            [field]: {
              ...student[field],
              [subject]: value,
            },
          }
        }
        return student
      }),
    )
  }

  const handleViewStudentDetails = (studentId: string) => {
    setViewingStudentId(studentId)
  }

  const handleUpdateStudentDetails = (updatedStudent: Student) => {
    setStudents(students.map((student) => (student.id === updatedStudent.id ? updatedStudent : student)))
  }

  const viewingStudent = viewingStudentId ? students.find((student) => student.id === viewingStudentId) : null

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {viewingStudent ? (
          <StudentDetail
            student={viewingStudent}
            onBack={() => setViewingStudentId(null)}
            onUpdate={handleUpdateStudentDetails}
            onDelete={handleDeleteStudent}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Student Management System</h1>
              <button
                onClick={() => {
                  setEditingStudent(null)
                  setShowForm(true)
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Add New Student
              </button>
            </div>

            {showForm && (
              <div className="mb-6">
                <StudentForm
  student={editingStudent}
  onSubmit={
    editingStudent
      ? (handleUpdateStudent as (student: Student | Omit<Student, 'id'>) => void)
      : (handleAddStudent as (student: Student | Omit<Student, 'id'>) => void)
  }
  onCancel={() => {
    setShowForm(false);
    setEditingStudent(null);
  }}
/>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                      Full Name
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                      Student ID
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Gender</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Password</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Subjects</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Scores</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                      Attendance
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <StudentRow
                      key={student.id}
                      student={student}
                      onEdit={handleEditStudent}
                      onDelete={handleDeleteStudent}
                      onUpdateScoreOrAttendance={handleUpdateScoreOrAttendance}
                      onViewDetails={handleViewStudentDetails}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {students.length === 0 && (
              <div className="text-center py-8 text-gray-500">No students found. Add a new student to get started.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
