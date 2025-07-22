import React, { useEffect, useState } from 'react';
import { updateAttendance, Attendance, fetchAttendancesByStudentEnrollment } from '../../services/attendanceApi';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';

interface AttendanceDialogProps {
  open: boolean;
  onClose: () => void;
  enrollmentId: string;
  courseId: string;
  studentId: string;
}

const STATUS_OPTIONS = [
  { value: 'NOT YET', label: 'Not yet' },
  { value: 'ATTENDED', label: 'Presented' },
  { value: 'ABSENT', label: 'Absent' },
];

// Helper để lấy class màu theo status
function getStatusColor(status: string) {
  switch (status) {
    case 'ATTENDED':
      return 'bg-green-100 text-green-700';
    case 'ABSENT':
      return 'bg-red-100 text-red-700';
    case 'NOT YET':
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export default function AttendanceDialog({ open, onClose, enrollmentId, courseId, studentId }: AttendanceDialogProps) {
  // Không cần sessions nữa
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalAttendances, setOriginalAttendances] = useState<Attendance[]>([]);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetchAttendancesByStudentEnrollment(studentId, enrollmentId)
      .then((attendanceRes) => {
        const filtered = (attendanceRes.data || []).map((a: Attendance) => ({ ...a, status: (a.status as 'NOT YET' | 'ATTENDED' | 'ABSENT') }));
        setAttendances(filtered);
        setOriginalAttendances(filtered);
        setLoading(false);
      })
      .catch(() => {
        setError('Không thể tải dữ liệu.');
        setLoading(false);
      });
  }, [open, enrollmentId, studentId]);

  // Khi chọn status, chỉ update local state attendances
  const handleStatusChange = (attendanceId: string, status: 'NOT YET' | 'ATTENDED' | 'ABSENT') => {
    setAttendances(prev => prev.map(a => a._id === attendanceId ? { ...a, status } : a));
  };

  // Lưu tất cả thay đổi status
  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // Chỉ update những attendance có status khác bản gốc
      const changed = attendances.filter(a => {
        const original = originalAttendances.find(o => o._id === a._id);
        return original && original.status !== a.status;
      });
      await Promise.all(changed.map(a => updateAttendance(a._id, { status: a.status })));
      // Fetch lại dữ liệu mới
      const attendanceResSave = await fetchAttendancesByStudentEnrollment(studentId, enrollmentId);
      const filteredSave = (attendanceResSave.data || []).map((a: Attendance) => ({ ...a, status: (a.status as 'NOT YET' | 'ATTENDED' | 'ABSENT') }));
      setAttendances(filteredSave);
      setOriginalAttendances(filteredSave);
      setError(null);
    } catch {
      setError('Lưu thay đổi attendance thất bại.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl">
        <div className="mb-6">
          <DialogTitle className="text-2xl font-bold text-center w-full">Attendance Management ({attendances.length} sessions)</DialogTitle>
        </div>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {attendances.map((attendance, idx) => (
              <div key={attendance._id} className="flex items-center justify-between border rounded-lg px-6 py-4 gap-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="font-semibold text-lg text-gray-800">Session {idx + 1}</div>
                <select
                  value={attendance.status || 'NOT YET'}
                  onChange={e => handleStatusChange(attendance._id, e.target.value as any)}
                  className={`w-40 border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition disabled:bg-gray-100 hover:border-blue-400 text-center ${getStatusColor(attendance.status)}`}
                  disabled={saving}
                  style={{ textAlignLast: 'center' }}
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value} className={getStatusColor(opt.value)}>{opt.label}</option>
                  ))}
                </select>
              </div>
            ))}
            <div className="pt-6 flex justify-end">
              <Button onClick={handleSaveAll} disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-base font-semibold shadow hover:bg-blue-700 transition">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 