"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Download, Calendar, BarChart3, PieChartIcon, TrendingUp, AlertTriangle } from "lucide-react"

// Mock data for charts
const alertsByTypeData = [
  { name: "Học tập", value: 25, color: "#3b82f6" },
  { name: "Hành vi", value: 18, color: "#f97316" },
  { name: "Điểm danh", value: 12, color: "#eab308" },
]

const alertsBySeverityData = [
  { name: "Cao", value: 15, color: "#ef4444" },
  { name: "Trung bình", value: 22, color: "#f97316" },
  { name: "Thấp", value: 18, color: "#eab308" },
]

const monthlyAlertsData = [
  { name: "T1", academic: 5, behavioral: 3, attendance: 2 },
  { name: "T2", academic: 7, behavioral: 4, attendance: 3 },
  { name: "T3", academic: 6, behavioral: 5, attendance: 4 },
  { name: "T4", academic: 8, behavioral: 6, attendance: 2 },
  { name: "T5", academic: 10, behavioral: 4, attendance: 3 },
  { name: "T6", academic: 12, behavioral: 8, attendance: 5 },
]

const responseTimeData = [
  { name: "< 1 giờ", value: 18 },
  { name: "1-4 giờ", value: 12 },
  { name: "4-24 giờ", value: 8 },
  { name: "> 24 giờ", value: 2 },
]

const COLORS = ["#3b82f6", "#f97316", "#eab308", "#ef4444"]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Thống kê và phân tích</h2>
          <p className="text-gray-600">Phân tích dữ liệu cảnh báo và phản hồi</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="month">
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Tuần này</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="quarter">Quý này</SelectItem>
              <SelectItem value="year">Năm nay</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng cảnh báo</p>
                <p className="text-2xl font-bold">55</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
              <span className="text-green-600">+12% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã phản hồi</p>
                <p className="text-2xl font-bold">48</p>
              </div>
              <Badge className="bg-green-100 text-green-800">87%</Badge>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">Thời gian phản hồi trung bình: 3.2 giờ</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Học tập</p>
                <p className="text-2xl font-bold text-blue-600">25</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">45%</Badge>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">Loại cảnh báo phổ biến nhất</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mức độ cao</p>
                <p className="text-2xl font-bold text-red-600">15</p>
              </div>
              <Badge className="bg-red-100 text-red-800">27%</Badge>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">Cần ưu tiên xử lý</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="w-4 h-4 mr-2" />
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="alerts">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Phân tích cảnh báo
          </TabsTrigger>
          <TabsTrigger value="responses">
            <PieChartIcon className="w-4 h-4 mr-2" />
            Phân tích phản hồi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cảnh báo theo tháng</CardTitle>
                <CardDescription>Số lượng cảnh báo theo loại và tháng</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyAlertsData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="academic" stackId="a" fill="#3b82f6" name="Học tập" />
                    <Bar dataKey="behavioral" stackId="a" fill="#f97316" name="Hành vi" />
                    <Bar dataKey="attendance" stackId="a" fill="#eab308" name="Điểm danh" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phân bố loại cảnh báo</CardTitle>
                <CardDescription>Tỷ lệ các loại cảnh báo</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={alertsByTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {alertsByTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cảnh báo theo mức độ</CardTitle>
                <CardDescription>Phân bố cảnh báo theo mức độ nghiêm trọng</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={alertsBySeverityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {alertsBySeverityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thời gian phản hồi</CardTitle>
                <CardDescription>Phân bố thời gian phản hồi cảnh báo</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={responseTimeData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#3b82f6" name="Số lượng" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="responses">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hiệu quả phản hồi</CardTitle>
                <CardDescription>Tỷ lệ cải thiện sau khi có phản hồi</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Học tập", improved: 75, unchanged: 20, worsened: 5 },
                      { name: "Hành vi", improved: 65, unchanged: 25, worsened: 10 },
                      { name: "Điểm danh", improved: 80, unchanged: 15, worsened: 5 },
                    ]}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="improved" stackId="a" fill="#22c55e" name="Cải thiện" />
                    <Bar dataKey="unchanged" stackId="a" fill="#f59e0b" name="Không đổi" />
                    <Bar dataKey="worsened" stackId="a" fill="#ef4444" name="Xấu đi" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
