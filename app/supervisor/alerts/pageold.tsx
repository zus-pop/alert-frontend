// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Input      {/* Response Tabs */}
//       <Tabs defaultValue="not responded" className="space-y-6" onValueChange={handleTabChange}>

//         <TabsList>
//           <TabsTrigger value="not responded" className="data-[state=active]:bg-gray-50 data-[state=active]:text-gray-700">
//             <CheckCircle className="w-4 h-4 mr-2" />
//             Chưa phản hồi ({notRespondedTotalItems})
//           </TabsTrigger>
//           <TabsTrigger value="responded" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
//             <AlertTriangle className="w-4 h-4 mr-2" />
//             Đang theo dõi ({respondedTotalItems})
//           </TabsTrigger>
          
//         </TabsList>ponents/ui/input"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { 
//   AlertTriangle, 
//   MessageSquare, 
//   Send, 
//   Clock, 
//   User, 
//   BookOpen, 
//   Search,
//   RefreshCcw,
//   ChevronLeft,
//   ChevronRight,
//   Calendar,
//   CheckCircle,
//   Download
// } from "lucide-react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { useAlerts, useUpdateAlert } from "@/hooks/useAlerts"
// import { Skeleton } from "@/components/ui/skeleton"
// import { toast } from "@/components/ui/use-toast"

// // UI Constants
// const riskLevelColors = {
//   LOW: "bg-yellow-100 text-yellow-800",
//   MEDIUM: "bg-orange-100 text-orange-800",
//   HIGH: "bg-red-100 text-red-800",
// }

// const statusColors = {
//   "NOT RESPONDED": "bg-gray-100 text-gray-800",
//   RESPONDED: "bg-green-100 text-green-800",
//   RESOLVED: "bg-blue-100 text-blue-800",
// }

// const riskLevelLabels = {
//   LOW: "Thấp",
//   MEDIUM: "Trung bình",
//   HIGH: "Cao",
// }

// const statusLabels = {
//   "NOT RESPONDED": "Chưa phản hồi",
//   RESPONDED: "Đã phản hồi",
//   RESOLVED: "Đã giải quyết",
// }

// export default function AlertsPage() {
//   // State for filters
//   const [filters, setFilters] = useState({
//     status: "ALL",
//     riskLevel: "ALL",
//     title: "",
//     page: 1,
//     limit: 5,
//   })
  
//   // State for pagination in tabs
//   const [respondedPage, setRespondedPage] = useState(1)
//   const [notRespondedPage, setNotRespondedPage] = useState(1)
//   const pageLimit = 20
  
//   // State for response dialog
//   const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null)
//   const [responseData, setResponseData] = useState({
//     response: "",
//     plan: "",
//   })
  
//   const [dialogOpen, setDialogOpen] = useState(false)
  
//   // State for Tabs content
//   const [activeTab, setActiveTab] = useState<string>("not responded")

//   // Fetch all alerts (for filter section)
//   const { alerts, totalItems, totalPages, isLoading, refetch } = useAlerts({
//     ...filters,
//     status: filters.status === "ALL" ? "" : filters.status,
//     riskLevel: filters.riskLevel === "ALL" ? "" : filters.riskLevel,
//     page: filters.page,
//     limit: filters.limit,
//   })

//   // Fetch only responded alerts
//   const { 
//     alerts: respondedAlerts,
//     totalItems: respondedTotalItems, 
//     totalPages: respondedTotalPages,
//     isLoading: isRespondedLoading,
//     refetch: refetchResponded 
//   } = useAlerts({
//     status: "RESPONDED",
//     page: respondedPage,
//     limit: pageLimit,
//   })

//   // Fetch only not responded alerts
//   const { 
//     alerts: notRespondedAlerts,
//     totalItems: notRespondedTotalItems,
//     totalPages: notRespondedTotalPages,
//     isLoading: isNotRespondedLoading,
//     refetch: refetchNotResponded 
//   } = useAlerts({
//     status: "NOT RESPONDED",
//     page: notRespondedPage,
//     limit: pageLimit,
//   })

//   // Update alert mutation
//   const { updateAlert, isLoading: isUpdating } = useUpdateAlert()

//   // Reset form when dialog closes
//   const handleDialogOpenChange = (open: boolean) => {
//     setDialogOpen(open);
//     if (!open) {
//       setResponseData({ response: "", plan: "" });
//       setSelectedAlertId(null);
//     }
//   }

//   // Handle response submission
//   const handleSubmitResponse = async () => {
//     if (!selectedAlertId) return
//     if (!responseData.response || !responseData.plan) {
//       toast({
//         title: "Vui lòng nhập đầy đủ thông tin",
//         description: "Lời khuyên và kế hoạch hỗ trợ không được để trống",
//         variant: "destructive",
//       })
//       return
//     }

//     try {
//       await updateAlert(selectedAlertId, {
//         supervisorResponse: responseData,
//         status: "RESPONDED",
//       })
      
//       toast({
//         title: "Phản hồi thành công",
//         description: "Phản hồi của bạn đã được gửi đến sinh viên",
//       })
      
//       setDialogOpen(false)
//       refetch()
//       refetchResponded()
//       refetchNotResponded()
//     } catch (error) {
//       toast({
//         title: "Lỗi",
//         description: "Có lỗi xảy ra khi gửi phản hồi",
//         variant: "destructive",
//       })
//     }
//   }

//   // Filter handlers
//   const handleFilterChange = (key: string, value: string) => {
//     setFilters(prev => ({
//       ...prev,
//       [key]: value,
//       page: 1, // Reset to first page when filters change
//     }))
//   }

//   const resetFilters = () => {
//     setFilters({
//       status: "ALL",
//       riskLevel: "ALL",
//       title: "",
//       page: 1,
//       limit: 5,
//     })
//   }

//   // Handle page change for each tab
//   const handleRespondedPageChange = (newPage: number) => {
//     if (newPage < 1 || newPage > respondedTotalPages) return
//     setRespondedPage(newPage)
//   }

//   const handleNotRespondedPageChange = (newPage: number) => {
//     if (newPage < 1 || newPage > notRespondedTotalPages) return
//     setNotRespondedPage(newPage)
//   }

//   const handlePageChange = (newPage: number) => {
//     if (newPage < 1 || newPage > totalPages) return
//     setFilters(prev => ({
//       ...prev,
//       page: newPage,
//     }))
//   }

//   // Handle tab change
//   const handleTabChange = (value: string) => {
//     setActiveTab(value)
//   }

//   // Get selected alert
//   const selectedAlert = selectedAlertId ? 
//     [...respondedAlerts, ...notRespondedAlerts].find(a => a._id === selectedAlertId) : null;

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h2 className="text-2xl font-bold text-gray-900">Cảnh báo học tập</h2>
//         <p className="text-gray-600">Quản lý và phản hồi các cảnh báo học tập của sinh viên</p>
//       </div>

//       {/* Stats */}
//       {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Chưa phản hồi</p>
//                 <p className="text-2xl font-bold text-gray-800">{notRespondedCount}</p>
//               </div>
//               <AlertTriangle className="w-8 h-8 text-gray-500" />
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Đã phản hồi</p>
//                 <p className="text-2xl font-bold text-green-600">{respondedCount}</p>
//               </div>
//               <MessageSquare className="w-8 h-8 text-green-500" />
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Đã giải quyết</p>
//                 <p className="text-2xl font-bold text-blue-600">{resolvedCount}</p>
//               </div>
//               <Badge className="bg-blue-100 text-blue-800">{(totalItems > 0 && resolvedCount > 0) ? `${Math.round((resolvedCount / totalItems) * 100)}%` : '0%'}</Badge>
//             </div>
//           </CardContent>
//         </Card>
//       </div> */}

//       {/* Filter section */}
//       <Card>
//         <CardContent className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div>
//               <Label htmlFor="title-filter" className="mb-1 block">Tìm kiếm</Label>
//               <div className="relative">
//                 <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   id="title-filter"
//                   placeholder="Tiêu đề cảnh báo..."
//                   className="pl-8"
//                   value={filters.title}
//                   onChange={(e) => handleFilterChange('title', e.target.value)}
//                 />
//               </div>
//             </div>
//             <div>
//               <Label htmlFor="status-filter" className="mb-1 block">Trạng thái</Label>
//               <Select
//                 value={filters.status}
//                 onValueChange={(value) => handleFilterChange('status', value)}
//               >
//                 <SelectTrigger id="status-filter">
//                   <SelectValue placeholder="Tất cả trạng thái" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
//                   <SelectItem value="NOT RESPONDED">Chưa phản hồi</SelectItem>
//                   <SelectItem value="RESPONDED">Đã phản hồi</SelectItem>
//                   <SelectItem value="RESOLVED">Đã giải quyết</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label htmlFor="risk-filter" className="mb-1 block">Mức độ</Label>
//               <Select
//                 value={filters.riskLevel}
//                 onValueChange={(value) => handleFilterChange('riskLevel', value)}
//               >
//                 <SelectTrigger id="risk-filter">
//                   <SelectValue placeholder="Tất cả mức độ" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="ALL">Tất cả mức độ</SelectItem>
//                   <SelectItem value="LOW">Thấp</SelectItem>
//                   <SelectItem value="MEDIUM">Trung bình</SelectItem>
//                   <SelectItem value="HIGH">Cao</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="flex items-end">
//               <Button variant="outline" className="w-full" onClick={resetFilters}>
//                 <RefreshCcw className="w-4 h-4 mr-2" />
//                 Đặt lại bộ lọc
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
      
//       {/* Response Tabs */}
//       <Tabs defaultValue="not responded" className="space-y-6">

//         <TabsList>
//           <TabsTrigger value="not responded" className="data-[state=active]:bg-gray-50 data-[state=active]:text-gray-700">
//             <CheckCircle className="w-4 h-4 mr-2" />
//             Chưa phản hồi ({notRespondedAlerts.length})
//           </TabsTrigger>
//           <TabsTrigger value="responded" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
//             <AlertTriangle className="w-4 h-4 mr-2" />
//             Đang theo dõi ({respondedAlerts.length})
//           </TabsTrigger>
          
//         </TabsList>

//         <TabsContent value="responded">
//           <div className="space-y-6">
//             {respondedAlerts.map((alert) => (
//               <Card key={alert._id}>
//                 <CardHeader>
//                   <div className="flex items-start justify-between">
//                     <div className="space-y-2">
//                       <div className="flex items-center gap-2">
//                         <User className="w-4 h-4" />
//                         <CardTitle className="text-lg">
//                           {alert.enrollmentId.studentId.firstName} {alert.enrollmentId.studentId.lastName}
//                         </CardTitle>
//                         <Badge variant="outline">{alert.enrollmentId.studentId.email}</Badge>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Badge className={statusColors[alert.status]}>Đã phản hồi</Badge>
//                         <Badge className={riskLevelColors[alert.riskLevel]}>
//                           {riskLevelLabels[alert.riskLevel]}
//                         </Badge>
//                         {alert.enrollmentId.courseId.subjectId && (
//                           <Badge variant="outline" className="flex items-center gap-1">
//                             <BookOpen className="h-3 w-3" />
//                             {alert.enrollmentId.courseId.subjectId.subjectCode}
//                           </Badge>
//                         )}
//                         {alert.supervisorResponse?.createdAt && (
//                           <div className="flex items-center gap-1 text-sm text-gray-500">
//                             <Calendar className="w-3 h-3" />
//                             {new Date(alert.supervisorResponse.createdAt).toLocaleString("vi-VN")}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                     {/* <Button 
//                       variant="outline" 
//                       size="sm" 
//                       onClick={() => handleMarkResolved(alert._id)}
//                     >
//                       <CheckCircle className="w-4 h-4 mr-2" />
//                       Đánh dấu đã giải quyết
//                     </Button> */}
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div>
//                       <h4 className="font-medium text-sm text-gray-600 mb-1">Vấn đề:</h4>
//                        <h4 className="font-medium mb-1">{alert.title}</h4>
//                       <p className="text-sm">{alert.content}</p>
//                     </div>
//                         <div className="bg-gray-50 rounded-lg p-3">
//                           <h5 className="font-medium mb-2">Thông tin học tập:</h5>
//                           <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//                             {alert.enrollmentId.grade.map((grade, index) => (
//                               <div key={index} className="bg-white rounded p-2">
//                                 <p className="text-xs font-medium">{grade.type.toUpperCase()}</p>
//                                 <p className="text-sm">
//                                   {grade.score !== null ? Number(grade.score).toFixed(1) : 'N/A'}
//                                   <span className="text-xs text-gray-400"> ({Math.round(grade.weight * 100)}%)</span>
//                                 </p>
//                               </div>
//                             ))}
//                           </div>
//                           <p className="mt-2 text-sm">
//                             Trạng thái: 
//                             <Badge className="ml-2" variant={alert.enrollmentId.status === 'PASSED' ? 'default' : 'destructive'}>
//                               {alert.enrollmentId.status}
//                             </Badge>
//                           </p>
//                         </div>
                    
//                     {alert.supervisorResponse && (
//                       <div className="grid md:grid-cols-2 gap-4">
//                         <div>
//                           <h4 className="font-medium text-sm text-gray-600 mb-2">Lời khuyên đã gửi:</h4>
//                           <div className="bg-green-50 p-3 rounded-lg">
//                             <p className="text-sm">{alert.supervisorResponse.response}</p>
//                           </div>
//                         </div>
//                         <div>
//                           <h4 className="font-medium text-sm text-gray-600 mb-2">Kế hoạch hỗ trợ:</h4>
//                           <div className="bg-blue-50 p-3 rounded-lg">
//                             <pre className="text-sm whitespace-pre-wrap">{alert.supervisorResponse.plan}</pre>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}

//             {respondedAlerts.length === 0 && (
//               <Card>
//                 <CardContent className="text-center py-12">
//                   <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">Không có phản hồi đang theo dõi</h3>
//                   <p className="text-gray-600">Tất cả phản hồi đã được giải quyết</p>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </TabsContent>

//              <TabsContent value="not responded">
//           {/* Debug info */}
//           <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
//             <p className="text-sm">Debug: {notRespondedAlerts.length} alerts with NOT RESPONDED status found</p>
//             <p className="text-xs">{notRespondedAlerts.map(a => a._id).join(', ')}</p>
//           </div>
//           <div className="space-y-6">
//             {notRespondedAlerts.map((alert) => (
//               <Card key={alert._id}>
//                 <CardHeader>
//                   <div className="flex items-start justify-between">
//                     <div className="space-y-2">
//                       <div className="flex items-center gap-2">
//                         <User className="w-4 h-4" />
//                         <CardTitle className="text-lg">
//                           {alert.enrollmentId.studentId.firstName} {alert.enrollmentId.studentId.lastName}
//                         </CardTitle>
//                         <Badge variant="outline">{alert.enrollmentId.studentId.email}</Badge>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Badge className={statusColors[alert.status]}>
//                           {statusLabels[alert.status]}
//                         </Badge>
//                         <Badge className={riskLevelColors[alert.riskLevel]}>
//                           {riskLevelLabels[alert.riskLevel]}
//                         </Badge>
//                         {alert.enrollmentId.courseId.subjectId && (
//                           <Badge variant="outline" className="flex items-center gap-1">
//                             <BookOpen className="h-3 w-3" />
//                             {alert.enrollmentId.courseId.subjectId.subjectCode}
//                           </Badge>
//                         )}
//                         <div className="flex items-center gap-1 text-sm text-gray-500">
//                           <Calendar className="w-3 h-3" />
//                           {new Date(alert.date).toLocaleString("vi-VN")}
//                         </div>
//                       </div>
//                     </div>
//                     <Button 
//                       onClick={() => {
//                         setSelectedAlertId(alert._id)
//                         setDialogOpen(true)
//                       }}
//                     >
//                       <MessageSquare className="w-4 h-4 mr-2" />
//                       Phản hồi
//                     </Button>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div>
//                       <h4 className="font-medium text-sm text-gray-600 mb-1">Vấn đề:</h4>
//                        <h4 className="font-medium mb-1">{alert.title}</h4>
//                       <p className="text-sm">{alert.content}</p>
//                     </div>
//                     <div className="bg-gray-50 rounded-lg p-3">
//                       <h5 className="font-medium mb-2">Thông tin học tập:</h5>
//                       <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//                         {alert.enrollmentId.grade.map((grade, index) => (
//                           <div key={index} className="bg-white rounded p-2">
//                             <p className="text-xs font-medium">{grade.type.toUpperCase()}</p>
//                             <p className="text-sm">
//                               {grade.score !== null ? Number(grade.score).toFixed(1) : 'N/A'}
//                               <span className="text-xs text-gray-400"> ({Math.round(grade.weight * 100)}%)</span>
//                             </p>
//                           </div>
//                         ))}
//                       </div>
//                       <p className="mt-2 text-sm">
//                         Trạng thái: 
//                         <Badge className="ml-2" variant={alert.enrollmentId.status === 'PASSED' ? 'default' : 'destructive'}>
//                           {alert.enrollmentId.status}
//                         </Badge>
//                       </p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}

//             {(notRespondedAlerts.length === 0 || !notRespondedAlerts) && (
//               <Card>
//                 <CardContent className="text-center py-12">
//                   <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">Không có cảnh báo nào chưa phản hồi</h3>
//                   <p className="text-gray-600">Tất cả các cảnh báo đã được phản hồi</p>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </TabsContent>

//         {/* <TabsContent value="not responded">
//           <div className="space-y-6">
//             {notResponsedAlerts.map((alert) => (
//               <Card key={alert._id}>
//                 <CardHeader>
//                   <div className="flex items-start justify-between">
//                     <div className="space-y-2">
//                       <div className="flex items-center gap-2">
//                         <User className="w-4 h-4" />
//                         <CardTitle className="text-lg">
//                           {alert.enrollmentId.studentId.firstName} {alert.enrollmentId.studentId.lastName}
//                         </CardTitle>
//                         <Badge variant="outline">{alert.enrollmentId.studentId.email}</Badge>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Badge className={statusColors[alert.status]}>Đã giải quyết</Badge>
//                         <Badge className={riskLevelColors[alert.riskLevel]}>
//                           {riskLevelLabels[alert.riskLevel]}
//                         </Badge>
//                         {alert.enrollmentId.courseId.subjectId && (
//                           <Badge variant="outline" className="flex items-center gap-1">
//                             <BookOpen className="h-3 w-3" />
//                             {alert.enrollmentId.courseId.subjectId.subjectCode}
//                           </Badge>
//                         )}
//                         {alert.supervisorResponse?.createdAt && (
//                           <div className="flex items-center gap-1 text-sm text-gray-500">
//                             <Calendar className="w-3 h-3" />
//                             {new Date(alert.supervisorResponse.createdAt).toLocaleString("vi-VN")}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                     <Button variant="outline" size="sm">
//                       <Download className="w-4 h-4 mr-2" />
//                       Xuất báo cáo
//                     </Button>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div>
//                       <h4 className="font-medium text-sm text-gray-600 mb-1">Vấn đề:</h4>
//                       <p className="text-sm">{alert.content}</p>
//                     </div>
//                     {alert.supervisorResponse && (
//                       <div className="grid md:grid-cols-2 gap-4">
//                         <div>
//                           <h4 className="font-medium text-sm text-gray-600 mb-2">Lời khuyên đã gửi:</h4>
//                           <div className="bg-gray-50 p-3 rounded-lg">
//                             <p className="text-sm">{alert.supervisorResponse.response}</p>
//                           </div>
//                         </div>
//                         <div>
//                           <h4 className="font-medium text-sm text-gray-600 mb-2">Kế hoạch hỗ trợ:</h4>
//                           <div className="bg-gray-50 p-3 rounded-lg">
//                             <pre className="text-sm whitespace-pre-wrap">{alert.supervisorResponse.plan}</pre>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}

//             {notResponsedAlerts.length === 0 && (
//               <Card>
//                 <CardContent className="text-center py-12">
//                   <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">Không có cảnh báo mới</h3>
//                   <p className="text-gray-600">Chưa có phản hồi nào được đánh dấu là đã giải quyết</p>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </TabsContent>*/}
//       </Tabs> 

      
//       {/* <Card>
//         <CardHeader>
//           <CardTitle className="text-lg">Danh sách cảnh báo</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {isLoading ? (
          
//             Array(3).fill(null).map((_, i) => (
//               <div key={i} className="mb-6 border rounded-lg p-4">
//                 <div className="flex justify-between items-center mb-4">
//                   <div>
//                     <Skeleton className="h-5 w-40 mb-2" />
//                     <Skeleton className="h-4 w-24" />
//                   </div>
//                   <Skeleton className="h-8 w-24" />
//                 </div>
//                 <Skeleton className="h-4 w-full mb-4" />
//                 <div className="flex gap-2">
//                   <Skeleton className="h-5 w-16" />
//                   <Skeleton className="h-5 w-16" />
//                   <Skeleton className="h-5 w-16" />
//                 </div>
//               </div>
//             ))
//           ) : alerts.length === 0 ? (
//             <div className="text-center py-12">
//               <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
//               <h3 className="mt-4 text-lg font-medium">Không có cảnh báo nào</h3>
//               <p className="mt-2 text-gray-500">Không tìm thấy cảnh báo nào phù hợp với bộ lọc của bạn</p>
//             </div>
//           ) : (
//             <div className="space-y-6">
//               {alerts.map((alert) => (
//                 <Card key={alert._id} className="overflow-hidden">
//                   <div className={`h-1 ${alert.riskLevel === 'HIGH' ? 'bg-red-500' : alert.riskLevel === 'MEDIUM' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
//                   <CardContent className="p-6">
//                     <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
//                       <div>
//                         <div className="flex items-center gap-2 mb-2">
//                           <User className="h-4 w-4" />
//                           <h3 className="font-medium">
//                             {alert.enrollmentId.studentId.firstName} {alert.enrollmentId.studentId.lastName}
//                           </h3>
//                           <Badge variant="outline">{alert.enrollmentId.studentId.email}</Badge>
//                         </div>
                        
//                         <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-4">
                          
//                           <Badge className={riskLevelColors[alert.riskLevel]}>
//                             {riskLevelLabels[alert.riskLevel]}
//                           </Badge>
//                           {alert.enrollmentId.courseId.subjectId && (
//                             <Badge variant="outline" className="flex items-center gap-1">
//                               <BookOpen className="h-3 w-3" />
//                               {alert.enrollmentId.courseId.subjectId.subjectCode}
//                             </Badge>
//                           )}
//                           <div className="flex items-center gap-1">
//                             <Calendar className="h-3 w-3" />
//                             {new Date(alert.date).toLocaleDateString('vi-VN')}
//                           </div>
//                         </div>
                        
//                         <div className="mb-4">
//                           <h4 className="font-medium mb-1">{alert.title}</h4>
//                           <p className="text-gray-600">{alert.content}</p>
//                         </div>
                        
//                         <div className="bg-gray-50 rounded-lg p-3">
//                           <h5 className="font-medium mb-2">Thông tin học tập:</h5>
//                           <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//                             {alert.enrollmentId.grade.map((grade, index) => (
//                               <div key={index} className="bg-white rounded p-2">
//                                 <p className="text-xs font-medium">{grade.type.toUpperCase()}</p>
//                                 <p className="text-sm">
//                                   {grade.score !== null ? Number(grade.score).toFixed(1) : 'N/A'}
//                                   <span className="text-xs text-gray-400"> ({Math.round(grade.weight * 100)}%)</span>
//                                 </p>
//                               </div>
//                             ))}
//                           </div>
//                           <p className="mt-2 text-sm">
//                             Trạng thái: 
//                             <Badge className="ml-2" variant={alert.enrollmentId.status === 'PASSED' ? 'default' : 'destructive'}>
//                               {alert.enrollmentId.status}
//                             </Badge>
//                           </p>
//                         </div>

//                         {alert.supervisorResponse && (
//                           <div className="mt-4 bg-green-50 rounded-lg p-3">
//                             <h5 className="font-medium mb-2">Phản hồi đã gửi:</h5>
//                             <p className="text-sm mb-1">
//                               <span className="font-medium">Lời khuyên:</span> {alert.supervisorResponse.response}
//                             </p>
//                             <p className="text-sm">
//                               <span className="font-medium">Kế hoạch:</span> {alert.supervisorResponse.plan}
//                             </p>
//                             {alert.supervisorResponse.createdAt && (
//                               <div className="mt-2 flex items-center text-xs text-gray-500">
//                                 <Clock className="h-3 w-3 mr-1" />
//                                 {new Date(alert.supervisorResponse.createdAt).toLocaleString('vi-VN')}
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>
                      
//                       <div className="mt-4 md:mt-0">
//                         {alert.status === 'NOT RESPONDED' ? (
//                           <Button 
//                             onClick={() => {
//                               setSelectedAlertId(alert._id)
//                               setDialogOpen(true)
//                             }}
//                           >
//                             <MessageSquare className="w-4 h-4 mr-2" />
//                             Phản hồi
//                           </Button>
//                         ) : alert.status === 'RESPONDED' ? (
//                           <Button 
//                             variant="outline"
//                             onClick={async () => {
//                               try {
//                                 await updateAlert(alert._id, { status: "RESOLVED" })
//                                 toast({
//                                   title: "Cập nhật thành công",
//                                   description: "Cảnh báo đã được đánh dấu là đã giải quyết",
//                                 })
//                                 refetch()
//                               } catch (error) {
//                                 toast({
//                                   title: "Lỗi",
//                                   description: "Có lỗi xảy ra khi cập nhật trạng thái",
//                                   variant: "destructive",
//                                 })
//                               }
//                             }}
//                           >
//                             Đánh dấu đã giải quyết
//                           </Button>
//                         ) : (
//                           <Badge className="bg-blue-100 text-blue-800">Đã giải quyết</Badge>
//                         )}
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}

          
//               {totalPages > 1 && (
//                 <div className="flex items-center justify-center gap-2 mt-6">
//                   <Button
//                     variant="outline"
//                     size="icon"
//                     onClick={() => handlePageChange(filters.page - 1)}
//                     disabled={filters.page === 1}
//                   >
//                     <ChevronLeft className="h-4 w-4" />
//                   </Button>
//                   <div className="text-sm">
//                     Trang {filters.page} / {totalPages}
//                   </div>
//                   <Button
//                     variant="outline"
//                     size="icon"
//                     onClick={() => handlePageChange(filters.page + 1)}
//                     disabled={filters.page === totalPages}
//                   >
//                     <ChevronRight className="h-4 w-4" />
//                   </Button>
//                 </div>
//               )}
//             </div>
//           )}
//         </CardContent>
//       </Card>  */}

//       {/* Response Dialog */}
//       <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
//         <DialogContent className="sm:max-w-lg">
//           <DialogHeader>
//             <DialogTitle>Phản hồi cảnh báo</DialogTitle>
//             <DialogDescription>
//               Cung cấp lời khuyên và kế hoạch hỗ trợ cho sinh viên
//             </DialogDescription>
//           </DialogHeader>
          
//           {selectedAlert && (
//             <div className="grid gap-4 py-4">
//               <div className="p-4 bg-gray-50 rounded-lg">
//                 <h4 className="font-medium mb-2">Thông tin cảnh báo:</h4>
//                 <p className="text-sm mb-1"><span className="font-medium">Sinh viên:</span> {selectedAlert.enrollmentId.studentId.firstName} {selectedAlert.enrollmentId.studentId.lastName}</p>
//                 <p className="text-sm mb-1"><span className="font-medium">Tiêu đề:</span> {selectedAlert.title}</p>
//                 <p className="text-sm"><span className="font-medium">Nội dung:</span> {selectedAlert.content}</p>
//               </div>
              
//               <div>
//                 <Label htmlFor="advice" className="mb-2">
//                   Lời khuyên cho sinh viên
//                 </Label>
//                 <Textarea
//                   id="advice"
//                   placeholder="Nhập lời khuyên của bạn..."
//                   value={responseData.response}
//                   onChange={(e) => setResponseData({ ...responseData, response: e.target.value })}
//                   className="min-h-[100px]"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="plan" className="mb-2">
//                   Kế hoạch hỗ trợ
//                 </Label>
//                 <Textarea
//                   id="plan"
//                   placeholder="Nhập kế hoạch hỗ trợ (các bước cụ thể)..."
//                   value={responseData.plan}
//                   onChange={(e) => setResponseData({ ...responseData, plan: e.target.value })}
//                   className="min-h-[150px]"
//                 />
//               </div>
//             </div>
//           )}
          
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setDialogOpen(false)}>
//               Huỷ
//             </Button>
//             <Button onClick={handleSubmitResponse} disabled={isUpdating}>
//               {isUpdating ? "Đang xử lý..." : "Gửi phản hồi"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }
