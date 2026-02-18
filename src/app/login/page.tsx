import { AuthForm } from "@/components/auth/auth-form";
import { Workflow } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="container relative grid h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-primary" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Workflow className="mr-2 h-6 w-6" />
          TaskFlow
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This tool helps me organize my life and stay on top of my
              tasks. Highly recommended!&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome to TaskFlow
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to sign in or create an account
            </p>
          </div>
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
