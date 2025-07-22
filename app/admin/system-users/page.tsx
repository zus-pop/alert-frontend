'use client';

import { useState, useMemo } from 'react';
import { useSystemUsers, useDeleteSystemUser } from '@/hooks/useSystemUsers';
import { Button } from '@/components/ui/button';
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  Download, 
  Upload, 
  RefreshCw,
  Users,
  UserCog,
  UserCheck,
  MoreHorizontal,
  Loader2
} from 'lucide-react';
import { SystemUsersQueryParams } from '@/services/systemUserApi';
import { useRouter } from 'next/navigation';

export default function SystemUsersPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<SystemUsersQueryParams>({
    page: 1,
    limit: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  
  // Memoize filters to prevent unnecessary API calls
  const memoizedFilters = useMemo(() => filters, [filters]);
  
  // Data for the table with filters
  const { data, isLoading, error } = useSystemUsers(memoizedFilters);
  
  // Data for stats - get all users without filters
  const { data: allUsersData } = useSystemUsers({ limit: 9999 });
  
  const deleteSystemUserMutation = useDeleteSystemUser();

  // Debounced search implementation
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    
    const timer = setTimeout(() => {
      if (e.target.value === '') {
        setFilters(prev => ({
          ...prev,
          page: 1,
          email: undefined,
          firstName: undefined,
          lastName: undefined
        }));
      } else {
        // Search only by email
        setFilters(prev => ({
          ...prev,
          page: 1,
          email: e.target.value,
          firstName: undefined,
          lastName: undefined
        }));
      }
    }, 500);

    return () => clearTimeout(timer);
  };
  
  const handleRoleChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      role: value === 'ALL' ? undefined : value,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page,
    }));
  };

  const handleAddUser = () => {
    router.push('/admin/system-users/new');
  };

  const handleEditUser = (id: string) => {
    router.push(`/admin/system-users/${id}`);
  };
  
  const handleDeleteUser = () => {
    if (userToDelete) {
      deleteSystemUserMutation.mutate(userToDelete);
      setUserToDelete(null);
    }
  };

  const refreshData = () => {
    // Force a refresh of the data
    setFilters({ ...filters });
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    if (!data) return null;
    
    const totalPages = data.totalPage;
    const currentPage = filters.page || 1;
    
    let items = [];
    
    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Show current page and neighbors
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i !== 1 && i !== totalPages) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    
    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  // Calculate user statistics from all users data
  const stats = {
    total: allUsersData?.totalItems || 0,
    admins: allUsersData?.data.filter(user => user.role === 'ADMIN').length || 0,
    managers: allUsersData?.data.filter(user => user.role === 'MANAGER').length || 0,
    supervisors: allUsersData?.data.filter(user => user.role === 'SUPERVISOR').length || 0,
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Failed to load system users</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Users Management</h2>
          <p className="text-gray-600">Manage all administrators, managers, and supervisors in the system</p>
        </div>
        <div className="flex items-center gap-3">
         
          <Button 
            onClick={handleAddUser}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="w-8 h-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <UserCog className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Managers</p>
                <p className="text-2xl font-bold text-blue-600">{stats.managers}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <UserCheck className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Supervisors</p>
                <p className="text-2xl font-bold text-green-600">{stats.supervisors}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>System Users</CardTitle>
              <CardDescription>
                All system users including admins, managers, and supervisors
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={refreshData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by email..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-8 w-full md:max-w-sm"
              />
            </div>
            <div className="w-[180px]">
              <Select 
                value={filters.role || "ALL"} 
                onValueChange={handleRoleChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Roles</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : data?.data.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No system users found. Add a new user to get started.
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Role</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.map((user) => (
                    <TableRow key={user._id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-gray-600">{user.email}</div>
                      </TableCell>                      
                      <TableCell>
                        <Badge className={`px-2 py-1 ${
                          user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800 hover:bg-purple-100' : 
                          user.role === 'MANAGER' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : 
                          'bg-green-100 text-green-800 hover:bg-green-100'
                        }`}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditUser(user._id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setUserToDelete(user._id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
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

          {/* Pagination */}
          {data && data.totalPage > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(Math.max(1, (filters.page || 1) - 1))}
                      className={`${(filters.page || 1) <= 1 ? 'pointer-events-none opacity-50' : ''}`}
                    />
                  </PaginationItem>
                  
                  {renderPaginationItems()}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(Math.min(data.totalPage, (filters.page || 1) + 1))}
                      className={`${(filters.page || 1) >= data.totalPage ? 'pointer-events-none opacity-50' : ''}`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={userToDelete !== null} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete System User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
