"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getSystemUserById, SystemUser } from "@/services/systemUserApi";
import { Navbar } from "@/components/navbar";
import { Users, BookOpen, ClipboardList, CheckSquare, Settings, SwatchBook, AlertTriangle, MessageSquare, BarChart3 } from "lucide-react";

export default function ProfilePage() {
  const { user, loading: authLoading, error: authError } = useAuth();
  const [profile, setProfile] = useState<SystemUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      getSystemUserById(user.id)
        .then(res => {
          setProfile(res);
          setLoading(false);
        })
        .catch(() => {
          setError("Unable to load profile info");
          setLoading(false);
        });
    }
  }, [user?.id]);

  // Navbar items theo role
  const navItems = useMemo(() => {
    if (user?.role === "ADMIN") {
      return [
        {
          href: "/admin/system-users",
          label: "System Users",
          icon: <Settings className="w-4 h-4" />,
        },
        {
          href: "/admin/subjects",
          label: "Subjects",
          icon: <BookOpen className="w-4 h-4" />,
        },
        {
          href: "/admin/semesters",
          label: "Semesters",
          icon: <SwatchBook className="w-4 h-4" />,
        },
      ];
    } else if (user?.role === "MANAGER") {
      return [
        {
          href: "/manager/studentmanager",
          label: "Student Management",
          icon: <Users className="w-4 h-4" />,
        },
        {
          href: "/manager/subjectmanager",
          label: "Subject Management",
          icon: <BookOpen className="w-4 h-4" />,
        },
        {
          href: "/manager/enrollmentmanager",
          label: "Course Enrollment Management",
          icon: <ClipboardList className="w-4 h-4" />,
        },
        {
          href: "/manager/attendancemanager",
          label: "Attendance Management",
          icon: <CheckSquare className="w-4 h-4" />,
        },
      ];
    } else if (user?.role === "SUPERVISOR") {
      return [
        {
          href: "/supervisor/alerts",
          label: "Cảnh báo",
          icon: <AlertTriangle className="w-4 h-4" />,
        },
        {
          href: "/supervisor/responses",
          label: "Phản hồi",
          icon: <MessageSquare className="w-4 h-4" />,
        },
        {
          href: "/supervisor/analytics",
          label: "Thống kê",
          icon: <BarChart3 className="w-4 h-4" />,
        },
      ];
    }
    return [];
  }, [user?.role]);

  // Title/subtitle theo role
  const navTitle = user?.role === "ADMIN"
    ? "Admin Dashboard"
    : user?.role === "MANAGER"
    ? "Manager Dashboard"
    : user?.role === "SUPERVISOR"
    ? "Supervisor Dashboard"
    : "Profile";
  const navSubtitle = user?.role === "ADMIN"
    ? "Quản lý người dùng và phân quyền hệ thống"
    : user?.role === "MANAGER"
    ? "Manage students and subjects"
    : user?.role === "SUPERVISOR"
    ? "Xử lý cảnh báo AI và hỗ trợ học sinh"
    : "User Information";

  // Chuyển role về đúng union type cho Navbar
  const navRole = user?.role === "ADMIN"
    ? "admin"
    : user?.role === "MANAGER"
    ? "manager"
    : user?.role === "SUPERVISOR"
    ? "supervisor"
    : undefined;

  if (authLoading || loading) return <div className="p-8 bg-white min-h-screen"><Navbar title={navTitle} subtitle={navSubtitle} role={navRole} navItems={navItems} /><div className="mt-8">Loading profile...</div></div>;
  if (authError || error) return <div className="p-8 text-red-500 bg-white min-h-screen"><Navbar title={navTitle} subtitle={navSubtitle} role={navRole} navItems={navItems} /><div className="mt-8">{authError || error}</div></div>;
  if (!profile) return <div className="p-8 text-gray-500 bg-white min-h-screen"><Navbar title={navTitle} subtitle={navSubtitle} role={navRole} navItems={navItems} /><div className="mt-8">No profile information found.</div></div>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar title={navTitle} subtitle={navSubtitle} role={navRole} navItems={navItems} />
      <div className="flex items-center justify-center py-12">
        <div className="max-w-xl w-full bg-white rounded-lg shadow-lg p-8 flex flex-col items-center text-center border-2 border-gray-200">
          <div className="w-28 h-28 rounded-full border mb-4 flex items-center justify-center overflow-hidden bg-gray-100">
            {profile.image ? (
              <img
                src={profile.image}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl text-gray-400 font-bold">{profile.firstName?.[0] || profile.lastName?.[0] || "?"}</span>
            )}
          </div>
          <div className="text-2xl font-bold mb-2 text-gray-900">{profile.lastName} {profile.firstName}</div>
          <div className="mb-1 text-lg text-gray-700 font-semibold"><b>Role:</b> <span className="font-normal">{profile.role}</span></div>
          <div className="mb-1 text-lg text-gray-700 font-semibold"><b>Email:</b> <span className="font-normal">{profile.email}</span></div>
        </div>
      </div>
    </div>
  );
} 