"use client"

import { toast } from '@/components/ui/use-toast';

const toastService = {
  success: (message: string) => {
    toast({
      title: "Success",
      description: message,
      variant: "default",
    });
  },
  error: (message: string) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  },
  info: (message: string) => {
    toast({
      title: "Information",
      description: message,
      variant: "default",
    });
  }
};

export default toastService;
