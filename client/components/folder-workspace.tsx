"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Info } from "lucide-react";

import type { KnowledgeFolder, Node, Edge } from "@/lib/types";
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
import * as api from "@/lib/api";
import { toast } from "sonner";

type Selection =
  { kind: "link"; id: number } | { kind: "edge"; id: number } | null;

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function FolderWorkspace({ folderId }: { folderId: number }) {
  const [folder, setFolder] = useState<KnowledgeFolder | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selection, setSelection] = useState<Selection>(null);
  const [loading, setLoading] = useState(true);

  // Load folder data on mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await api.getFolderWithContents(folderId);
        setFolder(data.folder);
        setNodes(data.nodes);
        setEdges(data.edges);
      } catch (error) {
        console.error("Failed to load folder:", error);
        toast.error("Failed to load folder data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [folderId]);

  // Filter nodes by graph status
  const nodesOnGraph = useMemo(() => nodes.filter((n) => n.isOnGraph), [nodes]);
  const nodesInStorage = useMemo(
    () => nodes.filter((n) => !n.isOnGraph),
    [nodes],
  );

  const selectedLink =
    selection?.kind === "link"
      ? (nodes.find((n) => n.id === selection.id) ?? null)
      : null;
  const selectedEdge =
    selection?.kind === "edge"
      ? (edges.find((e) => e.id === selection.id) ?? null)
      : null;

  const titleById = useMemo(() => {
    const map = new Map<number, string>();
    for (const n of nodes) map.set(n.id, n.title);
    return map;
  }, [nodes]);

  async function handleAddLink(values: NewLinkValues) {
    try {
      const { node } = await api.createNode({
        title: values.title,
        link: values.url,
        knowledgeFolderId: folderId,
        contentSummary: values.description || undefined,
        posX: 120 + nodes.length * 40,
        posY: 260,
        isOnGraph: false, // Start in storage
      });
      setNodes((prev) => [...prev, node]);
      toast.success("Link added to storage");
    } catch (error) {
      console.error("Failed to create node:", error);
      toast.error("Failed to add link");
    }
  }

  async function handleAddToGraph(id: number) {
    try {
      const { node } = await api.updateNodeGraphVisibility(id, true);
      setNodes((prev) => prev.map((n) => (n.id === id ? node : n)));
      toast.success("Added to graph");
    } catch (error) {
      console.error("Failed to add to graph:", error);
      toast.error("Failed to add to graph");
    }
  }

  async function handleRemoveFromGraph(id: number) {
    try {
      const { node } = await api.updateNodeGraphVisibility(id, false);
      setNodes((prev) => prev.map((n) => (n.id === id ? node : n)));
      // Remove edges connected to this node
      const connectedEdges = edges.filter(
        (e) => e.firstNodeId === id || e.secondNodeId === id,
      );
      await Promise.all(connectedEdges.map((edge) => api.deleteEdge(edge.id)));
      setEdges((prev) =>
        prev.filter((e) => e.firstNodeId !== id && e.secondNodeId !== id),
      );
      setSelection(null);
      toast.success("Removed from graph");
    } catch (error) {
      console.error("Failed to remove from graph:", error);
      toast.error("Failed to remove from graph");
    }
  }

  async function handleSaveLink(
    id: number,
    values: { title: string; url: string; description: string },
  ) {
    try {
      const { node } = await api.updateNode(id, {
        title: values.title,
        contentSummary: values.description || undefined,
      });
      setNodes((prev) => prev.map((n) => (n.id === id ? node : n)));
      toast.success("Link updated");
    } catch (error) {
      console.error("Failed to update node:", error);
      toast.error("Failed to update link");
    }
  }

  async function handleDeleteLink(id: number) {
    try {
      await api.deleteNode(id);
      setNodes((prev) => prev.filter((n) => n.id !== id));
      setEdges((prev) =>
        prev.filter((e) => e.firstNodeId !== id && e.secondNodeId !== id),
      );
      setSelection(null);
      toast.success("Link deleted");
    } catch (error) {
      console.error("Failed to delete node:", error);
      toast.error("Failed to delete link");
    }
  }

  async function handleMoveNode(id: number, x: number, y: number) {
    try {
      const { node } = await api.updateNodePosition(id, x, y);
      setNodes((prev) => prev.map((n) => (n.id === id ? node : n)));
    } catch (error) {
      console.error("Failed to update node position:", error);
    }
  }

  async function handleConnect(firstNodeId: number, secondNodeId: number) {
    if (firstNodeId === secondNodeId) return;

    try {
      const { edge } = await api.createEdge({
        knowledgeFolderId: folderId,
        firstNodeId,
        secondNodeId,
        score: 50, // Default moderate strength
      });
      setEdges((prev) => [...prev, edge]);
      setSelection({ kind: "edge", id: edge.id });
      toast.success("Connection created");
    } catch (error) {
      console.error("Failed to create edge:", error);
      toast.error("Failed to create connection");
    }
  }

  async function handleSaveEdge(
    id: number,
    values: {
      label: string;
      reasoning: string;
      strength: number;
    },
  ) {
    try {
      const { edge } = await api.updateEdge(id, {
        label: values.label || undefined,
        reasoning: values.reasoning || undefined,
        score: values.strength,
      });
      setEdges((prev) => prev.map((e) => (e.id === id ? edge : e)));
      toast.success("Connection updated");
    } catch (error) {
      console.error("Failed to update edge:", error);
      toast.error("Failed to update connection");
    }
  }

  async function handleDeleteEdge(id: number) {
    try {
      await api.deleteEdge(id);
      setEdges((prev) => prev.filter((e) => e.id !== id));
      setSelection(null);
      toast.success("Connection deleted");
    } catch (error) {
      console.error("Failed to delete edge:", error);
      toast.error("Failed to delete connection");
    }
  }

  if (loading) {
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
        <div className="flex h-full items-center justify-center">
          <p className={typography.bodyMuted}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!folder) {
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
        <div className="flex h-full items-center justify-center">
          <p className={typography.bodyMuted}>Folder not found</p>
        </div>
      </div>
    );
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
              <h1 className={typography.heading}>{folder.title}</h1>
              {folder.description ? (
                <p className={cn(typography.bodyMuted, "mt-1 line-clamp-3")}>
                  {folder.description}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-3">
            <span className={typography.eyebrow}>
              Storage ({nodesInStorage.length})
            </span>
            <AddLinkDialog onCreate={handleAddLink} />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
            {nodesInStorage.length === 0 && nodesOnGraph.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                <FileText className="text-muted-foreground size-5" />
                <p className={typography.bodyMuted}>
                  No links yet. Add your first source.
                </p>
              </div>
            ) : nodesInStorage.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
                <p className={typography.bodyMuted}>
                  All links are on the graph
                </p>
              </div>
            ) : (
              <ul className="flex flex-col gap-1">
                {nodesInStorage.map((n) => {
                  const active =
                    selection?.kind === "link" && selection.id === n.id;
                  return (
                    <li key={n.id}>
                      <div
                        className={cn(
                          controls.listItem,
                          active && controls.listItemActive,
                          "cursor-pointer",
                        )}
                        onClick={() => setSelection({ kind: "link", id: n.id })}
                      >
                        <span className="text-foreground line-clamp-1 text-sm font-medium">
                          {n.title}
                        </span>
                        <div className="text-muted-foreground flex w-full items-center justify-between gap-2 text-xs">
                          <span className="truncate">{hostname(n.link)}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToGraph(n.id);
                            }}
                            className="h-6 text-xs"
                          >
                            Add to Graph
                          </Button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {nodesOnGraph.length > 0 && (
              <>
                <div className="mt-4 flex items-center justify-between px-2 py-3">
                  <span className={typography.eyebrow}>
                    On Graph ({nodesOnGraph.length})
                  </span>
                </div>
                <ul className="flex flex-col gap-1">
                  {nodesOnGraph.map((n) => {
                    const connections = edges.filter(
                      (e) => e.firstNodeId === n.id || e.secondNodeId === n.id,
                    ).length;
                    return (
                      <li key={n.id}>
                        <div
                          className={cn(
                            controls.listItem,
                            "cursor-default opacity-60",
                          )}
                        >
                          <span className="text-foreground line-clamp-1 text-sm font-medium">
                            {n.title}
                          </span>
                          <span className="text-muted-foreground flex w-full items-center justify-between gap-2 text-xs">
                            <span className="truncate">{hostname(n.link)}</span>
                            <span className="shrink-0">
                              {connections}{" "}
                              {connections === 1 ? "link" : "links"}
                            </span>
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>

          <div className="border-border flex items-start gap-2 border-t px-4 py-3">
            <Info className="text-muted-foreground mt-0.5 size-3.5 shrink-0" />
            <span className={typography.meta}>
              Add links to the graph, then drag from a node&apos;s edge to
              connect related sources.
            </span>
          </div>
        </aside>

        {/* Canvas */}
        <div className={graph.canvas}>
          <KnowledgeGraph
            links={nodesOnGraph.map((n) => ({
              id: n.id,
              folderId: n.knowledgeFolderId,
              title: n.title,
              url: n.link,
              description: n.contentSummary,
              posX: n.posX ?? 0,
              posY: n.posY ?? 0,
            }))}
            edges={edges.map((e) => ({
              id: e.id,
              folderId: e.knowledgeFolderId,
              sourceId: e.firstNodeId,
              targetId: e.secondNodeId,
              label: e.label,
              reasoning: e.reasoning,
              strength: e.score ?? 50,
              evidence: [],
            }))}
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

        {/* Inspector panels */}
        {selectedLink ? (
          <LinkInspector
            key={`link-${selectedLink.id}`}
            link={{
              id: selectedLink.id,
              folderId: selectedLink.knowledgeFolderId,
              title: selectedLink.title,
              url: selectedLink.link,
              description: selectedLink.contentSummary,
              posX: selectedLink.posX ?? 0,
              posY: selectedLink.posY ?? 0,
            }}
            connectionCount={
              edges.filter(
                (e) =>
                  e.firstNodeId === selectedLink.id ||
                  e.secondNodeId === selectedLink.id,
              ).length
            }
            onClose={() => setSelection(null)}
            onSave={(values) => handleSaveLink(selectedLink.id, values)}
            onDelete={() => handleDeleteLink(selectedLink.id)}
            onAddToGraph={
              !selectedLink.isOnGraph
                ? () => handleAddToGraph(selectedLink.id)
                : undefined
            }
            onRemoveFromGraph={
              selectedLink.isOnGraph
                ? () => handleRemoveFromGraph(selectedLink.id)
                : undefined
            }
          />
        ) : null}

        {selectedEdge ? (
          <EdgeInspector
            key={`edge-${selectedEdge.id}`}
            edge={{
              id: selectedEdge.id,
              folderId: selectedEdge.knowledgeFolderId,
              sourceId: selectedEdge.firstNodeId,
              targetId: selectedEdge.secondNodeId,
              label: selectedEdge.label,
              reasoning: selectedEdge.reasoning,
              strength: selectedEdge.score ?? 50,
              evidence: [],
            }}
            sourceTitle={titleById.get(selectedEdge.firstNodeId) ?? "Unknown"}
            targetTitle={titleById.get(selectedEdge.secondNodeId) ?? "Unknown"}
            onClose={() => setSelection(null)}
            onSave={(values) => handleSaveEdge(selectedEdge.id, values)}
            onDelete={() => handleDeleteEdge(selectedEdge.id)}
          />
        ) : null}
      </div>
    </div>
  );
}
