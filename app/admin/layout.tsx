import type React from "react"
import { Navbar } from "@/components/navbar"
import { Users, UserCog, Shield } from "lucide-react"

const adminNavItems = [
  {
    href: "/admin/students",
    label: "Students",
    icon: <Users className="w-4 h-4" />,
    badge: 45,
  },
  {
    href: "/admin/managers",
    label: "Managers",
    icon: <UserCog className="w-4 h-4" />,
    badge: 8,
  },
  {
    href: "/admin/supervisors",
    label: "Supervisors",
    icon: <Shield className="w-4 h-4" />,
    badge: 12,
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar
        title="Admin Dashboard"
        subtitle="Quản lý người dùng và phân quyền hệ thống"
        role="admin"
        navItems={adminNavItems}
      />
      <main className="max-w-7xl mx-auto p-6">{children}</main>
    </div>
  )
}
