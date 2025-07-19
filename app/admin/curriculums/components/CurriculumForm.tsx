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
import { CurriculumCreateParams } from '@/services/curriculumApi.types';
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
  subjectIds: z.array(z.string()).min(1, 'At least one subject is required'),
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
    defaultValues: defaultValues || { curriculumName: '', comboId: '', subjectIds: [] },
  });
  
  const { data: combosData, isLoading: isLoadingCombos } = useCombos();
  const { data: subjectsData, isLoading: isLoadingSubjects } = useSubjects();
  
  const combos = combosData?.data || [];
  const subjects = subjectsData?.data || [];

  // State to track selected subjects for UI display
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  
  // Update form when defaultValues change (for edit mode)
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
      setSelectedSubjects(defaultValues.subjectIds || []);
    }
  }, [defaultValues, form]);

  // Find subject name by ID for display
  const getSubjectName = (id: string) => {
    const subject = subjects.find(s => s._id === id);
    return subject ? subject.subjectName : id;
  };

  // Handle subject selection/deselection
  const toggleSubject = (subjectId: string) => {
    const currentValues = form.getValues("subjectIds") || [];
    let newValues: string[];
    
    if (currentValues.includes(subjectId)) {
      newValues = currentValues.filter(id => id !== subjectId);
    } else {
      newValues = [...currentValues, subjectId];
    }
    
    form.setValue("subjectIds", newValues, { shouldValidate: true });
    setSelectedSubjects(newValues);
  };

  // Remove a subject from selection
  const removeSubject = (subjectId: string) => {
    const newValues = form.getValues("subjectIds").filter(id => id !== subjectId);
    form.setValue("subjectIds", newValues, { shouldValidate: true });
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
              name="subjectIds"
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
                                      selectedSubjects.includes(s._id) 
                                        ? "bg-primary border-primary" 
                                        : "border-input"
                                    )}
                                  >
                                    {selectedSubjects.includes(s._id) && (
                                      <Check className="h-3 w-3 text-white" />
                                    )}
                                  </div>
                                  {s.subjectName}
                                </div>
                              </CommandItem>
                            ))}
                          </ScrollArea>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  
                  {/* Show selected subjects as badges */}
                  {selectedSubjects.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedSubjects.map(subjectId => (
                        <Badge 
                          key={subjectId} 
                          variant="secondary"
                          className="px-2.5 py-1 text-sm rounded-md"
                        >
                          {getSubjectName(subjectId)}
                          <button 
                            type="button"
                            onClick={() => removeSubject(subjectId)}
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