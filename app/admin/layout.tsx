'use client'

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Users, UserCog, Shield, Settings, BookOpen, SwatchBook } from "lucide-react"
import { useSystemUsers } from '@/hooks/useSystemUsers'
import { useSubjects } from '@/hooks/useSubjects'
import { useSemesters } from '@/hooks/useSemesters'
import ProtectedRoute from "@/components/ProtectedRoute"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch counts from APIs
  const [counts, setCounts] = useState({
    users: 0,
    subjects: 0,
    semesters: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Use the hooks to fetch data with minimal request size for counts only
  const { 
    data: userData, 
    isLoading: isLoadingUsers,
    error: userError 
  } = useSystemUsers({ page: 1, limit: 1 });
  
  const { 
    data: subjectsData, 
    isLoading: isLoadingSubjects,
    error: subjectsError 
  } = useSubjects({ page: 1, limit: 1 });
  
  const { 
    data: semestersData, 
    isLoading: isLoadingSemesters,
    error: semestersError 
  } = useSemesters({ page: 1, limit: 1 });

  // Update counts when data is loaded
  useEffect(() => {
    const newCounts = {
      users: userData?.totalItems || 0,
      subjects: subjectsData?.totalItems || 0,
      semesters: semestersData?.totalItems || 0
    };
    setCounts(newCounts);
    
    // Update loading state when all data is fetched
    if (!isLoadingUsers && !isLoadingSubjects && !isLoadingSemesters) {
      setIsLoading(false);
    }
  }, [userData, subjectsData, semestersData, isLoadingUsers, isLoadingSubjects, isLoadingSemesters]);

  // Create navigation items with dynamic badges
  const adminNavItems = [
    // Commented out items are kept for reference
    // {
    //   href: "/admin/students",
    //   label: "Students",
    //   icon: <Users className="w-4 h-4" />,
    //   badge: 45,
    // },
    // {
    //   href: "/admin/managers",
    //   label: "Managers",
    //   icon: <UserCog className="w-4 h-4" />,
    //   badge: 8,
    // },
    // {
    //   href: "/admin/supervisors",
    //   label: "Supervisors",
    //   icon: <Shield className="w-4 h-4" />,
    //   badge: 12,
    // },
    {
      href: "/admin/system-users",
      label: "System Users",
      icon: <Settings className="w-4 h-4" />,
      badge: isLoading ? undefined : counts.users,
      badgeVariant: userError ? "destructive" as const : "secondary" as const,
    },
    {
      href: "/admin/subjects",
      label: "Subjects",
      icon: <BookOpen className="w-4 h-4" />,
      badge: isLoading ? undefined : counts.subjects,
      badgeVariant: subjectsError ? "destructive" as const : "secondary" as const,
    },
    {
      href: "/admin/semesters",
      label: "Semesters",
      icon: <SwatchBook className="w-4 h-4" />,
      badge: isLoading ? undefined : counts.semesters,
      badgeVariant: semestersError ? "destructive" as const : "secondary" as const,
    },
  ]

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar
          title="Admin Dashboard"
          subtitle="Managing AI-Generated Alerts and Student Assistance Requests"
          role="admin"
          navItems={adminNavItems}
        />
        <main className="max-w-screen-2xl mx-auto p-6">{children}</main>
      </div>
    </ProtectedRoute>
  )
}
