"use client";

import { use, useEffect } from "react";
import { GraphCanvas } from "@/components/graph/graph-canvas";
import { GraphLegend } from "@/components/graph/graph-legend";
import { SourcesSidebar } from "@/components/graph/sources-sidebar";
import { SummaryPanel } from "@/components/graph/summary-panel";
import { useGraph } from "@/hooks/use-graph";
import { useGraphStore } from "@/stores/graph-store";

export default function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const sessionId = Number(id);
  const { data } = useGraph(sessionId);
  const reset = useGraphStore((s) => s.reset);

  // Clear selection/visibility state when switching sessions.
  useEffect(() => {
    reset();
    return () => reset();
  }, [sessionId, reset]);

  return (
    <div className="relative flex min-h-0 flex-1">
      <SourcesSidebar sessionId={sessionId} nodes={data?.nodes ?? []} />
      <GraphCanvas sessionId={sessionId} />
      <GraphLegend />
      <SummaryPanel nodes={data?.nodes ?? []} />
    </div>
  );
}
