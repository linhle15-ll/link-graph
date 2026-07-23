"use client";

import { useEffect, useMemo } from "react";
import {
  Background,
  Controls,
  ReactFlow,
  useNodesState,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Loader2 } from "lucide-react";
import { computeLayout } from "@/lib/graph-layout";
import { useGraph } from "@/hooks/use-graph";
import { useGraphStore } from "@/stores/graph-store";
import { CircleNode, type CircleNodeType } from "./circle-node";
import { RelationEdge, type RelationEdgeType } from "./relation-edge";

// Module scope so React Flow doesn't remount nodes on every render.
const nodeTypes = { circle: CircleNode };
const edgeTypes = { relation: RelationEdge };

export function GraphCanvas({ sessionId }: { sessionId: number }) {
  const { data, isPending, isError, error } = useGraph(sessionId);
  const { selectNode, hiddenNodeIds } = useGraphStore();

  const [nodes, setNodes, onNodesChange] = useNodesState<CircleNodeType>([]);

  // Rebuild nodes when data changes, preserving positions of nodes the
  // user has already dragged; only new nodes get dagre positions.
  useEffect(() => {
    if (!data) return;
    setNodes((current) => {
      const existing = new Map(current.map((n) => [n.id, n.position]));
      const layout = computeLayout(data.nodes, data.edges);
      return data.nodes
        .filter((node) => !hiddenNodeIds.has(node.id))
        .map((node) => ({
          id: String(node.id),
          type: "circle" as const,
          position: existing.get(String(node.id)) ??
            layout.get(node.id) ?? { x: 0, y: 0 },
          data: { node },
        }));
    });
  }, [data, hiddenNodeIds, setNodes]);

  const edges = useMemo<Edge[]>(() => {
    if (!data) return [];
    return data.edges
      .filter(
        (edge) =>
          edge.nodeIds.length >= 2 &&
          !edge.nodeIds.some((id) => hiddenNodeIds.has(id)),
      )
      .map((edge): RelationEdgeType => ({
        id: String(edge.id),
        source: String(edge.nodeIds[0]),
        target: String(edge.nodeIds[1]),
        type: "relation" as const,
        data: { edge },
      }));
  }, [data, hiddenNodeIds]);

  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center gap-2 text-sm text-black/50">
        <Loader2 aria-hidden className="size-4 animate-spin" />
        Loading graph…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-1 p-8 text-center">
        <p className="text-sm font-medium">Could not load the graph</p>
        <p className="max-w-md text-xs text-black/50">
          {error.message}. Check that the server is running and
          NEXT_PUBLIC_API_URL points at it, or set NEXT_PUBLIC_USE_MOCK=true to
          work with sample data.
        </p>
      </div>
    );
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={onNodesChange}
      onNodeClick={(_, node) => selectNode(Number(node.id))}
      onPaneClick={() => selectNode(null)}
      fitView
      fitViewOptions={{ maxZoom: 1, padding: 0.4 }}
      proOptions={{ hideAttribution: true }}
      className="!bg-[#f7f6f3]"
    >
      <Background gap={24} color="#e3e2de" />
      <Controls position="top-right" />
    </ReactFlow>
  );
}
