'use client';

import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function CombosLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Function to handle tab change
  const handleTabChange = (value: string) => {
    if (value === 'list') {
      router.push('/admin/combos');
    } else if (value === 'new') {
      router.push('/admin/combos/new');
    }
  };

  // Determine the active tab based on the current URL
  const activeTab = pathname.includes('/new') ? 'new' : 'list';

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Combo Management</h1>
      
      <Card className={cn("w-full")}>
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="border-b px-4">
            <TabsList className="h-12">
              <TabsTrigger value="list" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
                All Combos
              </TabsTrigger>
              <TabsTrigger value="new" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Add New Combo
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="list" className="m-0">
            <CardContent className={cn("p-6")}>
              {pathname === '/admin/combos' && children}
            </CardContent>
          </TabsContent>
          
          <TabsContent value="new" className="m-0">
            <CardContent className={cn("p-6")}>
              {pathname.includes('/new') && children}
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
