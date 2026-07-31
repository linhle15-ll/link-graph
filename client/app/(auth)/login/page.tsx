import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Sign in — Nexus",
  description: "Sign in to your Nexus research workspace.",
};

export default function LoginPage() {
  return (
    <AuthShell>
      <div className={auth.card}>
        <h1 className={auth.title}>Welcome back</h1>
        <p className={auth.subtitle}>
          Sign in to pick up your knowledge folders where you left them.
        </p>

        <form className={auth.form}>
          <div className={auth.field}>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@university.edu"
            />
          </div>

          <div className={auth.field}>
            <div className={auth.fieldRow}>
              <Label htmlFor="password">Password</Label>
              <Link href="/login" className={auth.link}>
                Forgot?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>

          <Button
            className="mt-1 h-10 w-full"
            nativeButton={false}
            render={<Link href="/" />}
          >
            Sign in
          </Button>
        </form>

        <div className={auth.separator}>or</div>

        <Button
          variant="outline"
          className="h-10 w-full"
          nativeButton={false}
          render={<Link href="/signup" />}
        >
          Create a new workspace
        </Button>

        <p className={auth.footer}>
          New to Nexus?{" "}
          <Link href="/signup" className={auth.link}>
            Sign up
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
