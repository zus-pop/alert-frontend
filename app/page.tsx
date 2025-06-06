import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Users, AlertTriangle } from "lucide-react"
import Login from "./login/page"
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className=" mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Early Warning System</h1>
          <p className="text-lg text-gray-600">Chọn vai trò của bạn để truy cập dashboard tương ứng</p>
          <div className="mt-6">
            {/* <Link href="/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Đăng nhập vào hệ thống
              </Button>
            </Link> */}
            <Login/>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
              <CardDescription>Quản lý người dùng và phân quyền hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 mb-6 space-y-2">
                <li>• Quản lý tài khoản người dùng</li>
                <li>• Phân quyền roles (Student, Manager, Supervisor)</li>
                <li>• Theo dõi hoạt động hệ thống</li>
              </ul>
              <Link href="/admin">
                <Button className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Truy cập Admin Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-2xl">Supervisor Dashboard</CardTitle>
              <CardDescription>Xử lý cảnh báo AI và hỗ trợ học sinh</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 mb-6 space-y-2">
                <li>• Nhận cảnh báo từ hệ thống AI</li>
                <li>• Đưa ra lời khuyên cho học sinh</li>
                <li>• Tạo kế hoạch hỗ trợ cá nhân</li>
              </ul>
              <Link href="/supervisor/alerts">
                <Button className="w-full" variant="outline">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Truy cập Supervisor Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
