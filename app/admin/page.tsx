"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserCog, Shield, TrendingUp, Activity, AlertCircle, BookOpen, Package } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const stats = {
    totalUsers: 65,
    students: 45,
    managers: 8,
    supervisors: 12,
    activeUsers: 58,
    newThisMonth: 7,
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Admin Dashboard</h2>
        <p className="text-gray-600">
          Manage the entire user system and permissions. Select one of the tabs above to get started.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-blue-100">+{stats.newThisMonth} this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Active</p>
                <p className="text-3xl font-bold">{stats.activeUsers}</p>
              </div>
              <Activity className="w-8 h-8 text-emerald-200" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-emerald-100">
                {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% of total
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Supervisors</p>
                <p className="text-3xl font-bold">{stats.supervisors}</p>
              </div>
              <Shield className="w-8 h-8 text-purple-200" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-purple-100">Managers: {stats.managers}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Need Attention</p>
                <p className="text-3xl font-bold">{stats.totalUsers - stats.activeUsers}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-200" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-orange-100">Inactive accounts</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/admin/students">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Manage Students</CardTitle>
              <CardDescription>Manage student accounts and information</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.students}</div>
              <p className="text-sm text-gray-600">active students</p>
              <Button className="w-full mt-4" variant="outline">
                View Details
              </Button>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/admin/managers">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <UserCog className="w-8 h-8 text-emerald-600" />
              </div>
              <CardTitle className="text-xl">Manage Managers</CardTitle>
              <CardDescription>Manage manager accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">{stats.managers}</div>
              <p className="text-sm text-gray-600">active managers</p>
              <Button className="w-full mt-4" variant="outline">
                View Details
              </Button>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/admin/supervisors">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Manage Supervisors</CardTitle>
              <CardDescription>Manage supervisor accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.supervisors}</div>
              <p className="text-sm text-gray-600">active supervisors</p>
              <Button className="w-full mt-4" variant="outline">
                View Details
              </Button>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/admin/subjects">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-amber-600" />
              </div>
              <CardTitle className="text-xl">Manage Subjects</CardTitle>
              <CardDescription>Manage subject information</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-gray-600 mb-2">View and manage all subjects in the system</div>
              <Button className="w-full mt-4" variant="outline">
                View Details
              </Button>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/admin/combos">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-indigo-600">
                  <path d="M16.5 9.4 7.5 4.21"></path>
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <path d="M3.27 6.96 12 12.01l8.73-5.05"></path>
                  <path d="M12 22.08V12"></path>
                </svg>
              </div>
              <CardTitle className="text-xl">Manage Combos</CardTitle>
              <CardDescription>Manage combo packages</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-gray-600 mb-2">View and manage all combos in the system</div>
              <Button className="w-full mt-4" variant="outline">
                View Details
              </Button>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Role Distribution</CardTitle>
            <CardDescription>User ratio by role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{stats.students}</span>
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${(stats.students / stats.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm font-medium">Managers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{stats.managers}</span>
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-emerald-500 rounded-full"
                      style={{ width: `${(stats.managers / stats.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium">Supervisors</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{stats.supervisors}</span>
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-purple-500 rounded-full"
                      style={{ width: `${(stats.supervisors / stats.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Latest changes in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New Student created</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Manager permissions updated</p>
                  <p className="text-xs text-gray-500">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Supervisor disabled</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  
  )
}
