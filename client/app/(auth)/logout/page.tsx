import type { Metadata } from "next";
import Link from "next/link";
import { LogOut } from "lucide-react";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Signed out — Nexus",
  description: "You have been signed out of Nexus.",
};

export default function LogoutPage() {
  return (
    <AuthShell>
      <div className={auth.statusCard}>
        <span className={auth.badge}>
          <LogOut className="size-5" />
        </span>
        <h1 className={`mt-5 ${auth.title}`}>You&apos;re signed out</h1>
        <p className={auth.subtitle}>
          Your folders and connections are saved. Sign back in whenever you want
          to keep reading.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <Button
            className="h-10 w-full"
            nativeButton={false}
            render={<Link href="/login" />}
          >
            Sign in again
          </Button>
          <Button
            variant="ghost"
            className="h-10 w-full"
            nativeButton={false}
            render={<Link href="/" />}
          >
            Back to folders
          </Button>
        </div>
      </div>
    </AuthShell>
  );
}
