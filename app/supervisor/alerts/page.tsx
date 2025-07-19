"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  AlertTriangle, 
  MessageSquare, 
  Send, 
  Clock, 
  User, 
  BookOpen, 
  Search,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  CheckCircle,
  Download
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAlerts, useUpdateAlert } from "@/hooks/useAlerts"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { useApiGet } from "@/hooks/useApi"
import { Alert } from "@/services/alertApi"

// UI Constants
const riskLevelColors = {
  LOW: "bg-yellow-100 text-yellow-800",
  MEDIUM: "bg-orange-100 text-orange-800",
  HIGH: "bg-red-100 text-red-800",
}

const statusColors = {
  "NOT RESPONDED": "bg-gray-100 text-gray-800",
  RESPONDED: "bg-green-100 text-green-800",
  RESOLVED: "bg-blue-100 text-blue-800",
}

const riskLevelLabels = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
}

const statusLabels = {
  "NOT RESPONDED": "Not Responded",
  RESPONDED: "Responded",
  RESOLVED: "Resolved",
}

// Custom hooks for specific statuses
const useRespondedAlerts = (page = 1, limit = 20) => {
  const { 
    data, 
    isLoading, 
    isError, 
    refetch 
  } = useApiGet<{
    data: Alert[];
    totalItems: number;
    totalPage: number;
  }>(`/alerts?status=RESPONDED&page=${page}&limit=${limit}`, ['alerts-responded', String(page), String(limit)], {
    enabled: true,
  });

  return {
    alerts: data?.data || [],
    totalItems: data?.totalItems || 0,
    totalPages: data?.totalPage || 0,
    isLoading,
    isError,
    refetch
  };
};

const useNotRespondedAlerts = (page = 1, limit = 20) => {
  const { 
    data, 
    isLoading, 
    isError, 
    refetch 
  } = useApiGet<{
    data: Alert[];
    totalItems: number;
    totalPage: number;
  }>(`/alerts?status=NOT%20RESPONDED&page=${page}&limit=${limit}`, ['alerts-not-responded', String(page), String(limit)], {
    enabled: true,
  });

  return {
    alerts: data?.data || [],
    totalItems: data?.totalItems || 0,
    totalPages: data?.totalPage || 0,
    isLoading,
    isError,
    refetch
  };
};

export default function AlertsPage() {
  // State for general filtering
  const [filters, setFilters] = useState({
    status: "ALL",
    riskLevel: "ALL",
    title: "",
    page: 1,
    limit: 20,
  })
  // State cho dialog
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null)
  const [responseData, setResponseData] = useState({
    response: "",
    plan: "",
  })
  const [dialogOpen, setDialogOpen] = useState(false)

  // State cho tab và phân trang từng tab
  const [activeTab, setActiveTab] = useState<string>("not responded")
  const [respondedPage, setRespondedPage] = useState(1)
  const [notRespondedPage, setNotRespondedPage] = useState(1)
  const pageLimit = 20

  // Fetch responded alerts (chỉ cho tab responded)
  const {
    alerts: respondedAlerts,
    totalItems: respondedTotalItems,
    totalPages: respondedTotalPages,
    isLoading: isRespondedLoading,
    refetch: refetchResponded
  } = useRespondedAlerts(respondedPage, pageLimit)

  // Fetch not responded alerts (chỉ cho tab not responded)
  const {
    alerts: notResponsedAlerts,
    totalItems: notRespondedTotalItems,
    totalPages: notRespondedTotalPages,
    isLoading: isNotRespondedLoading,
    refetch: refetchNotResponded
  } = useNotRespondedAlerts(notRespondedPage, pageLimit)

  // Update alert mutation
  const { updateAlert, isLoading: isUpdating } = useUpdateAlert()

  // Reset form when dialog closes
  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setResponseData({ response: "", plan: "" });
      setSelectedAlertId(null);
    }
  }

  // Handle response submission
  const handleSubmitResponse = async () => {
    if (!selectedAlertId) return
    if (!responseData.response || !responseData.plan) {
      toast({
        title: "Please enter complete information",
        description: "Advice and support plan cannot be empty",
        variant: "destructive",
      })
      return
    }
    try {
      // PATCH /api/alerts/{id} with supervisorResponse and status: 'RESPONDED'
      await updateAlert(selectedAlertId, {
        supervisorResponse: {
          response: responseData.response,
          plan: responseData.plan
        },
        status: "RESPONDED"
      })
      toast({
        title: "Response successful",
        description: "Your response has been sent to the student",
      })
      setDialogOpen(false)
      refetchResponded()
      refetchNotResponded()
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while sending the response",
        variant: "destructive",
      })
    }
  }

  // Tab change handler
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  // Pagination handlers cho từng tab
  const handleRespondedPageChange = (newPage: number) => {
    if (newPage < 1 || newPage > respondedTotalPages) return
    setRespondedPage(newPage)
  }
  const handleNotRespondedPageChange = (newPage: number) => {
    if (newPage < 1 || newPage > notRespondedTotalPages) return
    setNotRespondedPage(newPage)
  }

  // Get selected alert (ưu tiên lấy từ 2 list tab)
  const selectedAlert = selectedAlertId
    ? (activeTab === "responded"
        ? respondedAlerts.find(a => a._id === selectedAlertId)
        : notResponsedAlerts.find(a => a._id === selectedAlertId))
    : null;

  // Filter handlers (cho phần filter chung)
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset về trang 1 khi đổi filter
    }))
  }
  const resetFilters = () => {
    setFilters({
      status: "ALL",
      riskLevel: "ALL",
      title: "",
      page: 1,
      limit: 5,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Academic Alerts</h2>
        <p className="text-gray-600">Manage and respond to student academic alerts</p>
      </div>

      {/* Filter section */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="title-filter" className="mb-1 block">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="title-filter"
                  placeholder="Alert title..."
                  className="pl-8"
                  value={filters.title}
                  onChange={(e) => handleFilterChange('title', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="risk-filter" className="mb-1 block">Risk Level</Label>
              <Select
                value={filters.riskLevel}
                onValueChange={(value) => handleFilterChange('riskLevel', value)}
              >
                <SelectTrigger id="risk-filter">
                  <SelectValue placeholder="All risk levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All risk levels</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full" onClick={resetFilters}>
                <RefreshCcw className="w-4 h-4 mr-2" />
                Reset filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Response Tabs */}
      <Tabs defaultValue="not responded" value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList>
          <TabsTrigger value="not responded" className="data-[state=active]:bg-gray-50 data-[state=active]:text-gray-700">
            <CheckCircle className="w-4 h-4 mr-2" />
            Not Responded ({notRespondedTotalItems})
          </TabsTrigger>
          <TabsTrigger value="responded" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Monitoring ({respondedTotalItems})
          </TabsTrigger>
        </TabsList>
        {/* Tab RESPONDED */}
        <TabsContent value="responded">
          <div className="space-y-6">
            {isRespondedLoading ? (
              <div>Loading...</div>
            ) : respondedAlerts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No responses being monitored</h3>
                  <p className="text-gray-600">All responses have been resolved</p>
                </CardContent>
              </Card>
            ) : (
              respondedAlerts.map((alert) => (
                <Card key={alert._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <CardTitle className="text-lg">
                            {alert.enrollmentId?.studentId?.firstName || '-'} {alert.enrollmentId?.studentId?.lastName || '-'}
                          </CardTitle>
                          <Badge variant="outline">{alert.enrollmentId?.studentId?.email || '-'}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={statusColors[alert.status]}>Responded</Badge>
                          <Badge className={riskLevelColors[alert.riskLevel]}>
                            {riskLevelLabels[alert.riskLevel]}
                          </Badge>
                          {alert.enrollmentId?.courseId?.subjectId && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              {alert.enrollmentId.courseId.subjectId.subjectCode}
                            </Badge>
                          )}
                          {alert.supervisorResponse?.createdAt && (
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Calendar className="w-3 h-3" />
                              {new Date(alert.supervisorResponse.createdAt).toLocaleString("vi-VN")}
                            </div>
                          )}
                        </div>
                      </div>
                      {/* <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleMarkResolved(alert._id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Đánh dấu đã giải quyết
                      </Button> */}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 mb-1"> Problem:</h4>
                         <h4 className="font-medium mb-1">{alert.title}</h4>
                        <p className="text-sm">{alert.content}</p>
                      </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <h5 className="font-medium mb-2">Academic Information:</h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {alert?.enrollmentId?.grade?.map((grade, index) => (
                                <div key={index} className="bg-white rounded p-2">
                                  <p className="text-xs font-medium">{grade.type?.toUpperCase() || '-'}</p>
                                  <p className="text-sm">
                                    {grade.score !== null && grade.score !== undefined ? Number(grade.score).toFixed(1) : 'N/A'}
                                    <span className="text-xs text-gray-400"> ({grade.weight ? Math.round(grade.weight * 100) : 0}%)</span>
                                  </p>
                                </div>
                              ))}
                            </div>
                            <p className="mt-2 text-sm">
                              Status: 
                              <Badge className="ml-2" variant={alert.enrollmentId?.status === 'PASSED' ? 'default' : 'destructive'}>
                                {alert.enrollmentId?.status || '-'}
                              </Badge>
                            </p>
                          </div>
                      
                      {alert.supervisorResponse && (
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-sm text-gray-600 mb-2">Advice Sent:</h4>
                            <div className="bg-green-50 p-3 rounded-lg">
                              <p className="text-sm">{alert.supervisorResponse.response}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm text-gray-600 mb-2">Support Plan:</h4>
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <pre className="text-sm whitespace-pre-wrap">{alert.supervisorResponse.plan}</pre>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            {/* Pagination for responded */}
            {respondedTotalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleRespondedPageChange(respondedPage - 1)}
                  disabled={respondedPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm">
                  Page {respondedPage} / {respondedTotalPages}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleRespondedPageChange(respondedPage + 1)}
                  disabled={respondedPage === respondedTotalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        {/* Tab NOT RESPONDED */}
        <TabsContent value="not responded">
          <div className="space-y-6">
            {isNotRespondedLoading ? (
              <div>Loading...</div>
            ) : notResponsedAlerts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts waiting for response</h3>
                  <p className="text-gray-600">All alerts have been responded to</p>
                </CardContent>
              </Card>
            ) : (
              notResponsedAlerts.map((alert) => (
                <Card key={alert._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <CardTitle className="text-lg">
                            {alert.enrollmentId?.studentId?.firstName || '-'} {alert.enrollmentId?.studentId?.lastName || '-'}
                          </CardTitle>
                          {/* <Badge variant="outline">{alert.enrollmentId?.studentId?.email || '-'}</Badge> */}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={statusColors[alert.status]}>
                            {statusLabels[alert.status]}
                          </Badge>
                          <Badge className={riskLevelColors[alert.riskLevel]}>
                            {riskLevelLabels[alert.riskLevel]}
                          </Badge>
                          {alert.enrollmentId?.courseId?.subjectId && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              {alert.enrollmentId.courseId.subjectId.subjectCode}
                            </Badge>
                          )}
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {new Date(alert.createdAt).toLocaleString("vi-VN")}
                          </div>
                        </div>
                      </div>
                      <Button 
                        onClick={() => {
                          setSelectedAlertId(alert._id)
                          setDialogOpen(true)
                        }}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Respond
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 mb-1">Vấn đề:</h4>
                         <h4 className="font-medium mb-1">{alert.title}</h4>
                        <p className="text-sm">{alert.content}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <h5 className="font-medium mb-2">Academic Information:</h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {alert.enrollmentId.grade.map((grade, index) => (
                            <div key={index} className="bg-white rounded p-2">
                              <p className="text-xs font-medium">{grade.type?.toUpperCase() || '-'}</p>
                              <p className="text-sm">
                                {grade.score !== null && grade.score !== undefined ? Number(grade.score).toFixed(1) : 'N/A'}
                                <span className="text-xs text-gray-400"> ({grade.weight ? Math.round(grade.weight * 100) : 0}%)</span>
                              </p>
                            </div>
                          ))}
                        </div>
                        <p className="mt-2 text-sm">
                          Status: 
                          <Badge className="ml-2" variant={alert.enrollmentId?.status === 'PASSED' ? 'default' : 'destructive'}>
                            {alert.enrollmentId?.status || '-'}
                          </Badge>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            {/* Pagination for not responded */}
            {notRespondedTotalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleNotRespondedPageChange(notRespondedPage - 1)}
                  disabled={notRespondedPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm">
                  Page {notRespondedPage} / {notRespondedTotalPages}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleNotRespondedPageChange(notRespondedPage + 1)}
                  disabled={notRespondedPage === notRespondedTotalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs> 

      
      {/* Response Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Alert Details & Response</DialogTitle>
            <DialogDescription>
              View alert details and send a response to the student
            </DialogDescription>
          </DialogHeader>

          {selectedAlert && (
            <div className="space-y-6 py-2">
              {/* 1. Student Information */}
              <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
                {selectedAlert.enrollmentId.studentId.image ? (
                  <img
                    src={selectedAlert.enrollmentId.studentId.image}
                    alt="Student"
                    className="w-14 h-14 rounded-full object-cover border"
                  />
                ) : (
                  <User className="w-12 h-12 rounded-full bg-gray-200 p-2" />
                )}
                <div>
                  <div className="font-semibold text-lg">
                    {selectedAlert.enrollmentId.studentId.firstName || '-'} {selectedAlert.enrollmentId.studentId.lastName || '-'}
                  </div>
                  <div className="text-sm text-gray-600">{selectedAlert.enrollmentId.studentId.email || '-'}</div>
                </div>
              </div>

              {/* 2. Subject & Semester Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="font-medium">{selectedAlert.enrollmentId.courseId?.subjectId?.subjectName || '-'}</div>
                      <div className="text-xs text-gray-500">Subject Code: {selectedAlert.enrollmentId.courseId?.subjectId?.subjectCode || '-'}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="font-medium">Semester: {selectedAlert.enrollmentId.courseId?.semesterId?.semesterName || '-'}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(selectedAlert.enrollmentId.courseId?.semesterId?.startDate).toLocaleDateString("en-US") || '-'}
                    {" - "}
                    {new Date(selectedAlert.enrollmentId.courseId?.semesterId?.endDate).toLocaleDateString("en-US") || '-'}
                  </div>
                </div>
              </div>

              {/* 3. Thông tin cảnh báo */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge className={riskLevelColors[selectedAlert.riskLevel]}>
                    {riskLevelLabels[selectedAlert.riskLevel]}
                  </Badge>
                  <Badge className={statusColors[selectedAlert.status]}>
                    {statusLabels[selectedAlert.status]}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(selectedAlert.createdAt).toLocaleDateString("vi-VN")}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Tiêu đề:</div>
                  <div className="font-medium">{selectedAlert.title || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Nội dung:</div>
                  <div>{selectedAlert.content || '-'}</div>
                </div>
              </div>

              {/* 4. Tiến độ học tập */}
              <div>
                <h4 className="font-medium mb-2">Tiến độ học tập</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {selectedAlert.enrollmentId.grade.map((grade, index) => (
                      <div key={index} className={`bg-white p-3 rounded-lg border ${grade.score === null ? 'border-gray-200' : 'border-blue-200'}`}>
                        <p className="text-xs uppercase font-semibold mb-1">{grade.type}</p>
                        <div className="flex justify-between items-baseline">
                          <p className="text-xl font-bold">
                            {grade.score !== null ? Number(grade.score).toFixed(1) : '-'}
                          </p>
                          <p className="text-xs text-gray-500">({Math.round(grade.weight * 100)}%)</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center">
                    <p className="mr-2 text-sm">Trạng thái:</p>
                    <Badge variant={selectedAlert.enrollmentId.status === 'PASSED' ? 'default' : 'destructive'}>
                      {selectedAlert.enrollmentId.status || '-'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* 5. Phản hồi của giảng viên (nếu có) */}
              {selectedAlert.supervisorResponse && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-600 mb-2">Lời khuyên đã gửi:</h4>
                    <div className="bg-green-50 p-3 rounded-lg min-h-[60px]">
                      <p className="text-sm">{selectedAlert.supervisorResponse.response || "Chưa có"}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-600 mb-2">Kế hoạch hỗ trợ:</h4>
                    <div className="bg-blue-50 p-3 rounded-lg min-h-[60px]">
                      <pre className="text-sm whitespace-pre-wrap">{selectedAlert.supervisorResponse.plan || "Chưa có"}</pre>
                    </div>
                  </div>
                  <div className="col-span-2 text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {selectedAlert.supervisorResponse.createdAt
                      ? new Date(selectedAlert.supervisorResponse.createdAt).toLocaleString("vi-VN")
                      : ""}
                  </div>
                </div>
              )}

              {/* 6. Form phản hồi */}
              <div className="space-y-3 mt-2">
                <h4 className="font-medium">Phản hồi của bạn</h4>
                <div>
                  <Label htmlFor="advice" className="mb-2 block">
                    Lời khuyên cho sinh viên
                  </Label>
                  <Textarea
                    id="advice"
                    placeholder="Nhập lời khuyên của bạn..."
                    value={responseData.response}
                    onChange={(e) => setResponseData({ ...responseData, response: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>
                <div>
                  <Label htmlFor="plan" className="mb-2 block">
                    Kế hoạch hỗ trợ
                  </Label>
                  <Textarea
                    id="plan"
                    placeholder="Nhập kế hoạch hỗ trợ (các bước cụ thể)..."
                    value={responseData.plan}
                    onChange={(e) => setResponseData({ ...responseData, plan: e.target.value })}
                    className="min-h-[150px]"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Huỷ
            </Button>
            <Button onClick={handleSubmitResponse} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Gửi phản hồi
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
