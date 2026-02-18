"use client";

import { AuthForm } from "@/components/auth/auth-form";
import { useUser } from "@/firebase";
import { Loader2, Workflow } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace("/todos");
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex items-center justify-center text-lg font-medium">
            <Workflow className="mr-2 h-6 w-6" />
            TaskFlow
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to TaskFlow
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in with your Google account to continue
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
