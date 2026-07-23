"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useAddLink } from "@/hooks/use-graph";
import { useGraphStore } from "@/stores/graph-store";
import { cn } from "@/lib/utils";
import type { GraphNode } from "@/lib/types";

/** Collapsible sources panel with visibility checkboxes. */
export function SourcesSidebar({
  sessionId,
  nodes,
}: {
  sessionId: number;
  nodes: GraphNode[];
}) {
  const {
    hiddenNodeIds,
    toggleNodeHidden,
    setAllHidden,
    sidebarOpen,
    toggleSidebar,
  } = useGraphStore();
  const [url, setUrl] = useState("");
  const addLink = useAddLink(sessionId);

  const allVisible = nodes.every((n) => !hiddenNodeIds.has(n.id));

  function submitLink() {
    const trimmed = url.trim();
    if (!trimmed) return;
    addLink.mutate(trimmed, { onSuccess: () => setUrl("") });
  }

  if (!sidebarOpen) {
    return (
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label="Open sources panel"
        className="absolute top-4 left-4 z-10 flex items-center gap-1 rounded-md bg-white px-2 py-1.5 text-xs font-bold shadow-sm hover:bg-black/5"
      >
        Sources
        <ChevronRight className="size-3.5" />
      </button>
    );
  }

  return (
    <aside className="absolute top-4 bottom-4 left-4 z-10 flex w-56 flex-col rounded-md bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-black/10 px-3 py-2">
        <h2 className="text-xs font-bold">Sources</h2>
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Collapse sources panel"
          className="rounded p-0.5 text-black/50 hover:bg-black/5 hover:text-black"
        >
          <ChevronLeft className="size-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <label className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-xs hover:bg-black/5">
          <input
            type="checkbox"
            checked={allVisible}
            onChange={() =>
              setAllHidden(
                nodes.map((n) => n.id),
                allVisible,
              )
            }
            className="size-3.5 accent-black"
          />
          Select all
        </label>

        {nodes.map((node) => (
          <label
            key={node.id}
            className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-xs hover:bg-black/5"
            title={`${node.site}: ${node.title}`}
          >
            <input
              type="checkbox"
              checked={!hiddenNodeIds.has(node.id)}
              onChange={() => toggleNodeHidden(node.id)}
              className="size-3.5 shrink-0 accent-black"
            />
            <span className="truncate">
              {node.site.split(".")[0]}: {node.title}
            </span>
          </label>
        ))}

        {nodes.length === 0 && (
          <p className="px-1.5 py-2 text-xs text-black/40">
            No sources yet — add a link below or clip one with the extension.
          </p>
        )}
      </div>

      <div className="border-t border-black/10 p-2">
        <div className={cn("flex items-center gap-1")}>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitLink()}
            placeholder="Paste a link…"
            className="h-7 w-full min-w-0 rounded-md border border-black/10 px-2 text-xs outline-none placeholder:text-black/40 focus-visible:border-[#2fc6f5]"
          />
          <button
            type="button"
            onClick={submitLink}
            disabled={addLink.isPending}
            aria-label="Add link"
            className="flex size-7 shrink-0 items-center justify-center rounded-md bg-black text-white disabled:opacity-50"
          >
            <Plus className="size-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
