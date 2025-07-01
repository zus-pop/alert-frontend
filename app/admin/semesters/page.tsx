'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from '@/components/ui/pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Loader2, 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  CalendarRange, 
  Calendar, 
  CalendarDays, 
  CalendarCheck,
  Download,
  Upload,
  RefreshCw,
  MoreHorizontal
} from 'lucide-react';
import { useSemesters, useDeleteSemester } from '@/hooks/useSemesters';
import { SemestersQueryParams } from '@/services/semesterApi';
import { format } from 'date-fns';

export default function SemestersPage() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<SemestersQueryParams>({
    page: 1,
    limit: 10,
  });
  const [semesterToDelete, setSemesterToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Data for table with filters
  const { data, isLoading, isError, error } = useSemesters(searchParams);
  
  // Data for stats - get all semesters without pagination or filters
  const { data: allSemestersData } = useSemesters({ limit: 9999 });
  
  const deleteSemester = useDeleteSemester();

  // Handle input change without searching immediately
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    
    // If the search field is cleared, reset search filters
    if (e.target.value === '') {
      setSearchParams(prev => ({
        ...prev,
        page: 1,
        semesterName: undefined,
      }));
    }
  };
  
  // Execute search when button is clicked
  const handleSearchButtonClick = () => {
    setSearchParams(prev => ({
      ...prev,
      page: 1,
      semesterName: searchQuery ? searchQuery : undefined,
    }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({
      ...prev,
      page,
    }));
  };

  const handleDelete = async () => {
    if (semesterToDelete) {
      try {
        await deleteSemester.mutateAsync(semesterToDelete);
        setSemesterToDelete(null);
      } catch (error) {
        console.error('Failed to delete semester:', error);
      }
    }
  };

  // Format date to display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Get current date for comparing with semester dates
  const now = new Date();
  
  // Calculate stats for active, upcoming, and completed semesters
  const stats = {
    total: allSemestersData?.totalItems || 0,
    active: allSemestersData?.data?.filter(semester => {
      const start = new Date(semester.startDate);
      const end = new Date(semester.endDate);
      return start <= now && end >= now;
    }).length || 0,
    upcoming: allSemestersData?.data?.filter(semester => {
      const start = new Date(semester.startDate);
      return start > now;
    }).length || 0,
    completed: allSemestersData?.data?.filter(semester => {
      const end = new Date(semester.endDate);
      return end < now;
    }).length || 0,
  };

  // Helper to determine semester status
  const getSemesterStatus = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > now) return { status: 'upcoming', label: 'Upcoming', color: 'bg-blue-100 text-blue-800' };
    if (end < now) return { status: 'completed', label: 'Completed', color: 'bg-gray-100 text-gray-800' };
    return { status: 'active', label: 'Active', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Semester Management</h2>
          <p className="text-gray-600">Manage semester information in the system</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button 
            onClick={() => router.push('/admin/semesters/new')}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Semester
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Semesters</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <CalendarRange className="w-8 h-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
              </div>
              <div className="p-2 bg-emerald-100 rounded-full">
                <CalendarCheck className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-gray-600">{stats.completed}</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-full">
                <CalendarDays className="w-8 h-8 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Semesters Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Semester List</CardTitle>
              <CardDescription>
                Manage semester information in the system
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by semester name..."
                className="pl-8 w-full md:max-w-sm"
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
            </div>
            <Button 
              variant="default"
              size="sm"
              onClick={handleSearchButtonClick}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-destructive">
              Error loading semesters: {error?.message || 'Unknown error'}
            </div>
          ) : data?.data?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No semesters found. Add a new semester to get started.
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold">Semester Name</TableHead>
                    <TableHead className="font-semibold">Start Date</TableHead>
                    <TableHead className="font-semibold">End Date</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.map((semester) => {
                    const status = getSemesterStatus(semester.startDate, semester.endDate);
                    return (
                      <TableRow key={semester._id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{semester.semesterName}</TableCell>
                        <TableCell>{formatDate(semester.startDate)}</TableCell>
                        <TableCell>{formatDate(semester.endDate)}</TableCell>
                        <TableCell>
                          <Badge className={status.color}>{status.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => router.push(`/admin/semesters/${semester._id}`)}>
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => setSemesterToDelete(semester._id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
                    const pageNumber = index + 1;
                    // Show current page, first, last, and pages around current
                    if (
                      pageNumber === 1 ||
                      pageNumber === data.totalPage ||
                      (pageNumber >= searchParams.page! - 1 && pageNumber <= searchParams.page! + 1)
                    ) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink 
                            isActive={pageNumber === searchParams.page}
                            onClick={() => handlePageChange(pageNumber)}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    
                    // Add ellipsis if needed
                    if (pageNumber === 2 || pageNumber === data.totalPage - 1) {
                      return (
                        <PaginationItem key={pageNumber}>
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

      <AlertDialog open={!!semesterToDelete} onOpenChange={(open) => !open && setSemesterToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the semester.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteSemester.isPending ? (
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
