'use client';

import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function MajorsLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (value: string) => {
    if (value === 'list') {
      router.push('/admin/majors');
    } else if (value === 'new') {
      router.push('/admin/majors/new');
    }
  };

  const getActiveTab = () => {
    if (pathname.includes('/new')) {
      return 'new';
    }
    if (pathname.startsWith('/admin/majors/') && pathname.split('/').length === 4) {
      return 'edit';
    }
    return 'list';
  };
  
  const activeTab = getActiveTab();

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Major Management</h1>
      
      <Card className={cn("w-full")}>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="border-b px-4">
            <TabsList className="h-12">
              <TabsTrigger value="list" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
                All Majors
              </TabsTrigger>
              <TabsTrigger value="new" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Add New Major
              </TabsTrigger>
              {activeTab === 'edit' && (
                <TabsTrigger value="edit" disabled className="data-[state=active]:border-b-2 data-[state=active]:border-primary text-primary">
                  Edit Major
                </TabsTrigger>
              )}
            </TabsList>
          </div>
          
          <TabsContent value="list" className="m-0">
            <CardContent className={cn("p-6")}>
              {activeTab === 'list' && children}
            </CardContent>
          </TabsContent>
          
          <TabsContent value="new" className="m-0">
            <CardContent className={cn("p-6")}>
              {activeTab === 'new' && children}
            </CardContent>
          </TabsContent>
          
          <TabsContent value="edit" className="m-0">
            <CardContent className={cn("p-6")}>
              
                {activeTab === 'edit' && children}
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}