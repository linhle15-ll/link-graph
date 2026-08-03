"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Info } from "lucide-react";

import type { EdgeEvidence, Folder, GraphEdge, LinkNode } from "@/lib/types";
import { colorVar, controls, graph, surfaces, typography } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/site-header";
import { KnowledgeGraph } from "@/components/knowledge-graph";
import {
  AddLinkDialog,
  type NewLinkValues,
} from "@/components/add-link-dialog";
import { EdgeInspector, LinkInspector } from "@/components/graph-inspector";
import { Button } from "@/components/ui/button";

type Selection =
  { kind: "link"; id: number } | { kind: "edge"; id: number } | null;

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function FolderWorkspace({
  folder,
  initialLinks,
  initialEdges,
}: {
  folder: Folder;
  initialLinks: LinkNode[];
  initialEdges: GraphEdge[];
}) {
  const [links, setLinks] = useState<LinkNode[]>(initialLinks);
  const [edges, setEdges] = useState<GraphEdge[]>(initialEdges);
  const [selection, setSelection] = useState<Selection>(null);

  const selectedLink =
    selection?.kind === "link"
      ? (links.find((l) => l.id === selection.id) ?? null)
      : null;
  const selectedEdge =
    selection?.kind === "edge"
      ? (edges.find((e) => e.id === selection.id) ?? null)
      : null;

  const titleById = useMemo(() => {
    const map = new Map<number, string>();
    for (const l of links) map.set(l.id, l.title);
    return map;
  }, [links]);

  function handleAddLink(values: NewLinkValues) {
    setLinks((prev) => [
      ...prev,
      {
        id: Date.now(),
        folderId: folder.id,
        title: values.title,
        url: values.url,
        description: values.description || null,
        posX: 120 + prev.length * 40,
        posY: 260,
      },
    ]);
  }

  function handleSaveLink(
    id: number,
    values: { title: string; url: string; description: string },
  ) {
    setLinks((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, ...values, description: values.description || null }
          : l,
      ),
    );
  }

  function handleDeleteLink(id: number) {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    setEdges((prev) =>
      prev.filter((e) => e.sourceId !== id && e.targetId !== id),
    );
    setSelection(null);
  }

  function handleMoveNode(id: number, x: number, y: number) {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, posX: x, posY: y } : l)),
    );
  }

  function handleConnect(sourceId: number, targetId: number) {
    if (sourceId === targetId) return;
    const id = Date.now();
    setEdges((prev) => [
      ...prev,
      {
        id,
        folderId: folder.id,
        sourceId,
        targetId,
        label: null,
        reasoning: null,
        strength: 2,
        evidence: [],
      },
    ]);
    setSelection({ kind: "edge", id });
  }

  function handleSaveEdge(
    id: number,
    values: {
      label: string;
      reasoning: string;
      strength: number;
      evidence: EdgeEvidence[];
    },
  ) {
    setEdges((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              label: values.label || null,
              reasoning: values.reasoning || null,
              strength: values.strength,
              evidence: values.evidence,
            }
          : e,
      ),
    );
  }

  function handleDeleteEdge(id: number) {
    setEdges((prev) => prev.filter((e) => e.id !== id));
    setSelection(null);
  }

  return (
    <div className={surfaces.app}>
      <SiteHeader wide>
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link href="/" />}
        >
          <ArrowLeft className="size-4" />
          All folders
        </Button>
      </SiteHeader>

      <div className={graph.body}>
        {/* Link list */}
        <aside className={graph.sidebar}>
          <div className="border-border flex items-start gap-3 border-b p-4">
            <span
              className="mt-1 h-8 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: colorVar(folder.color) }}
            />
            <div className="min-w-0 flex-1">
              <h1 className={typography.heading}>{folder.name}</h1>
              {folder.description ? (
                <p className={cn(typography.bodyMuted, "mt-1 line-clamp-3")}>
                  {folder.description}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-3">
            <span className={typography.eyebrow}>Links ({links.length})</span>
            <AddLinkDialog onCreate={handleAddLink} />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
            {links.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                <FileText className="text-muted-foreground size-5" />
                <p className={typography.bodyMuted}>
                  No links yet. Add your first source.
                </p>
              </div>
            ) : (
              <ul className="flex flex-col gap-1">
                {links.map((l) => {
                  const active =
                    selection?.kind === "link" && selection.id === l.id;
                  const connections = edges.filter(
                    (e) => e.sourceId === l.id || e.targetId === l.id,
                  ).length;
                  return (
                    <li key={l.id}>
                      <button
                        onClick={() => setSelection({ kind: "link", id: l.id })}
                        className={cn(
                          controls.listItem,
                          active && controls.listItemActive,
                        )}
                      >
                        <span className="text-foreground line-clamp-1 text-sm font-medium">
                          {l.title}
                        </span>
                        <span className="text-muted-foreground flex w-full items-center justify-between gap-2 text-xs">
                          <span className="truncate">{hostname(l.url)}</span>
                          <span className="shrink-0">
                            {connections} {connections === 1 ? "link" : "links"}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="border-border flex items-start gap-2 border-t px-4 py-3">
            <Info className="text-muted-foreground mt-0.5 size-3.5 shrink-0" />
            <span className={typography.meta}>
              Drag from a node&apos;s right edge to another node to link related
              sources. Click a connection to explain why it exists.
            </span>
          </div>
        </aside>

        {/* Canvas */}
        <div className={graph.canvas}>
          <KnowledgeGraph
            links={links}
            edges={edges}
            folderColor={folder.color}
            selectedLinkId={selectedLink?.id ?? null}
            selectedEdgeId={selectedEdge?.id ?? null}
            onSelectLink={(id) =>
              setSelection(id === null ? null : { kind: "link", id })
            }
            onSelectEdge={(id) => setSelection({ kind: "edge", id })}
            onConnect={handleConnect}
            onMoveNode={handleMoveNode}
          />
        </div>

        {/* Full-height inspector: a sibling of the canvas, so it shrinks the
            graph instead of covering it. */}
        {selectedLink ? (
          <LinkInspector
            key={`link-${selectedLink.id}`}
            link={selectedLink}
            connectionCount={
              edges.filter(
                (e) =>
                  e.sourceId === selectedLink.id ||
                  e.targetId === selectedLink.id,
              ).length
            }
            onClose={() => setSelection(null)}
            onSave={(values) => handleSaveLink(selectedLink.id, values)}
            onDelete={() => handleDeleteLink(selectedLink.id)}
          />
        ) : null}

        {selectedEdge ? (
          <EdgeInspector
            key={`edge-${selectedEdge.id}`}
            edge={selectedEdge}
            sourceTitle={titleById.get(selectedEdge.sourceId) ?? "Unknown"}
            targetTitle={titleById.get(selectedEdge.targetId) ?? "Unknown"}
            onClose={() => setSelection(null)}
            onSave={(values) => handleSaveEdge(selectedEdge.id, values)}
            onDelete={() => handleDeleteEdge(selectedEdge.id)}
          />
        ) : null}
      </div>
    </div>
  );
}
