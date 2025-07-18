'use client'

import type React from "react"
import { Navbar } from "@/components/navbar"

import { AlertTriangle, MessageSquare, BarChart3, Users, BookOpen, ClipboardList, Layers } from "lucide-react"
import ProtectedRoute from "@/components/ProtectedRoute"


const supervisorNavItems = [
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
    href: "/manager/coursemanager",
    label: "Course Management",
    icon: <Layers className="w-4 h-4" />,
  },
]

export default function SupervisorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={["MANAGER"]}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
        <Navbar
          title="Manager Dashboard"
          subtitle="Managing AI-Generated Alerts and Student Assistance Requests"
          role="supervisor"
          navItems={supervisorNavItems}
        />
        <main className="max-w-7xl mx-auto p-6">{children}</main>
      </div>
    </ProtectedRoute>

  )
}
