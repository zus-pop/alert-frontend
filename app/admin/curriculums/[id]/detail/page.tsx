'use client';
import { useRouter } from 'next/navigation';
import { useCurriculum } from '@/hooks/useCurriculums';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, ArrowLeft, Edit } from 'lucide-react';

// Define extended subject type to include semesterNumber
type ExtendedSubject = {
  _id: string;
  subjectCode: string;
  subjectName: string;
  semesterNumber?: number;
};

export default function CurriculumDetailPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const router = useRouter();
  const { toast } = useToast();
  const { data: curriculum, isLoading, error } = useCurriculum(id);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen p-6 rounded-md flex justify-center items-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-gray-500">Loading curriculum data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen p-6 rounded-md">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
        <button 
          onClick={() => router.push('/admin/curriculums')}
          className="text-blue-500 hover:underline flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Return to curriculum list
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen p-6 rounded-md">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <button 
            onClick={() => router.push('/admin/curriculums')}
            className="bg-white mr-4 p-2 rounded-lg shadow-sm hover:shadow transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
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
              Curriculum Details
            </h2>
            <p className="text-gray-600 mt-2 ml-12">View detailed information about this curriculum</p>
          </div>
        </div>
        <Button
          onClick={() => router.push(`/admin/curriculums/${id}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit Curriculum
        </Button>
      </div>

      <Card className="shadow-sm border border-gray-100 mb-8 overflow-hidden">
        <CardHeader className="bg-blue-50 border-b border-blue-100 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-gray-800">{curriculum?.curriculumName}</CardTitle>
            <div className="flex items-center gap-2">
              {typeof curriculum?.comboId === 'object' && curriculum?.comboId !== null && (
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 font-medium py-1">
                  Combo: {curriculum?.comboId?.comboName} ({curriculum?.comboId?.comboCode})
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-8">

            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                  <path d="M12 11h4" />
                  <path d="M12 16h4" />
                  <path d="M8 11h.01" />
                  <path d="M8 16h.01" />
                </svg>
                Curriculum
              </h3>
              
              <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                {curriculum?.subjects && curriculum.subjects.length > 0 ? (
                  <div className="overflow-x-auto">
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
                          .sort((a: ExtendedSubject, b: ExtendedSubject) => {
                            // Convert to numbers for proper comparison and handle missing values
                            const semA = a.semesterNumber || 0;
                            const semB = b.semesterNumber || 0;
                            return semA - semB; // Sort from lowest to highest semester number
                          })
                          .map((subject: ExtendedSubject, index) => (
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
                  <p className="text-gray-500 italic text-center py-8">No subjects assigned to this curriculum</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
