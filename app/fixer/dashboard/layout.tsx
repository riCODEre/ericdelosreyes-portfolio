"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/app/services";

type Props = {
  children: ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await apiClient.get("/auth/me");
        if (mounted) {
          setIsChecking(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        if (mounted) {
          router.replace("/fixer");
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (isChecking) {
    return <main className="p-6 text-gray-500">Checking authentication...</main>;
  }

  return <>{children}</>;
}