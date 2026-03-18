import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Props = {
  children: ReactNode;
};

function getBackendBaseUrl(): string {
  const raw = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
  return raw.replace(/\/+$/, "");
}

async function checkAuth() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const backendBaseUrl = getBackendBaseUrl();

    if (!backendBaseUrl) {
      console.error("Missing BACKEND_URL or NEXT_PUBLIC_BACKEND_URL")
      redirect("/fixer")
    }

    const res = await fetch(`${backendBaseUrl}/auth/me`, {
      headers: {
        cookie: cookieHeader,
      },
      cache: "no-store", // IMPORTANT: don't cache auth
    });

    if (!res.ok) {
      console.log("User not authenticated, redirecting to login")
      redirect("/fixer");
    }
  } catch (error) {
    console.error("Auth check failed:", error)
    redirect("/fixer")
  }
}

export default async function AdminLayout({ children }: Props) {
  await checkAuth();

  return <>{children}</>;
}