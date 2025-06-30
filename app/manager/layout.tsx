import type React from "react"
import { Navbar } from "@/components/navbar"
import { AlertTriangle, MessageSquare, BarChart3, Users, BookOpen, ClipboardList, CheckSquare } from "lucide-react"

const supervisorNavItems = [
  {
    href: "/manager/studentmanager",
    label: "Quản lý sinh viên",
    icon: <Users className="w-4 h-4" />,
  },
  {
    href: "/manager/subjectmanager",
    label: "Quản lý môn học",
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    href: "/manager/enrollmentmanager",
    label: "Quản lý đăng ký môn",
    icon: <ClipboardList className="w-4 h-4" />,
  },
  {
    href: "/manager/attendancemanager",
    label: "Quản lý điểm danh",
    icon: <CheckSquare className="w-4 h-4" />,
  },
]

export default function SupervisorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
      <Navbar
        title="Manager Dashboard"
        subtitle="Quản lý sinh viên và môn học"
        role="supervisor"
        navItems={supervisorNavItems}
      />
      <main className="max-w-7xl mx-auto p-6">{children}</main>
    </div>
  )
}
