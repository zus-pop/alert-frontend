import type React from "react"
import { Navbar } from "@/components/navbar"
import { AlertTriangle, MessageSquare, BarChart3 } from "lucide-react"

const supervisorNavItems = [
  {
    href: "/manager/StudentForm",
    label: "Cảnh báo",
    icon: <AlertTriangle className="w-4 h-4" />,
    badge: 5,
  },
  {
    href: "/manager/StudentManager",
    label: "Phản hồi",
    icon: <MessageSquare className="w-4 h-4" />,
    badge: 12,
  },
  {
    href: "/manager/",
    label: "Thống kê",
    icon: <BarChart3 className="w-4 h-4" />,
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
        title="Supervisor Dashboard"
        subtitle="Xử lý cảnh báo AI và hỗ trợ học sinh"
        role="supervisor"
        navItems={supervisorNavItems}
      />
      <main className="max-w-7xl mx-auto p-6">{children}</main>
    </div>
  )
}
