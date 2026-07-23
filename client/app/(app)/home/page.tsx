"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X } from "lucide-react";
import { useCreateSession, useSessions } from "@/hooks/use-sessions";
import { useUiStore } from "@/stores/ui-store";
import type { Session } from "@/lib/types";

/** Decorative mini graph for sessions without a description. */
function MiniGraph() {
  return (
    <svg viewBox="0 0 120 44" aria-hidden className="h-11 w-full">
      <path d="M22 30 L58 12" stroke="#f23f8f" strokeWidth="1.5" fill="none" />
      <path d="M58 12 L96 26" stroke="#2fc6f5" strokeWidth="1.5" fill="none" />
      <circle cx="22" cy="30" r="8" fill="#d3d3d3" />
      <circle cx="58" cy="12" r="8" fill="#d3d3d3" />
      <circle cx="96" cy="26" r="8" fill="#d3d3d3" />
    </svg>
  );
}

function SessionCard({ session }: { session: Session }) {
  return (
    <Link
      href={`/sessions/${session.id}`}
      className="group flex min-h-32 flex-col gap-2 rounded-md bg-white p-4 shadow-sm transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#2fc6f5] focus-visible:outline-none"
    >
      <h2 className="border-b border-black/70 pb-1 text-sm font-bold group-hover:text-[#2fc6f5]">
        {session.title}
      </h2>
      {session.description ? (
        <p className="line-clamp-3 text-xs text-black/60">
          {session.description}
        </p>
      ) : (
        <MiniGraph />
      )}
      {session.nodeCount > 0 && (
        <p className="mt-auto text-[10px] text-black/40">
          {session.nodeCount} source{session.nodeCount === 1 ? "" : "s"}
        </p>
      )}
    </Link>
  );
}

function CreateSessionDialog({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const createSession = useCreateSession();
  const router = useRouter();

  function handleCreate() {
    const trimmed = title.trim();
    if (!trimmed) return;
    createSession.mutate(
      { title: trimmed, description: description.trim() || null },
      {
        onSuccess: ({ session }) => {
          onClose();
          router.push(`/sessions/${session.id}`);
        },
      },
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="New knowledge session"
        className="w-full max-w-sm rounded-xl bg-white p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold">New knowledge session</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-full p-1 text-black/50 hover:bg-black/5 hover:text-black"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="Title"
            className="h-9 w-full rounded-lg border border-black/10 px-3 text-sm outline-none placeholder:text-black/40 focus-visible:border-[#2fc6f5]"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={3}
            className="w-full resize-none rounded-lg border border-black/10 px-3 py-2 text-sm outline-none placeholder:text-black/40 focus-visible:border-[#2fc6f5]"
          />
          <button
            type="button"
            onClick={handleCreate}
            disabled={createSession.isPending || !title.trim()}
            className="flex h-9 items-center justify-center gap-2 rounded-full bg-black text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {createSession.isPending && (
              <Loader2 aria-hidden className="size-4 animate-spin" />
            )}
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { data, isPending, isError, error } = useSessions();
  const search = useUiStore((s) => s.search);
  const [creating, setCreating] = useState(false);

  const sessions = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    if (!q) return data.sessions;
    return data.sessions.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        (s.description ?? "").toLowerCase().includes(q),
    );
  }, [data, search]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-5xl p-6">
        {isPending ? (
          <div className="flex items-center justify-center gap-2 py-24 text-sm text-black/50">
            <Loader2 aria-hidden className="size-4 animate-spin" />
            Loading sessions…
          </div>
        ) : isError ? (
          <div className="py-24 text-center">
            <p className="text-sm font-medium">Could not load sessions</p>
            <p className="mt-1 text-xs text-black/50">{error.message}</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-sm font-medium">
              {search ? "No sessions match your search" : "No sessions yet"}
            </p>
            <p className="mt-1 text-xs text-black/50">
              {search
                ? "Try a different term."
                : "Create your first knowledge session with the + button."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        aria-label="New knowledge session"
        onClick={() => setCreating(true)}
        className="fixed bottom-6 left-1/2 flex h-11 w-16 -translate-x-1/2 items-center justify-center rounded-2xl bg-black text-white shadow-lg transition-transform hover:scale-105"
      >
        <Plus className="size-5" />
      </button>

      {creating && <CreateSessionDialog onClose={() => setCreating(false)} />}
    </div>
  );
}
