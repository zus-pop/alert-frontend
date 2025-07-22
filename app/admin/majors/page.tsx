'use client';

import { useMajors, useDeleteMajor } from '@/hooks/useMajors';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Major } from '@/services/majorApi.types';
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

export default function MajorListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading, error } = useMajors({ 
    ...(filter ? { majorName: filter } : {}), 
    page, 
    limit 
  });
  const { mutate: deleteMajor, isPending: isDeleting } = useDeleteMajor();

  return (
    <div className="bg-slate-50 min-h-screen p-6 rounded-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Major Management</h2>
          <p className="text-gray-600 mt-1">Manage majors information in the system</p>
        </div>
        <Button 
          onClick={() => router.push('/admin/majors/new')} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          Add New Major
        </Button>
      </div>
      
      <div className="flex flex-wrap items-center gap-4 mb-6 bg-white p-4 rounded-md shadow-sm">
        <div className="flex-1 min-w-[200px]">
          <input
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search by major name..."
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
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 tracking-wider">Major Code</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 tracking-wider">Major Name</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 tracking-wider w-[160px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data?.data?.map((major: Major) => (
                <tr key={major._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">{major.majorCode}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{major.majorName}</td>
                  <td className="px-6 py-4">
                    {/* <div className="flex justify-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => router.push(`/admin/majors/${major._id}`)}
                        className="text-xs font-medium px-3"
                      >
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => setDeleteId(major._id)}
                        className="text-xs font-medium px-3"
                      >
                        Delete
                      </Button>
                    </div> */}
                    <div className="relative group">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-xs font-medium px-3 border-gray-200 text-gray-600 hover:bg-gray-50"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                          </svg>
                        </Button>
                        <div className="  mt-2 w-36 bg-white rounded-md shadow-lg z-10 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <div className="py-1">
                            <button
                              onClick={() => router.push(`/admin/majors/${major._id}`)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 w-full text-left"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteId(major._id)}
                              className="flex items-center px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full text-left"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                  </td>
                </tr>
              ))}
              {(!data?.data || data.data.length === 0) && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500 italic">
                    No majors records found.
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
            <AlertDialogTitle className="text-xl font-bold text-gray-800">Are you sure you want to delete this major?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              This action cannot be undone. This will permanently delete the major.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="font-medium">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  deleteMajor(deleteId, {
                    onSuccess: () => {
                      toast({
                        title: "Major deleted",
                        description: "The major has been successfully deleted.",
                      });
                      setDeleteId(null);
                    },
                    onError: (error) => {
                      toast({
                        title: "Error",
                        description: `Failed to delete major: ${error.message}`,
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
