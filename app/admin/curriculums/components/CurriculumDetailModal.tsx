'use client';

import { useState } from 'react';
import { useCurriculum } from '@/hooks/useCurriculums';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

// Define extended subject type to include semesterNumber
type SubjectWithSemester = {
  _id: string;
  subjectCode: string;
  subjectName: string;
  semesterNumber?: number | string;
};

export default function CurriculumDetailModal({ 
  curriculumId, 
  isOpen, 
  onClose 
}: { 
  curriculumId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { data: curriculum, isLoading, error } = useCurriculum(curriculumId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
            <p className="text-gray-500">Loading curriculum data...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-red-500">
            <p>Error loading curriculum: {error.message}</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle className="text-2xl font-bold text-gray-800">{curriculum?.curriculumName}</DialogTitle>
                {typeof curriculum?.comboId === 'object' && curriculum?.comboId !== null && (
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 font-medium py-1">
                    {curriculum?.comboId?.comboName} ({curriculum?.comboId?.comboCode})
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {typeof curriculum?.comboId === 'object' && curriculum?.comboId?.description}
              </p>
            </DialogHeader>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">Curriculum</h3>
              {curriculum?.subjects && curriculum.subjects.length > 0 ? (
                <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-100">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider w-16">STT</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Subject Code</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Subject Name</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider w-24">Term No</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[...curriculum.subjects]
                        .sort((a: SubjectWithSemester, b: SubjectWithSemester) => {
                          // Convert to numbers for proper comparison and handle missing values
                          const semA = a.semesterNumber ? parseInt(String(a.semesterNumber)) : 0;
                          const semB = b.semesterNumber ? parseInt(String(b.semesterNumber)) : 0;
                          return semA - semB; // Sort from lowest to highest semester number
                        })
                        .map((subject: SubjectWithSemester, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {subject.subjectCode}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {subject.subjectName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                            <Badge variant="outline" className={`${
                              subject.semesterNumber ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-500 border-gray-200'
                            } py-1 px-3`}>
                              {subject.semesterNumber || "0"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 italic text-center py-8 bg-gray-50 rounded-lg">
                  No subjects assigned to this curriculum
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="default" className="bg-blue-600" onClick={onClose}>
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
