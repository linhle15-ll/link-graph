"use client";

import { memo } from "react";
import {
  BaseEdge,
  getStraightPath,
  type Edge,
  type EdgeProps,
} from "@xyflow/react";
import type { GraphEdge } from "@/lib/types";

export type RelationEdgeType = Edge<{ edge: GraphEdge }, "relation">;

export const EDGE_COLORS: Record<string, string> = {
  agrees: "#17d3b4", // teal-cyan (legend: Agrees)
  disagrees: "#f23f8f", // magenta (legend: Disagrees)
};

/** Straight edge colored by relation: cyan = agrees, magenta = disagrees. */
export const RelationEdge = memo(function RelationEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  selected,
}: EdgeProps<RelationEdgeType>) {
  const [path] = getStraightPath({ sourceX, sourceY, targetX, targetY });
  const relation = data?.edge.tags[0] ?? "";
  const color = EDGE_COLORS[relation] ?? "#9ca3af";

  return (
    <BaseEdge
      id={id}
      path={path}
      style={{ stroke: color, strokeWidth: selected ? 4 : 3 }}
    />
  );
});
