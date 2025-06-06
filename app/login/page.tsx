"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Lock, User, AlertCircle, Bell } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"

type Role = "admin" | "supervisor" | "manager"

interface LoginCredentials {
  email: string
  password: string
  role: Role
}

// Mock credentials for demo purposes
const MOCK_CREDENTIALS: Record<Role, LoginCredentials> = {
  admin: {
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
  supervisor: {
    email: "supervisor@example.com",
    password: "super123",
    role: "supervisor",
  },
  manager: {
    email: "manager@example.com",
    password: "manager123",
    role: "manager",
  }
 
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<Role>("admin")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [mounted, setMounted] = useState(false)

  
  useEffect(() => {
    setMounted(true)
  }, [])

   // Auto-fill credentials when page loads initially
 useEffect(() => {
    setEmail(MOCK_CREDENTIALS[role].email)
    setPassword(MOCK_CREDENTIALS[role].password)
  }, []) 
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

  
    await new Promise((resolve) => setTimeout(resolve, 1000))


    const mockUser = MOCK_CREDENTIALS[role]
    if (mockUser && mockUser.email === email && mockUser.password === password) {
      
      switch (role) {
        case "admin":
          router.push("/admin")
          break
        case "supervisor":
          router.push("/supervisor/alerts")
          break
        case "manager":
         
          router.push("/")
          break
      
      }
    } else {
      setError("Email hoặc mật khẩu không chính xác")
      setLoading(false)
    }
  }

  // Auto-fill credentials when role changes 
  const handleRoleChange = (selectedRole: Role) => {
    setRole(selectedRole)
    setEmail(MOCK_CREDENTIALS[selectedRole].email)
    setPassword(MOCK_CREDENTIALS[selectedRole].password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 overflow-hidden relative pb-48">
      {/* Abstract background shapes */}
      {/* <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -right-20 w-80 h-80 bg-purple-400 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
      </div> */}

      <div 
        className={`w-full max-w-md z-10 transition-all duration-700 ease-out transform ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        {/* <div className="flex justify-center mb-8">
          {/* <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-3 transform hover:rotate-3 transition-transform">
              <Bell className="w-10 h-10 text-white" />
            </div>
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Alert System
            </div>
          </div> */}
        

        <Card className="border-0 shadow-xl backdrop-blur-sm bg-white/90">
          <CardHeader className="space-y-1 text-center pb-4">
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Đăng nhập</CardTitle>
            <CardDescription>Nhập thông tin đăng nhập để truy cập hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-5 animate-shake">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium ">Vai trò</Label>
                <Select value={role} onValueChange={handleRoleChange}>
                  <SelectTrigger className="bg-gray-50 border-gray-100 focus:ring-2 focus:ring-blue-500/20 h-11 transition-all">
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent >
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-blue-100 p-1.5 rounded-md text-blue-600">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-11 bg-gray-50 border-gray-100 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Mật khẩu</Label>
                  <Button variant="link" className="p-0 h-auto text-xs text-blue-600 font-medium">
                    Quên mật khẩu?
                  </Button>
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-blue-100 p-1.5 rounded-md text-blue-600">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 h-11 bg-gray-50 border-gray-100 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember-me" 
                  checked={rememberMe} 
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember-me"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg shadow-blue-500/20" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang đăng nhập...
                  </div>
                ) : "Đăng nhập"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t pt-4">
            <div className="text-sm text-center text-gray-500">
              <p className="font-medium mb-1">Thông tin đăng nhập demo</p>
              <div className="text-xs text-gray-400 mt-1 p-2 bg-gray-50 rounded-md">
                <div className="flex justify-between items-center mb-1">
                  <span>Email:</span>
                  <span className="font-mono">{MOCK_CREDENTIALS[role].email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Mật khẩu:</span>
                  <span className="font-mono">{MOCK_CREDENTIALS[role].password}</span>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
        
        <div className="text-center mt-6 text-xs text-gray-500">
          © {new Date().getFullYear()} Alert System • <span className="text-blue-600">Chính sách bảo mật</span>
        </div>
      </div>
    </div>
  )
}
