"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserCog, Shield, TrendingUp, Activity, AlertCircle } from "lucide-react"
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Chào mừng đến với Admin Dashboard</h2>
        <p className="text-gray-600">
          Quản lý toàn bộ hệ thống người dùng và phân quyền. Chọn một trong các tab bên trên để bắt đầu.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Tổng người dùng</p>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-blue-100">+{stats.newThisMonth} tháng này</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Đang hoạt động</p>
                <p className="text-3xl font-bold">{stats.activeUsers}</p>
              </div>
              <Activity className="w-8 h-8 text-emerald-200" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-emerald-100">
                {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% tổng số
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Giám sát viên</p>
                <p className="text-3xl font-bold">{stats.supervisors}</p>
              </div>
              <Shield className="w-8 h-8 text-purple-200" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-purple-100">Quản lý: {stats.managers}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Cần chú ý</p>
                <p className="text-3xl font-bold">{stats.totalUsers - stats.activeUsers}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-200" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-orange-100">Tài khoản không hoạt động</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/admin/students">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Quản lý Students</CardTitle>
              <CardDescription>Quản lý tài khoản và thông tin học sinh</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.students}</div>
              <p className="text-sm text-gray-600">học sinh đang hoạt động</p>
              <Button className="w-full mt-4" variant="outline">
                Xem chi tiết
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
              <CardTitle className="text-xl">Quản lý Managers</CardTitle>
              <CardDescription>Quản lý tài khoản và quyền hạn quản lý</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">{stats.managers}</div>
              <p className="text-sm text-gray-600">quản lý đang hoạt động</p>
              <Button className="w-full mt-4" variant="outline">
                Xem chi tiết
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
              <CardTitle className="text-xl">Quản lý Supervisors</CardTitle>
              <CardDescription>Quản lý tài khoản và quyền hạn giám sát</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.supervisors}</div>
              <p className="text-sm text-gray-600">giám sát viên đang hoạt động</p>
              <Button className="w-full mt-4" variant="outline">
                Xem chi tiết
              </Button>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Phân bố vai trò</CardTitle>
            <CardDescription>Tỷ lệ người dùng theo từng vai trò</CardDescription>
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
            <CardTitle className="text-lg">Hoạt động gần đây</CardTitle>
            <CardDescription>Các thay đổi mới nhất trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Student mới được tạo</p>
                  <p className="text-xs text-gray-500">2 phút trước</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Cập nhật quyền Manager</p>
                  <p className="text-xs text-gray-500">15 phút trước</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Supervisor bị vô hiệu hóa</p>
                  <p className="text-xs text-gray-500">1 giờ trước</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
