"use client";
import React, { useEffect, useState } from 'react';
import { fetchStudents, Student } from '../../../services/studentApi';
import { fetchSubjects, Subject } from '../../../services/subjectApi';
import { fetchEnrollments, updateEnrollment } from '../../../services/enrollmentApi';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '../../../components/ui/dialog';

const ENROLLMENT_STATUS = [
  { value: 'IN PROGRESS', color: 'bg-blue-100 text-blue-700', label: 'In Progress' },
  { value: 'NOT PASSED', color: 'bg-red-100 text-red-700', label: 'Not Passed' },
  { value: 'PASSED', color: 'bg-green-100 text-green-700', label: 'Passed' },
];

function getStatusBadge(status: string) {
  const found = ENROLLMENT_STATUS.find(s => s.value === status);
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${found ? found.color : 'bg-gray-100 text-gray-700'}`}>{found ? found.label : status}</span>
  );
}

export default function GradeManagementPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState<any | null>(null);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    // Fetch all subjects for mapping
    fetchSubjects(1, 1000).then(res => setSubjects(res.data));
  }, []);

  useEffect(() => {
    fetchStudents(1, 1000).then(res => setStudents(res.data));
  }, []);

  const filteredStudents = students.filter(s =>
    s.firstName.toLowerCase().includes(search.toLowerCase()) ||
    s.lastName.toLowerCase().includes(search.toLowerCase()) ||
    (s.studentCode || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setLoading(true);
    fetchEnrollments(1, 1000).then(res => {
      setEnrollments(res.data.filter((e: any) => e.studentId._id === student._id));
      setLoading(false);
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Student List */}
      <div className="w-1/3 border-r bg-white p-4">
        <h2 className="text-xl font-bold mb-4">Students</h2>
        <input
          className="w-full mb-4 px-3 py-2 border rounded-lg"
          placeholder="Search by name or code..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <ul className="divide-y">
          {filteredStudents.map(s => (
            <li
              key={s._id}
              className={`p-3 cursor-pointer hover:bg-blue-50 rounded ${selectedStudent?._id === s._id ? 'bg-blue-100' : ''}`}
              onClick={() => handleSelectStudent(s)}
            >
              <div className="font-semibold">{s.firstName} {s.lastName}</div>
              <div className="text-xs text-gray-500">{s.studentCode}</div>
            </li>
          ))}
        </ul>
      </div>
      {/* Enrollment List */}
      <div className="w-2/3 p-8">
        {selectedStudent ? (
          <>
            <h3 className="text-lg font-bold mb-4">Enrollments of {selectedStudent.firstName} {selectedStudent.lastName}</h3>
            {loading ? <div>Loading...</div> : (
              <ul className="space-y-3">
                {enrollments.map(e => {
                  // Lấy subjectId từ enrollment
                  const subjectId = typeof e.courseId.subjectId === 'object' ? e.courseId.subjectId._id : e.courseId.subjectId;
                  const subject = subjects.find(s => s._id === subjectId);
                  return (
                    <li key={e._id} className="flex items-center justify-between bg-white rounded-lg shadow p-4">
                      <div>
                        <div className="font-semibold text-base">
                          {subject ? subject.subjectName : subjectId}
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="font-semibold text-sm text-gray-700">{subject ? subject.subjectCode : subjectId}</span>
                          {getStatusBadge(e.status)}
                        </div>
                      </div>
                      <Button onClick={() => { setSelectedEnrollment(e); setShowGradeModal(true); }}>
                        Manage Grade
                      </Button>
                    </li>
                  );
                })}
                {enrollments.length === 0 && <div className="text-gray-500">No enrollments found.</div>}
              </ul>
            )}
          </>
        ) : (
          <div className="text-gray-500 flex items-center justify-center h-full">Select a student to view enrollments.</div>
        )}
      </div>
      {/* Grade Modal */}
      {showGradeModal && selectedEnrollment && (
        <GradeModal
          enrollment={selectedEnrollment}
          onClose={() => setShowGradeModal(false)}
          onSave={async (grades) => {
            try {
              await updateEnrollment(selectedEnrollment._id, {
                courseId: typeof selectedEnrollment.courseId === 'object' ? selectedEnrollment.courseId._id : selectedEnrollment.courseId,
                studentId: typeof selectedEnrollment.studentId === 'object' ? selectedEnrollment.studentId._id : selectedEnrollment.studentId,
                grade: grades
              });
              // Refresh enrollments
              fetchEnrollments(1, 1000).then(res => {
                setEnrollments(res.data.filter((e: any) => e.studentId._id === selectedStudent?._id));
              });
              setSaveMessage({ type: 'success', text: 'Grades saved successfully!' });
              setTimeout(() => {
                setShowGradeModal(false);
                setSaveMessage(null);
              }, 1200);
            } catch (err) {
              setSaveMessage({ type: 'error', text: 'Failed to save grades. Please try again.' });
            }
          }}
        />
      )}
    </div>
  );
}

// Modal CRUD grade
function GradeModal({ enrollment, onClose, onSave }: { enrollment: any, onClose: () => void, onSave: (grades: any[]) => void }) {
  const [grades, setGrades] = useState<any[]>(enrollment.grade || []);
  const [editing, setEditing] = useState<number | null>(null);
  const [type, setType] = useState('');
  const [score, setScore] = useState<number | string>('');
  const [weight, setWeight] = useState<number | string>('');
  const [weightError, setWeightError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const GRADE_TYPE_OPTIONS = [
    'Progress Test',
    'Quiz',
    'Assignment',
    'Lab',
    'Project',
    'Practical Exam',
    'Final Exam',
  ];

  const handleEdit = (idx: number) => {
    setEditing(idx);
    setType(grades[idx].type);
    setScore(grades[idx].score);
    setWeight(grades[idx].weight);
  };
  const handleSaveEdit = (idx: number) => {
    const newGrades = [...grades];
    newGrades[idx] = { type, score: Number(score), weight: Number(weight) };
    setGrades(newGrades);
    setEditing(null);
  };
  const handleDelete = (idx: number) => {
    setGrades(grades.filter((_, i) => i !== idx));
  };
  const handleAdd = () => {
    if (!type) return;
    setGrades([...grades, { type, score: Number(score), weight: Number(weight) }]);
    setType(''); setScore(''); setWeight('');
  };

  // Tính tổng weight
  const totalWeight = grades.reduce((sum, g) => sum + Number(g.weight), 0) + Number(weight || 0);
  const canAdd = type && score !== '' && weight !== '' && totalWeight <= 1;
  const canSave = grades.reduce((sum, g) => sum + Number(g.weight), 0) <= 1;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full">
        <DialogTitle className="text-xl font-bold mb-6 text-center">Manage Grades</DialogTitle>
        <div className="mb-6">
          <div className="flex gap-3 items-end">
            <div className="flex flex-col w-48">
              <label className="text-sm font-medium mb-1">Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 text-base"
              >
                <option value="">Select type</option>
                {GRADE_TYPE_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col w-24">
              <label className="text-sm font-medium mb-1">Score</label>
              <input type="number" step="any" value={score} onChange={e => setScore(e.target.value)} className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400" placeholder="Score" />
            </div>
            <div className="flex flex-col w-24">
              <label className="text-sm font-medium mb-1">Weight</label>
              <input type="number" step="any" value={weight} onChange={e => setWeight(e.target.value)} className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400" placeholder="Weight" />
            </div>
            <Button onClick={handleAdd} size="sm" className="h-10 bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700" disabled={!canAdd}>Add</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Score</th>
                <th className="px-4 py-2 text-left">Weight</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {grades.map((g, idx) => (
                <tr key={idx} className="border-b last:border-b-0">
                  {editing === idx ? (
                    <>
                      <td className="px-4 py-2"><input value={type} onChange={e => setType(e.target.value)} className="border rounded px-2 py-1 w-24" placeholder="Type" /></td>
                      <td className="px-4 py-2"><input type="number" step="any" value={score} onChange={e => setScore(e.target.value)} className="border rounded px-2 py-1 w-16" placeholder="Score" /></td>
                      <td className="px-4 py-2"><input type="number" step="any" value={weight} onChange={e => setWeight(e.target.value)} className="border rounded px-2 py-1 w-16" placeholder="Weight" /></td>
                      <td className="px-4 py-2 flex gap-2">
                        <Button onClick={() => handleSaveEdit(idx)} size="sm">Save</Button>
                        <Button onClick={() => setEditing(null)} size="sm" variant="ghost">Cancel</Button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2 font-medium">{g.type}</td>
                      <td className="px-4 py-2">{g.score}</td>
                      <td className="px-4 py-2">{g.weight}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <Button onClick={() => handleEdit(idx)} size="sm">Edit</Button>
                        <Button onClick={() => handleDelete(idx)} size="sm" variant="destructive">Delete</Button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {grades.length === 0 && (
                <tr><td colSpan={4} className="text-center text-gray-400 py-4">No grades</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-6">
          <Button onClick={() => onSave(grades)} className="bg-blue-600 text-white px-6 py-2 rounded-lg" disabled={!canSave}>Save All</Button>
        </div>
        {!canSave && (
          <div className="text-red-600 text-sm mt-2 text-right">Total weight of all grades must be ≤ 1.</div>
        )}
        {saveMessage && (
          <div className={`mt-4 text-center font-semibold ${saveMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{saveMessage.text}</div>
        )}
      </DialogContent>
    </Dialog>
  );
} 