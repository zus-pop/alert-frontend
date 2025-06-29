"use client"

import { useState, FormEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import toastService from "@/services/toast"
import { MOCK_CREDENTIALS } from "@/constants/mock-credentials"

const MOCK_CREDENTIALS = {
  admin: {
    email: "admin@example.com",
    password: "password123"
  },
  supervisor: {
    email: "supervisor@example.com",
    password: "password456"
  }
}

export default function WelcomePage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const { login, loading, error } = useAuth()
          
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="w-full h-full flex flex-col md:flex-row max-w-6xl shadow-2xl rounded-2xl overflow-hidden">
        <div className="w-full md:w-1/2 bg-gradient-to-br from-[#00B4D8] to-[#0096c7] p-8 flex flex-col items-center justify-center relative text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/20 rounded-full -ml-20 -mb-20"></div>
          
          <div className="relative z-10 max-w-md text-center">
            <Image 
              src="/amico.svg" 
              width={240} 
              height={200} 
              alt="Welcome" 
              priority
              className="mx-auto mb-8 drop-shadow-lg" 
            />
            <h1 className="text-4xl font-bold mb-4">EWS</h1>
            <h2 className="text-2xl font-medium mb-2">Early Warning System</h2>
            <p className="text-white/80 text-lg">
              Track, manage, and respond to alerts efficiently with our comprehensive early warning system.
            </p>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 bg-white p-8 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
              <p className="text-gray-600">Please sign in to your account</p>
            </div>
            
            <form className="space-y-6" onSubmit={(e: FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              login(email, password);
              if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
              } else {
                localStorage.removeItem('rememberedEmail');
              }
            }}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-4">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <Mail size={18} />
                  </div>
                  <Input 
                    id="email" 
                    placeholder="name@example.com" 
                    type="email" 
                    className="pl-10 h-12" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Link href="#" className="text-xs text-[#00B4D8] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <Lock size={18} />
                  </div>
                  <Input 
                    id="password" 
                    placeholder="••••••••" 
                    type={showPassword ? "text" : "password"} 
                    className="pl-10 h-12 pr-10" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
              </div>
              
              <Button 
                disabled={loading} 
                className="w-full h-12 bg-[#00B4D8] hover:bg-[#0096c7] font-medium"
                type="submit"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
              
              {/* <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-300/30"></div>
                <span className="flex-shrink mx-4 text-xs text-gray-500">or continue with</span>
                <div className="flex-grow border-t border-gray-300/30"></div>
              </div> */}
              
              {/* <div className="flex justify-center">
                <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-gray-300">
                  <Image src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000" width={20} height={20} alt="Google" />
                </Button>
              </div> */}
            </form>
            
            <div className="text-center mt-6">
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <Link href="/login/signup" className="text-[#00B4D8] font-semibold hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
            
            <div className="flex justify-between text-xs text-gray-500 mt-8">
              <Link href="#" className="hover:underline">Privacy Policy</Link>
              <Link href="#" className="hover:underline">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
