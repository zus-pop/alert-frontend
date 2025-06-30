'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSystemUserById, useCreateSystemUser, useUpdateSystemUser } from '@/hooks/useSystemUsers';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { SystemUserCreateRequest, SystemUserUpdateRequest } from '@/services/systemUserApi';

// Form validation schema
const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  role: z.enum(['MANAGER', 'SUPERVISOR'], { 
    required_error: 'Please select a role' 
  }),
});

type SystemUserFormProps = {
  userId?: string;
};

export default function SystemUserForm({ userId }: SystemUserFormProps) {
  const router = useRouter();
  const isEditing = !!userId;
  
  // Queries and mutations
  const { data: user, isLoading: isLoadingUser } = useSystemUserById(userId || '');
  const createSystemUser = useCreateSystemUser();
  const updateSystemUser = useUpdateSystemUser();
  
  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '', 
      firstName: '',
      lastName: '',
      role: 'SUPERVISOR' as const,
    },
  });
  
  // Populate form when editing and data is loaded
  useEffect(() => {
    if (isEditing && user) {
      form.reset({
        email: user.email,
        password: "", // Password should not be pre-filled for security reasons
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role === 'ADMIN' ? 'SUPERVISOR' : user.role, // Default to STAFF if somehow the role is ADMIN
      });
    }
  }, [user, form, isEditing]);
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isEditing && userId) {
      // Update existing user
      const updateData: SystemUserUpdateRequest = {
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        role: values.role,
      };
      if (values.password && values.password.trim() !== '') {
      updateData.password = values.password;
    }
      await updateSystemUser.mutateAsync({ id: userId, data: updateData });
    } else {
      // Create new user
      const createData: SystemUserCreateRequest = {
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        role: values.role,
      };
      
      await createSystemUser.mutateAsync(createData);
    }
    
    // Redirect back to system users list
    router.push('/admin/system-users');
  };
  
  const isSubmitting = form.formState.isSubmitting || createSystemUser.isPending || updateSystemUser.isPending;
  
  return (
    <div className="container mx-auto py-6">
      <Button 
        variant="ghost" 
        onClick={() => router.push('/admin/system-users')}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit System User' : 'Add New System User'}</CardTitle>
          <CardDescription>
            {isEditing 
              ? 'Update the information for this system user' 
              : 'Create a new administrator, manager or staff user'}
          </CardDescription>
        </CardHeader>
        
        {isEditing && isLoadingUser ? (
          <CardContent className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </CardContent>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormDescription>
                        This email will be used for login
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
  control={form.control}
  name="password"
  render={({ field }) => (
    <FormItem>
      <FormLabel>{isEditing ? 'New Password' : 'Password'}</FormLabel>
      <FormControl>
        <Input type="password" {...field} />
      </FormControl>
      <FormDescription>
        {isEditing 
          ? 'Leave blank to keep current password' 
          : 'This password will be used for login'}
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
                
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MANAGER">Manager</SelectItem>
                          <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {isEditing 
                          ? 'Change the user\'s role in the system' 
                          : 'A default password will be created for the user'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => router.push('/admin/system-users')}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditing ? 'Update User' : 'Create User'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        )}
      </Card>
    </div>
  );
}
