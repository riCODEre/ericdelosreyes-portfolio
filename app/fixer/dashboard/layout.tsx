import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Props = {
  children: ReactNode;
};

async function checkAuth() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await fetch("http://localhost:8000/api/v1/auth/me", {
    headers: {
      cookie: cookieHeader,
    },
    cache: "no-store", // IMPORTANT: don't cache auth
  });

  if (!res.ok) {
    console.log("User not authenticated, redirecting to login")
    redirect("/fixer");
  }

  return res.json(); // optional (if you want user data)
}

export default async function AdminLayout({ children }: Props) {
  await checkAuth();

  return <>{children}</>;
}