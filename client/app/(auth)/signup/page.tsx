import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Create an account — Nexus",
  description: "Create a Nexus workspace to map how your sources connect.",
};

export default function SignupPage() {
  return (
    <AuthShell>
      <div className={auth.card}>
        <h1 className={auth.title}>Create your workspace</h1>
        <p className={auth.subtitle}>
          Start collecting links and explaining how they relate.
        </p>

        <form className={auth.form}>
          <div className={auth.field}>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              placeholder="Ada Lovelace"
            />
          </div>

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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
            />
            <p className="text-muted-foreground text-xs leading-relaxed">
              Use at least 8 characters with a number or symbol.
            </p>
          </div>

          <Button
            className="mt-1 h-10 w-full"
            nativeButton={false}
            render={<Link href="/" />}
          >
            Create account
          </Button>
        </form>

        <p className={auth.legal}>
          By continuing you agree to the Terms of Service and Privacy Policy.
        </p>

        <p className={auth.footer}>
          Already have an account?{" "}
          <Link href="/login" className={auth.link}>
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
