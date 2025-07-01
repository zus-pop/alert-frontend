"use client";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getSystemUserById, SystemUser } from "@/services/systemUserApi";
import { Navbar } from "@/components/navbar";
import { Users, BookOpen, ClipboardList, CheckSquare, Settings, SwatchBook, AlertTriangle, MessageSquare, BarChart3, Camera } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://ai-alert-5ea310f83e0b.herokuapp.com/api";

export default function ProfilePage() {
  const { user, loading: authLoading, error: authError } = useAuth();
  const [profile, setProfile] = useState<SystemUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        { href: "/admin/system-users", label: "System Users", icon: <Settings className="w-4 h-4" /> },
        { href: "/admin/subjects", label: "Subjects", icon: <BookOpen className="w-4 h-4" /> },
        { href: "/admin/semesters", label: "Semesters", icon: <SwatchBook className="w-4 h-4" /> },
      ];
    } else if (user?.role === "MANAGER") {
      return [
        { href: "/manager/studentmanager", label: "Student Management", icon: <Users className="w-4 h-4" /> },
        { href: "/manager/subjectmanager", label: "Subject Management", icon: <BookOpen className="w-4 h-4" /> },
        { href: "/manager/enrollmentmanager", label: "Course Enrollment Management", icon: <ClipboardList className="w-4 h-4" /> },
        { href: "/manager/attendancemanager", label: "Attendance Management", icon: <CheckSquare className="w-4 h-4" /> },
      ];
    } else if (user?.role === "SUPERVISOR") {
      return [
        { href: "/supervisor/alerts", label: "Cảnh báo", icon: <AlertTriangle className="w-4 h-4" /> },
        { href: "/supervisor/responses", label: "Phản hồi", icon: <MessageSquare className="w-4 h-4" /> },
        { href: "/supervisor/analytics", label: "Thống kê", icon: <BarChart3 className="w-4 h-4" /> },
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
  const navRole = user?.role === "ADMIN"
    ? "admin"
    : user?.role === "MANAGER"
    ? "manager"
    : user?.role === "SUPERVISOR"
    ? "supervisor"
    : undefined;

  // Hàm upload avatar
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      // Lấy token từ localStorage
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      const res = await fetch(`${API_URL}/auth/me`, {
        method: "PATCH",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      // Sau khi upload thành công, reload lại profile
      if (user?.id) {
        const updated = await getSystemUserById(user.id);
        setProfile(updated);
      }
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (authLoading || loading) return <div className="p-8 bg-white min-h-screen"><Navbar title={navTitle} subtitle={navSubtitle} role={navRole} navItems={navItems} /><div className="mt-8">Loading profile...</div></div>;
  if (authError || error) return <div className="p-8 text-red-500 bg-white min-h-screen"><Navbar title={navTitle} subtitle={navSubtitle} role={navRole} navItems={navItems} /><div className="mt-8">{authError || error}</div></div>;
  if (!profile) return <div className="p-8 text-gray-500 bg-white min-h-screen"><Navbar title={navTitle} subtitle={navSubtitle} role={navRole} navItems={navItems} /><div className="mt-8">No profile information found.</div></div>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar title={navTitle} subtitle={navSubtitle} role={navRole} navItems={navItems} />
      <div className="flex items-center justify-center py-12">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center border-2 border-gray-100 transition-shadow duration-300 hover:shadow-2xl relative">
          {/* Avatar với border gradient và nút upload icon */}
          <div className="relative mb-4">
            <div className="w-40 h-40 rounded-full border-4 border-transparent bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 p-1 mx-auto flex items-center justify-center shadow-lg">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-5xl text-gray-400 font-bold">{profile.firstName?.[0] || profile.lastName?.[0] || "?"}</span>
                )}
              </div>
            </div>
            {/* Nút upload icon */}
            <label className="absolute bottom-2 right-2 cursor-pointer bg-white rounded-full shadow-md p-2 border border-gray-200 hover:bg-blue-600 group transition-colors">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleUpload}
                disabled={uploading}
              />
              <Camera className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
            </label>
          </div>
          {/* Thông tin user */}
          <div className="text-2xl font-bold mb-2 text-gray-900">{profile.lastName} {profile.firstName}</div>
          <span className={`inline-block px-3 py-1 mb-2 rounded-full text-sm font-semibold ${profile.role === "ADMIN" ? "bg-blue-100 text-blue-800" : profile.role === "MANAGER" ? "bg-green-100 text-green-800" : "bg-purple-100 text-purple-800"}`}>{profile.role}</span>
          <div className="mb-1 text-lg text-gray-700 font-semibold"><b>Email:</b> <span className="font-normal">{profile.email}</span></div>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
      </div>
    </div>
  );
} 