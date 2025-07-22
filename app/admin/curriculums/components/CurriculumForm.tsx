'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { useCombos } from '@/hooks/useCombos';
import { useSubjects } from '@/hooks/useSubjects';
import { useEffect, useState } from 'react';
import { CurriculumCreateParams, SubjectSemester } from '@/services/curriculumApi.types';
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  curriculumName: z.string().min(1, 'Name is required'),
  comboId: z.string().min(1, 'Combo is required'),
  subjects: z.array(
    z.object({
      subjectId: z.string(),
      semesterNumber: z.number()
    })
  ).min(1, 'At least one subject is required'),
});

export type CurriculumFormValues = CurriculumCreateParams;

export default function CurriculumForm({
  defaultValues,
  onSubmit,
  loading,
  submitLabel,
  cancelLabel,
  onCancel,
}: {
  defaultValues?: Partial<CurriculumFormValues>;
  onSubmit: (data: CurriculumFormValues) => void;
  loading?: boolean;
  submitLabel: string;
  cancelLabel: string;
  onCancel: () => void;
}) {
  const form = useForm<CurriculumFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || { curriculumName: '', comboId: '', subjects: []},
  });
  
  const { data: combosData, isLoading: isLoadingCombos } = useCombos();
  const { data: subjectsData, isLoading: isLoadingSubjects } = useSubjects({ limit: 1000 });
  console.log('Combos data:', combosData);
  console.log('Subjects data:', subjectsData);
  
  const combos = combosData?.data || [];
  const subjects = subjectsData?.data || [];

  // State to track semester number for new subject entries
  const [semesterNumber, setSemesterNumber] = useState<number>(1);
  
  // State to track selected subjects for UI display
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectSemester[]>([]);
  
  // Update form when defaultValues change (for edit mode)
 useEffect(() => {
  if (defaultValues && subjects.length > 0) {
    const mappedSubjects = (defaultValues.subjects || []).map(s => ({
      subjectId: s.subjectId || s._id,
      subjectName:
        s.subjectName || subjects.find(sub => sub._id === (s.subjectId || s._id))?.subjectName || '',
      semesterNumber: s.semesterNumber
    }));

    form.reset({
      ...defaultValues,
      subjects: mappedSubjects
    });
    setSelectedSubjects(mappedSubjects);
  }
}, [defaultValues, subjects, form]);

  // Find subject name by ID for display
  const getSubjectName = (id: string) => {
    const subject = subjects.find(s => s._id === id);
    console.log('Finding subject name for ID:', id, 'Found:', subject);
    return subject ? subject.subjectName : id;
  };

  // Handle subject selection/deselection
const toggleSubject = (subjectId: string) => {
  const currentSubjects = form.getValues("subjects") || [];
  const subjectIndex = currentSubjects.findIndex(s => s.subjectId === subjectId);

  if (subjectIndex >= 0) {
    // Xóa subject nếu đã chọn
    const newValues = currentSubjects.filter(s => s.subjectId !== subjectId);
    form.setValue("subjects", newValues, { shouldValidate: true });
    setSelectedSubjects(newValues);
  } else {
    // Lấy subject từ subjectsData
    const subjectInfo = subjects.find(s => s._id === subjectId);
    if (!subjectInfo) return;

    const newValues = [
      ...currentSubjects,
      {
        subjectId: subjectInfo._id,
        subjectName: subjectInfo.subjectName,
        semesterNumber: semesterNumber
      }
    ];
    form.setValue("subjects", newValues, { shouldValidate: true });
    setSelectedSubjects(newValues);
  }
};

  // Remove a subject from selection
  const removeSubject = (subjectId: string) => {
    const newValues = form.getValues("subjects").filter(s => s.subjectId !== subjectId);
    form.setValue("subjects", newValues, { shouldValidate: true });
    setSelectedSubjects(newValues);
  };

  return (
    <Card className="shadow-sm border-slate-200">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="curriculumName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Curriculum Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter curriculum name" 
                      className="h-12" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* <FormItem>
              <FormLabel className="text-base font-medium">Default Semester Number for Subjects</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="Enter default semester number for new subjects" 
                  className="h-12" 
                  value={semesterNumber}
                  onChange={(e) => setSemesterNumber(parseInt(e.target.value) || 1)}
                  min="1"
                />
              </FormControl>
              <FormDescription>
                This number will be used as the default semester number for newly added subjects
              </FormDescription>
            </FormItem> */}
            
            <FormField
              control={form.control}
              name="comboId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-base font-medium">Combo</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          disabled={isLoadingCombos}
                          className={cn(
                            "h-12 w-full justify-between bg-white text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value 
                            ? combos.find(c => c._id === field.value)?.comboName || "Select combo" 
                            : "Select combo"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search combo..." />
                        <CommandEmpty>No combo found.</CommandEmpty>
                        <CommandGroup>
                          <ScrollArea className="h-64">
                            {combos.map((c) => (
                              <CommandItem
                                key={c._id}
                                value={c.comboName}
                                onSelect={() => {
                                  form.setValue("comboId", c._id, { shouldValidate: true });
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    c._id === field.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {c.comboName}
                              </CommandItem>
                            ))}
                          </ScrollArea>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="subjects"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-base font-medium">Subjects</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          disabled={isLoadingSubjects}
                          className={cn(
                            "h-12 w-full justify-between bg-white text-left font-normal",
                            !selectedSubjects.length && "text-muted-foreground"
                          )}
                        >
                          {selectedSubjects.length > 0
                            ? `${selectedSubjects.length} subject(s) selected`
                            : "Select subjects"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search subjects..." />
                        <CommandEmpty>No subject found.</CommandEmpty>
                        <CommandGroup>
                          <ScrollArea className="h-64">
                            {subjects.map((s) => (
                              <CommandItem
                                key={s._id}
                                value={s.subjectName}
                                onSelect={() => toggleSubject(s._id)}
                              >
                                <div className="flex items-center">
                                  <div 
                                    className={cn(
                                      "mr-2 h-4 w-4 border rounded flex items-center justify-center",
                                      selectedSubjects.some(subject => subject.subjectId === s._id) 
                                        ? "bg-primary border-primary" 
                                        : "border-input"
                                    )}
                                  >
                                    {selectedSubjects.some(subject => subject.subjectId === s._id) && (
                                      <Check className="h-3 w-3 text-white" />
                                    )}
                                  </div>
                                  {/* {console.log('Rendering subject:', s)} */}
                                  {s.subjectName}
                                </div>
                              </CommandItem>
                            ))}
                          </ScrollArea>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  
                  {/* Show selected subjects as badges with editable semester number */}
                  {selectedSubjects.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedSubjects.map(subject => (
                       
                        <Badge 
                          key={subject.subjectId} 
                          variant="secondary"
                          className="px-2.5 py-1 text-sm rounded-md flex items-center"
                        >
                          {console.log('Rendering subject:', subject)}
                          <span>{subject.subjectName}</span>

                          <span className="ml-1 mr-1">
                            (Semester: 
                            <Input 
                              type="number" 
                              className="w-12 h-6 px-1 ml-1 mr-1 inline-block"
                              value={subject.semesterNumber}
                              min="1"
                              onChange={(e) => {
                                const newSemester = parseInt(e.target.value) || 1;
                                const newSubjects = selectedSubjects.map(s => 
                                  s.subjectId === subject.subjectId 
                                    ? { ...s, semesterNumber: newSemester } 
                                    : s
                                );
                                form.setValue("subjects", newSubjects, { shouldValidate: true });
                                setSelectedSubjects(newSubjects);
                              }}
                            />
                            )
                          </span>
                          <button 
                            type="button"
                            onClick={() => removeSubject(subject.subjectId)}
                            className="ml-2 text-muted-foreground hover:text-foreground"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <FormDescription>
                    {selectedSubjects.length > 0 
                      ? `${selectedSubjects.length} subject(s) selected` 
                      : "Select at least one subject for this curriculum"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-3 justify-end pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel} 
                disabled={loading}
                className="min-w-[120px] h-11"
              >
                {cancelLabel}
              </Button>
              <Button 
                type="submit" 
                disabled={loading} 
                className="min-w-[120px] h-11"
              >
                {loading ? 'Processing...' : submitLabel}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 