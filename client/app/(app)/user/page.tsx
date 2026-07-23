"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";

/** User Center: profile info and settings. */
export default function UserPage() {
  const { user, setUser } = useAuthStore();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");

  const save = useMutation({
    mutationFn: () =>
      api.updateUser({
        name,
        email,
        ...(password ? { password } : {}),
      }),
    onSuccess: ({ user: updated }) => {
      setUser(updated);
      setPassword("");
      toast.success("Profile updated");
    },
    onError: (error) => {
      toast.error("Could not update profile", { description: error.message });
    },
  });

  function handleSave() {
    if (!name.trim()) return toast.error("Please enter a username");
    if (!email.trim()) return toast.error("Please enter your email");
    if (password && password.length < 8)
      return toast.error("New password must be at least 8 characters");
    save.mutate();
  }

  const inputClass =
    "h-10 w-full rounded-full bg-white px-4 text-sm shadow-sm outline-none placeholder:text-black/40 focus-visible:ring-2 focus-visible:ring-[#2fc6f5]/60";

  return (
    <div className="flex min-h-0 flex-1 items-start justify-center overflow-y-auto p-6">
      <div className="mt-6 flex w-full max-w-2xl flex-col items-center gap-6 rounded-xl bg-[#f4f3ef] px-6 py-14 shadow-sm">
        <h1 className="text-3xl font-extrabold tracking-tight">User Center</h1>

        <div className="flex w-full max-w-xs flex-col gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="username"
            placeholder="Username"
            className={inputClass}
          />
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
            autoComplete="new-password"
            placeholder="Password"
            className={inputClass}
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={save.isPending}
            className="mt-1 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-black text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {save.isPending && (
              <Loader2 aria-hidden className="size-4 animate-spin" />
            )}
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
