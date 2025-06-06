"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
import { AlertTriangle, MessageSquare, Send, Clock, User } from "lucide-react"

interface Alert {
  id: string
  studentName: string
  studentId: string
  type: "academic" | "behavioral" | "attendance"
  severity: "low" | "medium" | "high"
  description: string
  aiAnalysis: string
  timestamp: string
  status: "pending" | "responded" | "resolved"
  response?: {
    advice: string
    plan: string
    respondedAt: string
  }
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    studentName: "Nguyễn Văn A",
    studentId: "SV001",
    type: "academic",
    severity: "high",
    description: "Điểm số giảm mạnh trong 3 tuần liên tiếp",
    aiAnalysis:
      "Học sinh có dấu hiệu gặp khó khăn trong việc tiếp thu kiến thức môn Toán và Vật lý. Cần can thiệp sớm để tránh ảnh hưởng đến kết quả học tập cuối kỳ.",
    timestamp: "2024-01-20T10:30:00Z",
    status: "pending",
  },
  {
    id: "2",
    studentName: "Trần Thị B",
    studentId: "SV002",
    type: "behavioral",
    severity: "medium",
    description: "Thường xuyên đến lớp muộn và thiếu tập trung",
    aiAnalysis:
      "Học sinh có biểu hiện mất tập trung trong giờ học, có thể do áp lực tâm lý hoặc vấn đề cá nhân. Cần trao đổi để hiểu rõ nguyên nhân.",
    timestamp: "2024-01-20T09:15:00Z",
    status: "pending",
  },
  {
    id: "3",
    studentName: "Lê Văn C",
    studentId: "SV003",
    type: "attendance",
    severity: "low",
    description: "Vắng mặt 2 buổi học trong tuần",
    aiAnalysis:
      "Tỷ lệ vắng mặt tăng nhẹ so với tháng trước. Cần xác nhận lý do và nhắc nhở về tầm quan trọng của việc đi học đều đặn.",
    timestamp: "2024-01-19T14:20:00Z",
    status: "pending",
  },
]

const typeLabels = {
  academic: "Học tập",
  behavioral: "Hành vi",
  attendance: "Điểm danh",
}

const severityColors = {
  low: "bg-yellow-100 text-yellow-800",
  medium: "bg-orange-100 text-orange-800",
  high: "bg-red-100 text-red-800",
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [isResponseOpen, setIsResponseOpen] = useState(false)
  const [response, setResponse] = useState({
    advice: "",
    plan: "",
  })

  const handleSubmitResponse = () => {
    if (selectedAlert && response.advice && response.plan) {
      const updatedAlerts = alerts.map((alert) =>
        alert.id === selectedAlert.id
          ? {
              ...alert,
              status: "responded" as const,
              response: {
                advice: response.advice,
                plan: response.plan,
                respondedAt: new Date().toISOString(),
              },
            }
          : alert,
      )
      setAlerts(updatedAlerts)
      setResponse({ advice: "", plan: "" })
      setIsResponseOpen(false)
      setSelectedAlert(null)
    }
  }

  const pendingAlerts = alerts.filter((alert) => alert.status === "pending")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Cảnh báo cần xử lý</h2>
        <p className="text-gray-600">Danh sách các cảnh báo từ hệ thống AI cần được phản hồi</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cảnh báo mới</p>
                <p className="text-2xl font-bold text-red-600">{pendingAlerts.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mức độ cao</p>
                <p className="text-2xl font-bold text-orange-600">
                  {pendingAlerts.filter((a) => a.severity === "high").length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Học tập</p>
                <p className="text-2xl font-bold text-blue-600">
                  {pendingAlerts.filter((a) => a.type === "academic").length}
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <div className="space-y-6">
        {pendingAlerts.map((alert) => (
          <Card key={alert.id} className="border-l-4 border-l-red-500">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <CardTitle className="text-lg">{alert.studentName}</CardTitle>
                    <Badge variant="outline">{alert.studentId}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={severityColors[alert.severity]}>
                      {alert.severity === "high" ? "Cao" : alert.severity === "medium" ? "Trung bình" : "Thấp"}
                    </Badge>
                    <Badge variant="outline">{typeLabels[alert.type]}</Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-3 h-3" />
                      {new Date(alert.timestamp).toLocaleString("vi-VN")}
                    </div>
                  </div>
                </div>
                <Dialog
                  open={isResponseOpen && selectedAlert?.id === alert.id}
                  onOpenChange={(open) => {
                    setIsResponseOpen(open)
                    if (open) setSelectedAlert(alert)
                    else setSelectedAlert(null)
                  }}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Send className="w-4 h-4 mr-2" />
                      Phản hồi
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Phản hồi cảnh báo - {alert.studentName}</DialogTitle>
                      <DialogDescription>Đưa ra lời khuyên và kế hoạch hỗ trợ cho học sinh</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Phân tích từ AI:</h4>
                        <p className="text-sm text-gray-700">{alert.aiAnalysis}</p>
                      </div>
                      <div className="grid gap-4">
                        <div>
                          <Label htmlFor="advice">Lời khuyên cho học sinh</Label>
                          <Textarea
                            id="advice"
                            placeholder="Nhập lời khuyên và hướng dẫn cho học sinh..."
                            value={response.advice}
                            onChange={(e) => setResponse({ ...response, advice: e.target.value })}
                            rows={4}
                          />
                        </div>
                        <div>
                          <Label htmlFor="plan">Kế hoạch hỗ trợ</Label>
                          <Textarea
                            id="plan"
                            placeholder="Nhập kế hoạch hỗ trợ chi tiết (các bước cụ thể, timeline...)..."
                            value={response.plan}
                            onChange={(e) => setResponse({ ...response, plan: e.target.value })}
                            rows={6}
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsResponseOpen(false)}>
                        Hủy
                      </Button>
                      <Button onClick={handleSubmitResponse}>Gửi phản hồi</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm text-gray-600 mb-1">Mô tả vấn đề:</h4>
                  <p className="text-sm">{alert.description}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-600 mb-1">Phân tích AI:</h4>
                  <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">{alert.aiAnalysis}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {pendingAlerts.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có cảnh báo mới</h3>
              <p className="text-gray-600">Tất cả cảnh báo đã được xử lý</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
