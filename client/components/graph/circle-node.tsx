"use client";

import { memo } from "react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import type { GraphNode } from "@/lib/types";

export type CircleNodeType = Node<{ node: GraphNode }, "circle">;

const handleClass = "!size-1 !border-0 !bg-transparent !opacity-0";

/** Dark circular node with a white label, cyan ring when selected. */
export const CircleNode = memo(function CircleNode({
  data,
  selected,
}: NodeProps<CircleNodeType>) {
  return (
    <div
      className={cn(
        "flex size-24 items-center justify-center rounded-full bg-[#37414b] p-2 text-center shadow-md transition-shadow",
        selected && "ring-4 ring-[#2fc6f5]",
      )}
    >
      <Handle type="target" position={Position.Left} className={handleClass} />
      <span className="line-clamp-3 text-[11px] leading-tight font-medium text-white">
        {data.node.title}
      </span>
      <Handle type="source" position={Position.Right} className={handleClass} />
    </div>
  );
});
