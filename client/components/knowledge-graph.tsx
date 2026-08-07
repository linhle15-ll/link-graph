"use client";

import { useCallback, useEffect, useMemo } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useNodesState,
  type Connection,
  type Edge as RFEdge,
  type Node as RFNode,
  type NodeChange,
  type NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";

import type { Node, Edge } from "@/lib/types";
import { colorVar, graph } from "@/lib/theme";
import { LinkGraphNode, type LinkNodeData } from "@/components/link-graph-node";

const nodeTypes: NodeTypes = { link: LinkGraphNode };

type Props = {
  links: Node[];
  edges: Edge[];
  folderColor: string | null;
  selectedLinkId: number | null;
  selectedEdgeId: number | null;
  onSelectLink: (id: number | null) => void;
  onSelectEdge: (id: number) => void;
  onConnect: (sourceId: number, targetId: number) => void;
  onMoveNode: (id: number, x: number, y: number) => void;
};

export function KnowledgeGraph({
  links,
  edges,
  folderColor,
  selectedLinkId,
  selectedEdgeId,
  onSelectLink,
  onSelectEdge,
  onConnect,
  onMoveNode,
}: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState<LinkNodeData>([]);

  // React Flow owns node positions while dragging; mirror our state into it.
  useEffect(() => {
    setNodes(
      links.map((l) => ({
        id: String(l.id),
        type: "link",
        position: { x: l.posX ?? 0, y: l.posY ?? 0 },
        data: {
          title: l.title,
          url: l.link,
          color: folderColor ?? "chart-1",
        },
        selected: selectedLinkId === l.id,
      })),
    );
  }, [links, folderColor, selectedLinkId, setNodes]);

  const rfEdges = useMemo<RFEdge[]>(
    () =>
      edges.map((e) => {
        const active = selectedEdgeId === e.id;
        const strength = e.score ?? 50;
        // Normalize strength from 0-100 to 1-4 for visual weight
        const normalizedStrength = Math.max(1, Math.min(4, strength / 25 + 1));
        const isStrong = strength >= 75;

        return {
          id: String(e.id),
          source: String(e.firstNodeId),
          target: String(e.secondNodeId),
          label: e.label ?? undefined,
          animated: active || isStrong,
          style: {
            stroke: active ? colorVar(folderColor) : colorVar(folderColor),
            strokeWidth: active ? normalizedStrength + 1.5 : normalizedStrength,
            opacity: active ? 1 : 0.3 + (strength / 100) * 0.6,
          },
          labelStyle: {
            fill: "var(--foreground)",
            fontSize: 11,
            fontWeight: 500,
          },
          labelBgStyle: { fill: "var(--card)", fillOpacity: 0.9 },
          labelBgPadding: [6, 3] as [number, number],
          labelBgBorderRadius: 4,
        };
      }),
    [edges, folderColor, selectedEdgeId],
  );

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
      for (const change of changes) {
        if (
          change.type === "position" &&
          change.dragging === false &&
          change.position
        ) {
          onMoveNode(Number(change.id), change.position.x, change.position.y);
        }
      }
    },
    [onNodesChange, onMoveNode],
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      onConnect(Number(connection.source), Number(connection.target));
    },
    [onConnect],
  );

  return (
    <ReactFlow
      nodes={nodes as RFNode<LinkNodeData>[]}
      edges={rfEdges}
      nodeTypes={nodeTypes}
      onNodesChange={handleNodesChange}
      onConnect={handleConnect}
      onNodeClick={(_, node) => onSelectLink(Number(node.id))}
      onEdgeClick={(_, edge) => onSelectEdge(Number(edge.id))}
      onPaneClick={() => onSelectLink(null)}
      fitView
      fitViewOptions={{ padding: 0.3, maxZoom: 1 }}
      minZoom={0.2}
      maxZoom={2}
      proOptions={{ hideAttribution: true }}
      className="bg-transparent"
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={22}
        size={1}
        color="var(--border)"
      />
      <Controls className={graph.controls} showInteractive={false} />
      <MiniMap
        pannable
        zoomable
        className={graph.minimap}
        maskColor="color-mix(in oklch, var(--muted) 60%, transparent)"
        nodeColor={() => colorVar(folderColor)}
      />
    </ReactFlow>
  );
}
