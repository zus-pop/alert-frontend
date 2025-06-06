"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  UserPlus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  Download,
  Upload,
  RefreshCw,
  Shield,
  AlertTriangle,
  MessageSquare,
} from "lucide-react"

interface Supervisor {
  id: string
  name: string
  email: string
  employeeId: string
  department: string
  specialization: string
  status: "active" | "inactive"
  alertsHandled: number
  studentsSupervised: number
  createdAt: string
  lastLogin: string
}

const mockSupervisors: Supervisor[] = [
  {
    id: "1",
    name: "Trần Thị B",
    email: "tranthib@email.com",
    employeeId: "SP001",
    department: "Quản lý giáo dục",
    specialization: "Tâm lý học sinh",
    status: "active",
    alertsHandled: 25,
    studentsSupervised: 45,
    createdAt: "2024-01-10",
    lastLogin: "2024-01-20T09:15:00Z",
  },
  {
    id: "2",
    name: "Hoàng Văn E",
    email: "hoangvane@email.com",
    employeeId: "SP002",
    department: "Tâm lý học",
    specialization: "Tư vấn học tập",
    status: "active",
    alertsHandled: 18,
    studentsSupervised: 32,
    createdAt: "2024-01-03",
    lastLogin: "2024-01-20T08:00:00Z",
  },
  {
    id: "3",
    name: "Phạm Văn G",
    email: "phamvang@email.com",
    employeeId: "SP003",
    department: "Quản lý giáo dục",
    specialization: "Hành vi học sinh",
    status: "inactive",
    alertsHandled: 12,
    studentsSupervised: 28,
    createdAt: "2024-01-01",
    lastLogin: "2024-01-19T15:30:00Z",
  },
]

export default function SupervisorsPage() {
  const [supervisors, setSupervisors] = useState<Supervisor[]>(mockSupervisors)
  const [isAddSupervisorOpen, setIsAddSupervisorOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [newSupervisor, setNewSupervisor] = useState({
    name: "",
    email: "",
    employeeId: "",
    department: "",
    specialization: "",
  })

  const handleAddSupervisor = () => {
    const supervisor: Supervisor = {
      id: Date.now().toString(),
      ...newSupervisor,
      status: "active",
      alertsHandled: 0,
      studentsSupervised: 0,
      createdAt: new Date().toISOString().split("T")[0],
      lastLogin: new Date().toISOString(),
    }
    setSupervisors([...supervisors, supervisor])
    setNewSupervisor({ name: "", email: "", employeeId: "", department: "", specialization: "" })
    setIsAddSupervisorOpen(false)
  }

  const handleStatusToggle = (supervisorId: string) => {
    setSupervisors(
      supervisors.map((supervisor) =>
        supervisor.id === supervisorId
          ? { ...supervisor, status: supervisor.status === "active" ? "inactive" : "active" }
          : supervisor,
      ),
    )
  }

  const handleDeleteSupervisor = (supervisorId: string) => {
    setSupervisors(supervisors.filter((supervisor) => supervisor.id !== supervisorId))
  }

  const filteredSupervisors = supervisors.filter((supervisor) => {
    const matchesSearch =
      supervisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supervisor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supervisor.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === "all" || supervisor.department === filterDepartment
    const matchesStatus = filterStatus === "all" || supervisor.status === filterStatus
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const stats = {
    total: supervisors.length,
    active: supervisors.filter((s) => s.status === "active").length,
    inactive: supervisors.filter((s) => s.status === "inactive").length,
    totalAlertsHandled: supervisors.reduce((sum, s) => sum + s.alertsHandled, 0),
    totalStudentsSupervised: supervisors.reduce((sum, s) => sum + s.studentsSupervised, 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Supervisors</h2>
          <p className="text-gray-600">Quản lý tài khoản và quyền hạn giám sát</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Xuất dữ liệu
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Nhập dữ liệu
          </Button>
          <Dialog open={isAddSupervisorOpen} onOpenChange={setIsAddSupervisorOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Thêm giám sát viên
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Thêm giám sát viên mới</DialogTitle>
                <DialogDescription>Tạo tài khoản giám sát viên mới trong hệ thống</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Họ và tên *</Label>
                  <Input
                    id="name"
                    value={newSupervisor.name}
                    onChange={(e) => setNewSupervisor({ ...newSupervisor, name: e.target.value })}
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newSupervisor.email}
                    onChange={(e) => setNewSupervisor({ ...newSupervisor, email: e.target.value })}
                    placeholder="Nhập địa chỉ email"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="employeeId">Mã nhân viên *</Label>
                  <Input
                    id="employeeId"
                    value={newSupervisor.employeeId}
                    onChange={(e) => setNewSupervisor({ ...newSupervisor, employeeId: e.target.value })}
                    placeholder="Nhập mã nhân viên"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Phòng ban</Label>
                  <Select
                    value={newSupervisor.department}
                    onValueChange={(value) => setNewSupervisor({ ...newSupervisor, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phòng ban" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Quản lý giáo dục">Quản lý giáo dục</SelectItem>
                      <SelectItem value="Tâm lý học">Tâm lý học</SelectItem>
                      <SelectItem value="Tư vấn học tập">Tư vấn học tập</SelectItem>
                      <SelectItem value="Hỗ trợ sinh viên">Hỗ trợ sinh viên</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="specialization">Chuyên môn</Label>
                  <Select
                    value={newSupervisor.specialization}
                    onValueChange={(value) => setNewSupervisor({ ...newSupervisor, specialization: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn chuyên môn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tâm lý học sinh">Tâm lý học sinh</SelectItem>
                      <SelectItem value="Tư vấn học tập">Tư vấn học tập</SelectItem>
                      <SelectItem value="Hành vi học sinh">Hành vi học sinh</SelectItem>
                      <SelectItem value="Hỗ trợ học tập">Hỗ trợ học tập</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddSupervisorOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAddSupervisor} className="bg-purple-600 hover:bg-purple-700">
                  Tạo tài khoản
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng giám sát viên</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tạm nghỉ</p>
                <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
              </div>
              <UserCheck className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cảnh báo xử lý</p>
                <p className="text-2xl font-bold text-orange-600">{stats.totalAlertsHandled}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Học sinh giám sát</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalStudentsSupervised}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supervisors Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Danh sách giám sát viên</CardTitle>
              <CardDescription>Quản lý thông tin và quyền hạn của các giám sát viên</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Làm mới
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm theo tên, email hoặc mã nhân viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Phòng ban" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phòng ban</SelectItem>
                <SelectItem value="Quản lý giáo dục">Quản lý giáo dục</SelectItem>
                <SelectItem value="Tâm lý học">Tâm lý học</SelectItem>
                <SelectItem value="Tư vấn học tập">Tư vấn học tập</SelectItem>
                <SelectItem value="Hỗ trợ sinh viên">Hỗ trợ sinh viên</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Tạm nghỉ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold">Giám sát viên</TableHead>
                  <TableHead className="font-semibold">Mã NV</TableHead>
                  <TableHead className="font-semibold">Phòng ban</TableHead>
                  <TableHead className="font-semibold">Chuyên môn</TableHead>
                  <TableHead className="font-semibold">Cảnh báo</TableHead>
                  <TableHead className="font-semibold">Học sinh</TableHead>
                  <TableHead className="font-semibold">Trạng thái</TableHead>
                  <TableHead className="font-semibold">Đăng nhập cuối</TableHead>
                  <TableHead className="font-semibold text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSupervisors.map((supervisor) => (
                  <TableRow key={supervisor.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{supervisor.name}</div>
                        <div className="text-sm text-gray-500">{supervisor.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {supervisor.employeeId}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{supervisor.department}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {supervisor.specialization}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium">{supervisor.alertsHandled}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">{supervisor.studentsSupervised}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          supervisor.status === "active"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }
                      >
                        {supervisor.status === "active" ? "Hoạt động" : "Tạm nghỉ"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {new Date(supervisor.lastLogin).toLocaleString("vi-VN")}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusToggle(supervisor.id)}>
                            <UserCheck className="w-4 h-4 mr-2" />
                            {supervisor.status === "active" ? "Tạm nghỉ" : "Kích hoạt"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteSupervisor(supervisor.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredSupervisors.length === 0 && (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy giám sát viên</h3>
              <p className="text-gray-600">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
