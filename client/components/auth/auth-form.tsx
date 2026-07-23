"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

/** Abstract node-and-edge artwork from the design's left panel. */
function NetworkArt() {
  return (
    <svg
      viewBox="0 0 240 320"
      aria-hidden
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <g stroke="#000" fill="none">
        <path d="M60 60 L150 92" strokeWidth="7" />
        <path d="M60 60 L96 26" strokeWidth="7" />
        <path d="M60 60 L124 178" strokeWidth="2" />
        <path d="M96 26 L150 92" strokeWidth="2" />
        <path d="M60 60 L52 240" strokeWidth="1.5" />
        <path d="M124 178 L52 240" strokeWidth="1.5" />
        <path d="M124 178 L196 300" strokeWidth="10" />
        <path d="M150 92 L124 130" strokeWidth="2" />
        <path d="M20 -10 L60 60" strokeWidth="9" />
      </g>
      <g fill="#000">
        <circle cx="60" cy="60" r="13" />
        <circle cx="96" cy="26" r="7" />
        <circle cx="150" cy="92" r="21" />
        <circle cx="124" cy="130" r="5" />
        <circle cx="124" cy="178" r="42" />
        <circle cx="52" cy="240" r="6" />
        <circle cx="196" cy="300" r="52" />
      </g>
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4">
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3c-1.08.72-2.46 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.29 14.29A7.2 7.2 0 0 1 4.91 12c0-.8.14-1.57.38-2.29v-3.1H1.28a12 12 0 0 0 0 10.78l4.01-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.76c1.76 0 3.34.6 4.59 1.79l3.44-3.44A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.28 6.61l4.01 3.1C6.23 6.87 8.88 4.76 12 4.76Z"
      />
    </svg>
  );
}

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = useMutation({
    mutationFn: () =>
      isSignup
        ? api.signup({ name, email, password })
        : api.login({ email, password }),
    onSuccess: ({ user }) => {
      setUser(user);
      router.push("/home");
    },
    onError: (error) => {
      toast.error(isSignup ? "Could not sign up" : "Could not sign in", {
        description: error.message,
      });
    },
  });

  function handleSubmit() {
    if (isSignup && !name.trim()) return toast.error("Please enter a username");
    if (!email.trim()) return toast.error("Please enter your email");
    if (password.length < 8)
      return toast.error("Password must be at least 8 characters");
    auth.mutate();
  }

  function handleGoogle() {
    if (USE_MOCK) {
      toast.info("Google sign-in needs the backend OAuth routes", {
        description: "It will redirect to /api/auth/google once they exist.",
      });
      return;
    }
    window.location.href = api.googleAuthUrl();
  }

  const cta = isSignup ? "Sign up" : "Sign in";
  const inputClass =
    "h-10 w-full rounded-full bg-white px-4 text-sm shadow-sm outline-none placeholder:text-black/40 focus-visible:ring-2 focus-visible:ring-[#2fc6f5]/60";

  return (
    <div className="grid w-full max-w-3xl overflow-hidden rounded-2xl border border-black/5 bg-[#f4f3ef] shadow-sm sm:grid-cols-[45%_55%]">
      <div className="hidden bg-white sm:block">
        <NetworkArt />
      </div>

      <div className="flex flex-col justify-center gap-4 p-8 sm:p-10">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Write it better.
        </h1>

        <div
          role="tablist"
          aria-label="Authentication mode"
          className="grid grid-cols-2 rounded-full bg-white p-1 text-sm font-medium shadow-sm"
        >
          <Link
            role="tab"
            aria-selected={!isSignup}
            href="/login"
            className={cn(
              "rounded-full py-1.5 text-center transition-colors",
              !isSignup
                ? "bg-[#2fc6f5] text-black"
                : "text-black/60 hover:text-black",
            )}
          >
            Sign in
          </Link>
          <Link
            role="tab"
            aria-selected={isSignup}
            href="/signup"
            className={cn(
              "rounded-full py-1.5 text-center transition-colors",
              isSignup
                ? "bg-[#2fc6f5] text-black"
                : "text-black/60 hover:text-black",
            )}
          >
            Sign up
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {isSignup && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="username"
              placeholder="Username"
              className={inputClass}
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="Email"
            className={inputClass}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoComplete={isSignup ? "new-password" : "current-password"}
            placeholder="Password"
            className={inputClass}
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={auth.isPending}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#2fc6f5] text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {auth.isPending && (
              <Loader2 aria-hidden className="size-4 animate-spin" />
            )}
            {cta}
          </button>

          <button
            type="button"
            onClick={handleGoogle}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-white text-sm font-medium shadow-sm transition-colors hover:bg-black/5"
          >
            <GoogleIcon />
            {cta} with Google
          </button>
        </div>
      </div>
    </div>
  );
}
