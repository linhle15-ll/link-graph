"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useGraphStore } from "@/stores/graph-store";
import type { GraphNode } from "@/lib/types";

/** Collapsible bottom panel showing the selected source's summary. */
export function SummaryPanel({ nodes }: { nodes: GraphNode[] }) {
  const { selectedNodeId, summaryOpen, toggleSummary } = useGraphStore();
  const node = nodes.find((n) => n.id === selectedNodeId) ?? null;

  return (
    <div className="absolute right-4 bottom-4 left-4 z-10 sm:left-64">
      <div className="rounded-md bg-white shadow-sm">
        <button
          type="button"
          onClick={toggleSummary}
          className="flex w-full items-center justify-between px-4 py-2"
          aria-expanded={summaryOpen}
        >
          <span className="text-xs font-bold">
            Summary
            {node ? (
              <span className="ml-2 font-normal text-black/50">
                {node.title}
              </span>
            ) : null}
          </span>
          {summaryOpen ? (
            <ChevronDown aria-hidden className="size-3.5 text-black/50" />
          ) : (
            <ChevronUp aria-hidden className="size-3.5 text-black/50" />
          )}
        </button>
        {summaryOpen && (
          <p className="max-h-28 overflow-y-auto px-4 pb-3 text-xs leading-relaxed text-black/70">
            {node
              ? node.contentSummary
              : "Select a node to see its summary from the ingestion pipeline."}
          </p>
        )}
      </div>
    </div>
  );
}
