"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Calendar, User, MessageSquare, AlertTriangle, Download } from "lucide-react"

interface Response {
  id: string
  studentName: string
  studentId: string
  type: "academic" | "behavioral" | "attendance"
  severity: "low" | "medium" | "high"
  description: string
  aiAnalysis: string
  timestamp: string
  status: "responded" | "resolved"
  response: {
    advice: string
    plan: string
    respondedAt: string
  }
}

const mockResponses: Response[] = [
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
    status: "responded",
    response: {
      advice: "Em nên tạo thói quen ngủ sớm và dậy sớm để có tinh thần tốt hơn trong giờ học.",
      plan: "1. Gặp gỡ trao đổi với phụ huynh\n2. Lập kế hoạch học tập cá nhân\n3. Theo dõi tiến độ hàng tuần",
      respondedAt: "2024-01-20T11:00:00Z",
    },
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
    status: "resolved",
    response: {
      advice: "Em cần thông báo trước khi nghỉ học và bổ sung bài vở đã bỏ lỡ.",
      plan: "1. Liên hệ với phụ huynh để xác nhận lý do vắng mặt\n2. Cung cấp tài liệu học tập bổ sung\n3. Theo dõi tình hình đi học trong 2 tuần tới",
      respondedAt: "2024-01-19T16:30:00Z",
    },
  },
  {
    id: "4",
    studentName: "Phạm Thị D",
    studentId: "SV004",
    type: "academic",
    severity: "high",
    description: "Điểm kiểm tra giữa kỳ thấp ở nhiều môn học",
    aiAnalysis:
      "Học sinh có dấu hiệu sụt giảm đáng kể về kết quả học tập. Cần tìm hiểu nguyên nhân và có biện pháp hỗ trợ kịp thời.",
    timestamp: "2024-01-18T10:00:00Z",
    status: "responded",
    response: {
      advice: "Em cần tập trung hơn vào việc học và không ngại hỏi giáo viên khi gặp khó khăn.",
      plan: "1. Tổ chức buổi học bổ sung cho các môn yếu\n2. Phân tích điểm mạnh, điểm yếu trong học tập\n3. Thiết lập mục tiêu học tập ngắn hạn và dài hạn",
      respondedAt: "2024-01-18T14:45:00Z",
    },
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

const statusColors = {
  responded: "bg-green-100 text-green-800",
  resolved: "bg-gray-100 text-gray-800",
}

export default function ResponsesPage() {
  const [responses, setResponses] = useState<Response[]>(mockResponses)

  const handleMarkResolved = (responseId: string) => {
    setResponses(
      responses.map((response) =>
        response.id === responseId ? { ...response, status: "resolved" as const } : response,
      ),
    )
  }

  const respondedResponses = responses.filter((r) => r.status === "responded")
  const resolvedResponses = responses.filter((r) => r.status === "resolved")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Phản hồi đã gửi</h2>
        <p className="text-gray-600">Quản lý và theo dõi các phản hồi đã gửi cho học sinh</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng phản hồi</p>
                <p className="text-2xl font-bold">{responses.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đang theo dõi</p>
                <p className="text-2xl font-bold text-green-600">{respondedResponses.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã giải quyết</p>
                <p className="text-2xl font-bold text-gray-600">{resolvedResponses.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Responses Tabs */}
      <Tabs defaultValue="responded" className="space-y-6">
        <TabsList>
          <TabsTrigger value="responded" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Đang theo dõi ({respondedResponses.length})
          </TabsTrigger>
          <TabsTrigger value="resolved" className="data-[state=active]:bg-gray-50 data-[state=active]:text-gray-700">
            <CheckCircle className="w-4 h-4 mr-2" />
            Đã giải quyết ({resolvedResponses.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="responded">
          <div className="space-y-6">
            {respondedResponses.map((response) => (
              <Card key={response.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <CardTitle className="text-lg">{response.studentName}</CardTitle>
                        <Badge variant="outline">{response.studentId}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={statusColors[response.status]}>Đã phản hồi</Badge>
                        <Badge className={severityColors[response.severity]}>
                          {response.severity === "high"
                            ? "Cao"
                            : response.severity === "medium"
                              ? "Trung bình"
                              : "Thấp"}
                        </Badge>
                        <Badge variant="outline">{typeLabels[response.type]}</Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(response.response.respondedAt).toLocaleString("vi-VN")}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleMarkResolved(response.id)}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Đánh dấu đã giải quyết
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-600 mb-1">Vấn đề:</h4>
                      <p className="text-sm">{response.description}</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 mb-2">Lời khuyên đã gửi:</h4>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm">{response.response.advice}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 mb-2">Kế hoạch hỗ trợ:</h4>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <pre className="text-sm whitespace-pre-wrap">{response.response.plan}</pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {respondedResponses.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Không có phản hồi đang theo dõi</h3>
                  <p className="text-gray-600">Tất cả phản hồi đã được giải quyết</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="resolved">
          <div className="space-y-6">
            {resolvedResponses.map((response) => (
              <Card key={response.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <CardTitle className="text-lg">{response.studentName}</CardTitle>
                        <Badge variant="outline">{response.studentId}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={statusColors[response.status]}>Đã giải quyết</Badge>
                        <Badge variant="outline">{typeLabels[response.type]}</Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(response.response.respondedAt).toLocaleString("vi-VN")}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Xuất báo cáo
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-600 mb-1">Vấn đề:</h4>
                      <p className="text-sm">{response.description}</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 mb-2">Lời khuyên đã gửi:</h4>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm">{response.response.advice}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 mb-2">Kế hoạch hỗ trợ:</h4>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <pre className="text-sm whitespace-pre-wrap">{response.response.plan}</pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {resolvedResponses.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Không có phản hồi đã giải quyết</h3>
                  <p className="text-gray-600">Chưa có phản hồi nào được đánh dấu là đã giải quyết</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
