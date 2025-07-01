'use client'

import type React from "react"
import { Navbar } from "@/components/navbar"
import { AlertTriangle, MessageSquare, BarChart3 } from "lucide-react"
import ProtectedRoute from "@/components/ProtectedRoute"

const supervisorNavItems = [
  {
    href: "/supervisor/alerts",
    label: "Alerts",
    icon: <AlertTriangle className="w-4 h-4" />,
    // badge: 5,
  },
  // {
  //   href: "/supervisor/responses",
  //   label: "Phản hồi",
  //   icon: <MessageSquare className="w-4 h-4" />,
  //   badge: 12,
  // },
  {
    href: "/supervisor/analytics",
    label: "Analytics",
    icon: <BarChart3 className="w-4 h-4" />,
  },
]

export default function SupervisorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={["SUPERVISOR"]}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
        <Navbar
          title="Supervisor Dashboard"
          subtitle="Managing AI-Generated Alerts and Student Assistance Requests"
          role="supervisor"
          navItems={supervisorNavItems}
        />
        <main className="max-w-7xl mx-auto p-6">{children}</main>
      </div>
    </ProtectedRoute>
  )
}
