"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { ExternalLink } from "lucide-react";

import { colorVar, graph } from "@/lib/theme";

export type LinkNodeData = {
  title: string;
  url: string;
  color: string;
  selected?: boolean;
};

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function LinkGraphNodeComponent({ data, selected }: NodeProps<LinkNodeData>) {
  const accent = colorVar(data.color);
  return (
    <div
      className={graph.node}
      style={{
        borderColor: selected ? accent : "var(--border)",
        boxShadow: selected ? `0 0 0 1px ${accent}` : undefined,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className={graph.nodeHandle}
        style={{ background: accent }}
      />
      <div className="flex items-start gap-2">
        <span
          className="mt-1 size-2 shrink-0 rounded-full"
          style={{ backgroundColor: accent }}
        />
        <div className="min-w-0">
          <p className="text-card-foreground line-clamp-2 text-[13px] leading-snug font-medium">
            {data.title}
          </p>
          <span className="text-muted-foreground mt-1 flex items-center gap-1 truncate text-[11px]">
            <ExternalLink className="size-3 shrink-0" />
            <span className="truncate">{hostname(data.url)}</span>
          </span>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className={graph.nodeHandle}
        style={{ background: accent }}
      />
    </div>
  );
}

export const LinkGraphNode = memo(LinkGraphNodeComponent);
