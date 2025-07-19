'use client';

import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function MajorsLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Function to handle tab change
  const handleTabChange = (value: string) => {
    if (value === 'list') {
      router.push('/admin/majors');
    } else if (value === 'new') {
      router.push('/admin/majors/new');
    }
  };

  // Determine the active tab based on the current URL
  const activeTab = pathname.includes('/new') ? 'new' : 'list';

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Major Management</h1>
      
      <Card className={cn("w-full")}>
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="border-b px-4">
            <TabsList className="h-12">
              <TabsTrigger value="list" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
                All Majors
              </TabsTrigger>
              <TabsTrigger value="new" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Add New Major
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="list" className="m-0">
            <CardContent className={cn("p-6")}>
              {pathname === '/admin/majors' && children}
            </CardContent>
          </TabsContent>
          
          <TabsContent value="new" className="m-0">
            <CardContent className={cn("p-6")}>
              {pathname.includes('/new') && children}
            </CardContent>
          </TabsContent>
          
          <TabsContent value="edit" className="m-0">
            <CardContent className={cn("p-6")}>
              {pathname.includes('/admin/majors/') && !pathname.includes('/new') && children}
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
