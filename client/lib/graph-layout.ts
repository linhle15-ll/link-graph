import dagre from "@dagrejs/dagre";
import type { GraphEdge, GraphNode } from "@/lib/types";

export const NODE_WIDTH = 96;
export const NODE_HEIGHT = 96;

export interface Position {
  x: number;
  y: number;
}

/**
 * Computes an automatic left-to-right layout with dagre.
 * Returns a map of nodeId -> position. Nodes the user has already
 * dragged keep their positions (handled by the canvas, which only
 * applies these for ids it hasn't seen yet).
 */
export function computeLayout(
  nodes: GraphNode[],
  edges: GraphEdge[],
): Map<number, Position> {
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: "LR",
    nodesep: 72,
    ranksep: 160,
    marginx: 32,
    marginy: 32,
  });
  g.setDefaultEdgeLabel(() => ({}));

  for (const node of nodes) {
    g.setNode(String(node.id), { width: NODE_WIDTH, height: NODE_HEIGHT });
  }
  for (const edge of edges) {
    if (edge.nodeIds.length >= 2) {
      g.setEdge(String(edge.nodeIds[0]), String(edge.nodeIds[1]));
    }
  }

  dagre.layout(g);

  const positions = new Map<number, Position>();
  for (const node of nodes) {
    const laid = g.node(String(node.id));
    if (laid) {
      // dagre returns centers; React Flow expects top-left corners.
      positions.set(node.id, {
        x: laid.x - NODE_WIDTH / 2,
        y: laid.y - NODE_HEIGHT / 2,
      });
    }
  }
  return positions;
}
