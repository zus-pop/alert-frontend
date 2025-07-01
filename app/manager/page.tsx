"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ManagerPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && user.role === "MANAGER") {
      router.replace("/manager/studentmanager");
    }
  }, [user, loading, router]);

  // Có thể hiển thị loading hoặc null trong khi chờ xác thực
  return null;
}
