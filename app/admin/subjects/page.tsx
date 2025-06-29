'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSubjects, useDeleteSubject } from '@/hooks/useSubjects';
import {
  Pencil, 
  Trash2, 
  Plus, 
  Search, 
  Loader2, 
  Download, 
  Upload,
  BookOpen, 
  BookOpenCheck,
  BookX,
  BarChart4,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';
import { SubjectsQueryParams } from '@/services/subjectApi';

export default function SubjectsPage() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<SubjectsQueryParams>({
    page: 1,
    limit: 10,
  });
  const [subjectToDelete, setSubjectToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const memoizedSearchParams = useMemo(() => searchParams, [searchParams]);

  // Data for table with filters
  const { data, isLoading, isError, error } = useSubjects(memoizedSearchParams);
  
  // Data for stats - get all subjects without pagination or filters
  const { data: allSubjectsData } = useSubjects({ limit: 9999 });
  
  const deleteSubject = useDeleteSubject();

  // Handle input change without searching immediately
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    
    // If the search field is cleared, reset search filters
    if (e.target.value === '') {
      setSearchParams(prev => ({
        ...prev,
        page: 1,
        subjectCode: undefined,
        subjectName: undefined,
      }));
    }
  };
  
  // Execute search by subject code
  const handleSearchByCodeClick = () => {
    setSearchParams(prev => ({
      ...prev,
      page: 1,
      subjectCode: searchQuery ? searchQuery : undefined,
      subjectName: undefined,
    }));
  };

  // Execute search by subject name
  const handleSearchByNameClick = () => {
    setSearchParams(prev => ({
      ...prev,
      page: 1,
      subjectCode: undefined,
      subjectName: searchQuery ? searchQuery : undefined,
    }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({
      ...prev,
      page,
    }));
  };

  const handleDelete = async () => {
    if (subjectToDelete) {
      try {
        await deleteSubject.mutateAsync(subjectToDelete);
        setSubjectToDelete(null);
      } catch (error) {
        console.error('Failed to delete subject:', error);
      }
    }
  };

  // Calculate stats from all subjects data
  const stats = {
    total: allSubjectsData?.totalItems || 0,
    active: allSubjectsData?.data?.length || 0, // Assuming all subjects are active if no status field
    inactive: 0, // Update this if you have a status field to check
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Môn học</h2>
          <p className="text-gray-600">Quản lý thông tin và dữ liệu môn học</p>
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
          <Button 
            onClick={() => router.push('/admin/subjects/new')}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm môn học
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Tổng số môn học</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Môn học đang hoạt động</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
              </div>
              <div className="p-2 bg-emerald-100 rounded-full">
                <BookOpenCheck className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Môn học không hoạt động</p>
                <p className="text-2xl font-bold text-rose-600">{stats.inactive}</p>
              </div>
              <div className="p-2 bg-rose-100 rounded-full">
                <BookX className="w-8 h-8 text-rose-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subjects Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách môn học</CardTitle>
              <CardDescription>
                Quản lý thông tin môn học trong hệ thống
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Làm mới
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm theo mã hoặc tên môn học..."
                className="pl-8 w-full md:max-w-sm"
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
            </div>
            <Button 
              variant="default"
              size="sm"
              onClick={handleSearchByCodeClick}
              className="bg-blue-600 hover:bg-blue-700 mr-2"
            >
              <Search className="h-4 w-4 mr-1" />
              Tìm theo mã
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={handleSearchByNameClick}
            >
              <Search className="h-4 w-4 mr-1" />
              Tìm theo tên
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-destructive">
              Error loading subjects: {error?.message || 'Unknown error'}
            </div>
          ) : data?.data?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No subjects found. Add a new subject to get started.
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-[120px] font-semibold">Mã môn học</TableHead>
                    <TableHead className="font-semibold">Tên môn học</TableHead>
                    <TableHead className="w-[150px] font-semibold">Ngày tạo</TableHead>
                    <TableHead className="text-right w-[100px] font-semibold">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data?.map((subject) => (
                    <TableRow key={subject._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <Badge variant="outline" className="font-mono">
                          {subject.subjectCode}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{subject.subjectName}</div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {subject.createdAt ? new Date(subject.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
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
                            <DropdownMenuItem onClick={() => router.push(`/admin/subjects/${subject._id}`)}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600" 
                              onClick={() => setSubjectToDelete(subject._id)}
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
          )}

          {data && data.totalPage > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(Math.max(1, searchParams.page! - 1))}
                      className={searchParams.page === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>

                  {Array.from({ length: data.totalPage }).map((_, index) => {
                    const page = index + 1;
                    // Show current page, first, last, and pages around current
                    if (
                      page === 1 ||
                      page === data.totalPage ||
                      (page >= searchParams.page! - 1 && page <= searchParams.page! + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={page === searchParams.page}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    
                    // Add ellipsis if needed
                    if (page === 2 || page === data.totalPage - 1) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    
                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(data.totalPage, searchParams.page! + 1))}
                      className={searchParams.page === data.totalPage ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!subjectToDelete} onOpenChange={(open) => !open && setSubjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the subject.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteSubject.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
