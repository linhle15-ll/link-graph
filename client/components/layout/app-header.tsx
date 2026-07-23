"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Search, UserRound } from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { useUiStore } from "@/stores/ui-store";

/** Nexus header: brand, centered search pill, user actions. */
export function AppHeader() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const { search, setSearch } = useUiStore();

  async function handleLogout() {
    await api.logout().catch(() => undefined);
    setUser(null);
    router.push("/login");
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-black/10 bg-white px-5">
      <Link href="/home" className="text-lg font-bold tracking-tight">
        Nexus
      </Link>

      <div className="relative mx-auto w-full max-w-md">
        <Search
          aria-hidden
          className="absolute top-1/2 left-3.5 size-3.5 -translate-y-1/2 text-black/40"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="h-9 w-full rounded-full border border-black/10 bg-white pr-4 pl-9 text-sm outline-none placeholder:text-black/40 focus-visible:border-black/30"
        />
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/user"
          aria-label="User Center"
          className="text-black/80 hover:text-black"
        >
          <UserRound className="size-5" />
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Sign out"
          title={user ? `Sign out ${user.name}` : "Sign out"}
          className="group flex size-8 items-center justify-center rounded-full bg-black text-white"
        >
          <span className="text-xs font-semibold group-hover:hidden">
            {(user?.name?.[0] ?? "U").toUpperCase()}
          </span>
          <LogOut aria-hidden className="hidden size-3.5 group-hover:block" />
        </button>
      </div>
    </header>
  );
}
