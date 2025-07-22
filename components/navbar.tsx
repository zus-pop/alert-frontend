"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Bell, Settings, LogOut, User, Shield } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

interface NavItemProps {
  href: string
  label: string
  icon?: React.ReactNode
  badge?: number
  badgeVariant?: "default" | "destructive" | "outline" | "secondary"
}

interface NavbarProps {
  title: string
  subtitle?: string
  role?: "admin" | "manager" | "supervisor"
  navItems?: Array<NavItemProps>
}

export function Navbar({ title, subtitle, role, navItems }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const { user, logout } = useAuth()
console.log("User in Navbar:", user)
  // Extract first and last initial for avatar fallback
  const getInitials = () => {
    if (!user?.firstName && !user?.lastName) return "U"

    const names = [user?.firstName, user?.lastName].filter(Boolean)
    return names.map(name => name?.charAt(0).toUpperCase()).join("")
  }


  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-6">
        {/* Top Header */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">Early Warning System</span>
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
              {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-4">
          

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.image} alt="Avatar" />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">

                    <p className="text-sm font-medium leading-none">{`${user?.firstName} ${user?.lastName}` || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    <p className="text-xs leading-none text-muted-foreground capitalize">
                      {user?.role?.toLowerCase()}

                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => 
                    router.push("/profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Setting</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Navigation Menu */}
        {navItems && navItems.length > 0 && (
          <div className="border-t border-gray-100">
            <nav className="flex space-x-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                      isActive
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                    {item.badge && item.badge > 0 && (
                      <Badge
                        variant={item.badgeVariant || "secondary"}
                        className={`ml-1 ${
                          item.badgeVariant === "destructive"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}
