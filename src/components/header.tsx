import Link from "next/link";
import { Settings, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Link
        href="/"
        className="flex items-center gap-2 text-lg font-semibold md:text-base"
      >
        <Workflow className="h-6 w-6 text-primary" />
        <span className="font-headline text-xl font-bold">TaskFlow</span>
      </Link>
      <div className="flex flex-1 items-center justify-end gap-4">
        <Link href="/settings">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
