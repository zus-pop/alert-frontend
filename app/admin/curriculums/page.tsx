'use client';

import { useCurriculums, useDeleteCurriculum } from '@/hooks/useCurriculums';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Curriculum } from '@/services/curriculumApi.types';
import { useToast } from '@/hooks/use-toast';
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
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis
} from '@/components/ui/pagination';

export default function CurriculumListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading, error } = useCurriculums({ 
    ...(filter ? { curriculumName: filter } : {}), 
    page, 
    limit 
  });
  const { mutate: deleteCurriculum, isPending: isDeleting } = useDeleteCurriculum();

  return (
    <div className="bg-slate-50 min-h-screen p-6 rounded-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Curriculum Management</h2>
          <p className="text-gray-600 mt-1">Manage curriculum information in the system</p>
        </div>
        <Button 
          onClick={() => router.push('/admin/curriculums/new')} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          Add New Curriculum
        </Button>
      </div>
      
      <div className="flex flex-wrap items-center gap-4 mb-6 bg-white p-4 rounded-md shadow-sm">
        <div className="flex-1 min-w-[200px]">
          <input
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search by curriculum name..."
            value={filter}
            onChange={e => {
              setFilter(e.target.value);
              setPage(1); // Reset to first page when filtering
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <select 
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={e => setLimit(Number(e.target.value))}
            value={limit}
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
          <Button 
            variant="outline" 
            onClick={() => {
              setFilter('');
              setPage(1);
            }}
            className="font-medium"
          >
            Reset
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-md border border-red-200 my-4">
          <p className="font-medium">Error: {error.message}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 tracking-wider">Combo</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 tracking-wider">Subjects</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 tracking-wider w-[160px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data?.data?.map((c: Curriculum) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">{c.curriculumName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {typeof c.comboId === 'object' && c.comboId !== null 
                      ? c.comboId.comboName 
                      : c.comboId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {c.subjects?.map(s => s.subjectName).join(', ')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => router.push(`/admin/curriculums/${c._id}`)}
                        className="text-xs font-medium px-3"
                      >
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => setDeleteId(c._id)}
                        className="text-xs font-medium px-3"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!data?.data || data.data.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 italic">
                    No curriculum records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Pagination */}
      {data && data.totalPage > 1 && (
        <Pagination className="mt-6 flex justify-center">
          <PaginationContent className="bg-white rounded-lg shadow-sm px-2 py-1">
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => page > 1 && setPage(page - 1)} 
                className={`${page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-gray-100"} rounded-md transition-colors`}
              />
            </PaginationItem>
            
            {[...Array(data.totalPage)].map((_, index) => {
              const pageNumber = index + 1;
              // Show current page, first, last, and adjacent pages
              if (
                pageNumber === 1 || 
                pageNumber === data.totalPage || 
                (pageNumber >= page - 1 && pageNumber <= page + 1)
              ) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink 
                      onClick={() => setPage(pageNumber)}
                      isActive={page === pageNumber}
                      className={`${page === pageNumber ? "bg-blue-600 text-white hover:bg-blue-700" : "hover:bg-gray-100"} font-medium transition-colors`}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              // Show ellipsis if there's a gap
              else if (
                (pageNumber === 2 && page > 3) || 
                (pageNumber === data.totalPage - 1 && page < data.totalPage - 2)
              ) {
                return <PaginationItem key={pageNumber}><PaginationEllipsis /></PaginationItem>;
              }
              return null;
            })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => page < data.totalPage && setPage(page + 1)}
                className={`${page >= data.totalPage ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-gray-100"} rounded-md transition-colors`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-lg border-0 shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-800">Are you sure you want to delete this curriculum?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              This action cannot be undone. This will permanently delete the curriculum.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="font-medium">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  deleteCurriculum(deleteId, {
                    onSuccess: () => {
                      toast({
                        title: "Curriculum deleted",
                        description: "The curriculum has been successfully deleted.",
                        variant: "success",
                      });
                      setDeleteId(null);
                    },
                    onError: (error) => {
                      toast({
                        title: "Error",
                        description: `Failed to delete curriculum: ${error.message}`,
                        variant: "destructive",
                      });
                    }
                  });
                }
              }}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white font-medium"
            >
              {isDeleting ? (
                <><span className="animate-pulse mr-2">●</span>Deleting...</>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 