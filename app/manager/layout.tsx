import type React from "react"
import { Navbar } from "@/components/navbar"
import { AlertTriangle, MessageSquare, BarChart3 } from "lucide-react"


  

export default function SupervisorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
      <Navbar
        title="Manager Dashboard"
        subtitle="Quản lý thông tin sinh viên"
        role="supervisor"
        
      />
      <main className="max-w-7xl mx-auto p-6">{children}</main>
    </div>
  )
}
