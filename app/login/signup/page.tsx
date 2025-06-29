"use client"

import Image from "next/image"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react"
import Link from "next/link"

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#00B4D8] to-[#0096c7] p-4">
      <Card className="w-full max-w-md border-none shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/20 rounded-full -ml-20 -mb-20"></div>
        
        <CardHeader className="text-center relative">
          <div className="mx-auto -mt-16 bg-white rounded-full p-2 w-32 h-32 flex items-center justify-center shadow-md mb-2">
            <Image 
              src="/amico.svg" 
              width={100} 
              height={100} 
              alt="Sign Up"
              priority
              className="object-contain" 
            />
          </div>
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Join us today and get started</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <User size={18} />
              </div>
              <Input 
                id="name" 
                placeholder="John Doe" 
                className="pl-10 h-12" 
                required 
              />
            </div>
          </div>
          
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
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
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
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <Lock size={18} />
              </div>
              <Input 
                id="confirmPassword" 
                placeholder="••••••••" 
                type={showConfirmPassword ? "text" : "password"} 
                className="pl-10 h-12 pr-10" 
                required 
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <Button className="w-full h-12 bg-[#00B4D8] hover:bg-[#0096c7] font-medium mt-2">
            Create Account
          </Button>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4 pt-0">
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/" className="text-[#00B4D8] font-medium hover:underline">
              Sign In
            </Link>
          </div>
          
          <p className="text-xs text-center text-muted-foreground px-6">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
