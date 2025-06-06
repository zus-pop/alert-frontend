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
  UserCog,
  Building,
  Users,
} from "lucide-react"

interface Manager {
  id: string
  name: string
  email: string
  employeeId: string
  department: string
  position: string
  status: "active" | "inactive"
  teamSize: number
  createdAt: string
  lastLogin: string
}

const mockManagers: Manager[] = [
  {
    id: "1",
    name: "Lê Văn C",
    email: "levanc@email.com",
    employeeId: "MG001",
    department: "Hành chính",
    position: "Trưởng phòng",
    status: "active",
    teamSize: 12,
    createdAt: "2024-01-08",
    lastLogin: "2024-01-20T14:20:00Z",
  },
  {
    id: "2",
    name: "Nguyễn Thị E",
    email: "nguyenthie@email.com",
    employeeId: "MG002",
    department: "Đào tạo",
    position: "Phó trưởng phòng",
    status: "active",
    teamSize: 8,
    createdAt: "2024-01-12",
    lastLogin: "2024-01-20T11:30:00Z",
  },
  {
    id: "3",
    name: "Trần Văn F",
    email: "tranvanf@email.com",
    employeeId: "MG003",
    department: "Tài chính",
    position: "Trưởng phòng",
    status: "inactive",
    teamSize: 6,
    createdAt: "2024-01-05",
    lastLogin: "2024-01-18T09:15:00Z",
  },
]

export default function ManagersPage() {
  const [managers, setManagers] = useState<Manager[]>(mockManagers)
  const [isAddManagerOpen, setIsAddManagerOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [newManager, setNewManager] = useState({
    name: "",
    email: "",
    employeeId: "",
    department: "",
    position: "",
  })

  const handleAddManager = () => {
    const manager: Manager = {
      id: Date.now().toString(),
      ...newManager,
      status: "active",
      teamSize: 0,
      createdAt: new Date().toISOString().split("T")[0],
      lastLogin: new Date().toISOString(),
    }
    setManagers([...managers, manager])
    setNewManager({ name: "", email: "", employeeId: "", department: "", position: "" })
    setIsAddManagerOpen(false)
  }

  const handleStatusToggle = (managerId: string) => {
    setManagers(
      managers.map((manager) =>
        manager.id === managerId
          ? { ...manager, status: manager.status === "active" ? "inactive" : "active" }
          : manager,
      ),
    )
  }

  const handleDeleteManager = (managerId: string) => {
    setManagers(managers.filter((manager) => manager.id !== managerId))
  }

  const filteredManagers = managers.filter((manager) => {
    const matchesSearch =
      manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === "all" || manager.department === filterDepartment
    const matchesStatus = filterStatus === "all" || manager.status === filterStatus
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const stats = {
    total: managers.length,
    active: managers.filter((m) => m.status === "active").length,
    inactive: managers.filter((m) => m.status === "inactive").length,
    totalTeamSize: managers.reduce((sum, m) => sum + m.teamSize, 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Managers</h2>
          <p className="text-gray-600">Quản lý tài khoản và quyền hạn quản lý</p>
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
          <Dialog open={isAddManagerOpen} onOpenChange={setIsAddManagerOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Thêm quản lý
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Thêm quản lý mới</DialogTitle>
                <DialogDescription>Tạo tài khoản quản lý mới trong hệ thống</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Họ và tên *</Label>
                  <Input
                    id="name"
                    value={newManager.name}
                    onChange={(e) => setNewManager({ ...newManager, name: e.target.value })}
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newManager.email}
                    onChange={(e) => setNewManager({ ...newManager, email: e.target.value })}
                    placeholder="Nhập địa chỉ email"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="employeeId">Mã nhân viên *</Label>
                  <Input
                    id="employeeId"
                    value={newManager.employeeId}
                    onChange={(e) => setNewManager({ ...newManager, employeeId: e.target.value })}
                    placeholder="Nhập mã nhân viên"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Phòng ban</Label>
                  <Select
                    value={newManager.department}
                    onValueChange={(value) => setNewManager({ ...newManager, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phòng ban" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hành chính">Hành chính</SelectItem>
                      <SelectItem value="Đào tạo">Đào tạo</SelectItem>
                      <SelectItem value="Tài chính">Tài chính</SelectItem>
                      <SelectItem value="Nhân sự">Nhân sự</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="position">Chức vụ</Label>
                  <Select
                    value={newManager.position}
                    onValueChange={(value) => setNewManager({ ...newManager, position: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn chức vụ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Trưởng phòng">Trưởng phòng</SelectItem>
                      <SelectItem value="Phó trưởng phòng">Phó trưởng phòng</SelectItem>
                      <SelectItem value="Trưởng nhóm">Trưởng nhóm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddManagerOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAddManager} className="bg-emerald-600 hover:bg-emerald-700">
                  Tạo tài khoản
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng quản lý</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <UserCog className="w-8 h-8 text-emerald-600" />
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
                <p className="text-sm font-medium text-gray-600">Tổng nhân viên</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalTeamSize}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Managers Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Danh sách quản lý</CardTitle>
              <CardDescription>Quản lý thông tin và quyền hạn của các quản lý</CardDescription>
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
                <SelectItem value="Hành chính">Hành chính</SelectItem>
                <SelectItem value="Đào tạo">Đào tạo</SelectItem>
                <SelectItem value="Tài chính">Tài chính</SelectItem>
                <SelectItem value="Nhân sự">Nhân sự</SelectItem>
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
                  <TableHead className="font-semibold">Quản lý</TableHead>
                  <TableHead className="font-semibold">Mã NV</TableHead>
                  <TableHead className="font-semibold">Phòng ban</TableHead>
                  <TableHead className="font-semibold">Chức vụ</TableHead>
                  <TableHead className="font-semibold">Nhóm</TableHead>
                  <TableHead className="font-semibold">Trạng thái</TableHead>
                  <TableHead className="font-semibold">Đăng nhập cuối</TableHead>
                  <TableHead className="font-semibold text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredManagers.map((manager) => (
                  <TableRow key={manager.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{manager.name}</div>
                        <div className="text-sm text-gray-500">{manager.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {manager.employeeId}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{manager.department}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        {manager.position}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{manager.teamSize} người</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          manager.status === "active"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }
                      >
                        {manager.status === "active" ? "Hoạt động" : "Tạm nghỉ"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {new Date(manager.lastLogin).toLocaleString("vi-VN")}
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
                          <DropdownMenuItem onClick={() => handleStatusToggle(manager.id)}>
                            <UserCheck className="w-4 h-4 mr-2" />
                            {manager.status === "active" ? "Tạm nghỉ" : "Kích hoạt"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteManager(manager.id)}>
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

          {filteredManagers.length === 0 && (
            <div className="text-center py-8">
              <UserCog className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy quản lý</h3>
              <p className="text-gray-600">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
