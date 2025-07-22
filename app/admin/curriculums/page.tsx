'use client';

import { useCurriculums, useDeleteCurriculum, useCreateCurriculum } from '@/hooks/useCurriculums';
import { getCurriculums } from '@/services/curriculumApi';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Curriculum } from '@/services/curriculumApi.types';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import CurriculumDetailModal from './components/CurriculumDetailModal';

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
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedCurriculumId, setSelectedCurriculumId] = useState<string | null>(null);
  const { data, isLoading, error } = useCurriculums({ 
    ...(filter ? { curriculumName: filter } : {}), 
    page, 
    limit 
  });
  const { mutate: deleteCurriculum, isPending: isDeleting } = useDeleteCurriculum();

  
  
  

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen p-6 rounded-md">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span className="bg-blue-100 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                <path d="M8 7h6" />
                <path d="M8 11h8" />
                <path d="M8 15h5" />
              </svg>
            </span>
            Curriculum Management
          </h2>
          <p className="text-gray-600 mt-2 ml-12">Manage curriculum information and structure in the system</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => router.push('/admin/curriculums/new')} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-5 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            Add New Curriculum
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-4 mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-3.5 text-gray-400">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Search by curriculum name..."
              value={filter}
              onChange={e => {
                setFilter(e.target.value);
                setPage(1); // Reset to first page when filtering
              }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select 
            className="p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className="font-medium hover:bg-gray-100 transition-colors"
          >
            Reset
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-blue-600 font-medium">Loading curricula...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-5 rounded-xl border border-red-200 my-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="font-medium">Error: {error.message}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wider">Curriculum Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wider">Combo</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 tracking-wider w-[220px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data?.data?.map((c: Curriculum) => (
                <tr key={c._id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">{c.curriculumName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {typeof c.comboId === 'object' && c.comboId !== null 
                      ? <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md font-medium">{c.comboId.comboName}</span>
                      : c.comboId}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedCurriculumId(c._id)}
                        className="text-xs font-medium px-3 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        Detail
                      </Button>
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
                        <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-10 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <div className="py-1">
                            <button
                              onClick={() => router.push(`/admin/curriculums/${c._id}`)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 w-full text-left"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteId(c._id)}
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
                    </div>
                  </td>
                </tr>
              ))}
              {(!data?.data || data.data.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 mb-3">
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                        <path d="M8 7h6" />
                        <path d="M8 11h8" />
                        <path d="M8 15h5" />
                      </svg>
                      <p className="text-gray-500 font-medium">No curriculum records found</p>
                      <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
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
        <AlertDialogContent className="rounded-xl border-0 shadow-lg max-w-md">
          <AlertDialogHeader>
            <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" x2="10" y1="11" y2="17" />
                <line x1="14" x2="14" y1="11" y2="17" />
              </svg>
            </div>
            <AlertDialogTitle className="text-xl font-bold text-gray-800 text-center">Delete Curriculum</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-center">
              Are you sure you want to delete this curriculum? This action cannot be undone and will permanently remove the curriculum data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex gap-3">
            <AlertDialogCancel className="font-medium w-full">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  deleteCurriculum(deleteId, {
                    onSuccess: () => {
                      toast({
                        title: "Curriculum deleted",
                        description: "The curriculum has been successfully deleted."
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
              className="bg-red-500 hover:bg-red-600 text-white font-medium w-full"
            >
              {isDeleting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </span>
              ) : (
                "Delete Curriculum"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Detail Modal */}
      {selectedCurriculumId && (
        <CurriculumDetailModal
          curriculumId={selectedCurriculumId}
          isOpen={!!selectedCurriculumId}
          onClose={() => setSelectedCurriculumId(null)}
        />
      )}
    </div>
  );
} 