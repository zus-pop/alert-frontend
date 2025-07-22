'use client';

import { useCombos, useDeleteCombo } from '@/hooks/useCombos';
import { Combo } from '@/services/comboApi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Loader2, Package } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis
} from '@/components/ui/pagination';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, Plus, Search, RefreshCw, MoreHorizontal } from 'lucide-react';

export default function CombosPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteComboId, setDeleteComboId] = useState<string | null>(null);
  const { toast } = useToast();

  // Get combos with pagination
  const { data, isLoading, error } = useCombos({
    page,
    limit: 10,
    comboName: searchTerm || undefined,
  });
  // Get all combos for stats
  const { data: allCombosData } = useCombos({ limit: 9999 });

  // Delete combo mutation
  const { mutate: deleteCombo, isPending: isDeleting } = useDeleteCombo();

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (deleteComboId) {
      deleteCombo(deleteComboId, {
        onSuccess: () => {
          setDeleteComboId(null);
          toast({
            title: 'Success',
            description: 'Combo deleted successfully',
          });
        },
      });
    }
  };

  // Handle edit button click
  const handleEdit = (id: string) => {
    // console.log('Edit combo with ID:', id);
    router.push(`/admin/combos/${id}`);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Stats
  const stats = {
    total: allCombosData?.totalItems || 0,
    byMajor: allCombosData?.data?.reduce((acc, combo) => {
      const major = typeof combo.majorId === 'object' && combo.majorId !== null ? combo.majorId.majorName : combo.majorId || 'Unknown';
      acc[major] = (acc[major] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {},
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Combo Management</h2>
          <p className="text-gray-600 mt-1">Manage combo information in the system</p>
        </div>
        <div className="flex items-center gap-3">
          
          <Button 
            onClick={() => router.push('/admin/combos/new')}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Combo
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="h-28 flex flex-col justify-center">
          <CardContent className="p-6 flex items-center justify-between h-full">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Total Combos</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        {Object.entries(stats.byMajor).slice(0, 3).map(([major, count]) => (
          <Card key={major} className="h-28 flex flex-col justify-center">
            <CardContent className="p-6 flex items-center justify-between h-full">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{major}</p>
                <p className="text-2xl font-bold">{count}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Badge className="w-8 h-8 text-blue-600">M</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Combo List Card */}
      <Card className="">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Combo List</CardTitle>
              <CardDescription>
                Manage combo information in the system
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2 justify-end">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by combo name..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <Button 
              variant="default"
              size="sm"
              onClick={() => setPage(1)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              Error loading combos: {error?.message || 'Unknown error'}
            </div>
          ) : data?.data?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No combos found. Add a new combo to get started.
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold">Code</TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Description</TableHead>
                    <TableHead className="font-semibold">Major</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.map((combo: Combo) => (
                    <TableRow key={combo._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{combo.comboCode}</TableCell>
                      <TableCell>{combo.comboName}</TableCell>
                      <TableCell>{combo.description}</TableCell>
                      <TableCell>
                        {typeof combo.majorId === 'object' && combo.majorId !== null
                        
                          ? <span className="font-medium">{`${combo.majorId.majorCode} - ${combo.majorId.majorName}`}</span>
                          : "Unknown"}
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
                            <DropdownMenuItem onClick={() => handleEdit(combo._id)}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => setDeleteComboId(combo._id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
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
                      onClick={() => handlePageChange(Math.max(1, page - 1))}
                      className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {Array.from({ length: data.totalPage }).map((_, index) => {
                    const pageNumber = index + 1;
                    if (
                      pageNumber === 1 ||
                      pageNumber === data.totalPage ||
                      (pageNumber >= page - 1 && pageNumber <= page + 1)
                    ) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink 
                            isActive={pageNumber === page}
                            onClick={() => handlePageChange(pageNumber)}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
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
                      onClick={() => handlePageChange(Math.min(data.totalPage, page + 1))}
                      className={page === data.totalPage ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteComboId} onOpenChange={(open) => !open && setDeleteComboId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this combo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
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
