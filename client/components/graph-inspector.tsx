"use client";

import { useState } from "react";
import {
  ArrowRight,
  ExternalLink,
  MessageSquarePlus,
  Plus,
  Quote,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type EdgeEvidence, type GraphEdge, type LinkNode } from "@/lib/types";
import { controls, graph, surfaces, typography } from "@/lib/theme";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Shell                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Full-height panel docked beside the canvas. Rendered as a flex sibling of the
 * graph so it never covers the nodes it describes.
 */
function InspectorShell({
  title,
  eyebrow,
  onClose,
  actions,
  footer,
  children,
}: {
  title: string;
  eyebrow: string;
  onClose: () => void;
  actions?: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <aside
      className={cn(graph.inspector, "border-t lg:border-t-0")}
      aria-label={title}
    >
      <div className={graph.inspectorHeader}>
        <div className="min-w-0">
          <p className={typography.eyebrow}>{eyebrow}</p>
          <h2 className={cn(typography.panelTitle, "mt-1")}>{title}</h2>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {actions}
          <button onClick={onClose} className={controls.iconButton}>
            <X className="size-4" />
            <span className="sr-only">Close panel</span>
          </button>
        </div>
      </div>

      <div className={graph.inspectorBody}>{children}</div>

      <div className={graph.inspectorFooter}>{footer}</div>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/*  Link inspector                                                            */
/* -------------------------------------------------------------------------- */

export function LinkInspector({
  link,
  connectionCount,
  onClose,
  onSave,
  onDelete,
  onRemoveFromGraph,
  onAddToGraph,
}: {
  link: LinkNode;
  connectionCount: number;
  onClose: () => void;
  onSave: (values: { title: string; url: string; description: string }) => void;
  onDelete: () => void;
  onRemoveFromGraph?: () => void;
  onAddToGraph?: () => void;
}) {
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);
  const [description, setDescription] = useState(link.description ?? "");

  const dirty =
    title !== link.title ||
    url !== link.url ||
    description !== (link.description ?? "");

  return (
    <InspectorShell
      eyebrow="Source"
      title={link.title}
      onClose={onClose}
      footer={
        <>
          {onAddToGraph && (
            <Button variant="default" size="sm" onClick={onAddToGraph}>
              Add to Graph
            </Button>
          )}
          {onRemoveFromGraph && (
            <Button variant="ghost" size="sm" onClick={onRemoveFromGraph}>
              Remove from Graph
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className={controls.destructive}
            onClick={onDelete}
            disabled={onRemoveFromGraph !== undefined}
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
          <Button
            size="sm"
            disabled={!dirty || !title.trim() || !url.trim()}
            onClick={() => onSave({ title, url, description })}
          >
            Save changes
          </Button>
        </>
      }
    >
      <div className={surfaces.inset}>
        <p className={typography.meta}>
          {connectionCount === 0
            ? "Not connected to anything yet."
            : `Connected to ${connectionCount} other ${
                connectionCount === 1 ? "source" : "sources"
              }.`}
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="insp-title">Title</Label>
        <Input
          id="insp-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="insp-url">URL</Label>
        <Input
          id="insp-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button
          variant="secondary"
          size="sm"
          className="mt-1 self-start"
          nativeButton={false}
          render={<a href={url} target="_blank" rel="noreferrer" />}
        >
          <ExternalLink className="size-4" />
          Open source
        </Button>
      </div>

      <div className="grid flex-1 gap-1">
        <Label htmlFor="insp-desc">Notes</Label>
        <Textarea
          id="insp-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Why is this source relevant? What does it argue?"
          className="min-h-40 flex-1 resize-none leading-relaxed"
          rows={6}
        />
      </div>
    </InspectorShell>
  );
}

/* -------------------------------------------------------------------------- */
/*  Edge inspector                                                            */
/* -------------------------------------------------------------------------- */

export function EdgeInspector({
  edge,
  sourceTitle,
  targetTitle,
  onClose,
  onSave,
  onDelete,
}: {
  edge: GraphEdge;
  sourceTitle: string;
  targetTitle: string;
  onClose: () => void;
  onSave: (values: {
    label: string;
    reasoning: string;
    strength: number;
    evidence: EdgeEvidence[];
  }) => void;
  onDelete: () => void;
}) {
  const [label, setLabel] = useState(edge.label ?? "");
  const [reasoning, setReasoning] = useState(edge.reasoning ?? "");
  const [strength, setStrength] = useState(String(edge.strength));
  const [evidence, setEvidence] = useState<EdgeEvidence[]>(edge.evidence);
  const [draftQuote, setDraftQuote] = useState("");
  const [draftSource, setDraftSource] = useState("");
  const [chatOpen, setChatOpen] = useState(true);

  const dirty =
    label !== (edge.label ?? "") ||
    reasoning !== (edge.reasoning ?? "") ||
    strength !== String(edge.strength) ||
    evidence !== edge.evidence;

  function addEvidence() {
    if (!draftQuote.trim()) return;
    setEvidence((prev) => [
      ...prev,
      {
        id: Date.now(),
        quote: draftQuote.trim(),
        source: draftSource.trim() || null,
      },
    ]);
    setDraftQuote("");
    setDraftSource("");
  }

  return (
    <InspectorShell
      eyebrow="Connection"
      title={label.trim() || "Why are these linked?"}
      onClose={onClose}
      actions={
        <Tooltip>
          <TooltipTrigger
            onClick={() => setChatOpen((v) => !v)}
            aria-pressed={chatOpen}
            className={cn(
              controls.iconButton,
              chatOpen && "bg-accent text-accent-foreground",
            )}
          >
            <MessageSquarePlus className="size-4" />
            <span className="sr-only">Discuss this connection</span>
          </TooltipTrigger>
          <TooltipContent>Discuss this connection with AI</TooltipContent>
        </Tooltip>
      }
      footer={
        <>
          <Button
            variant="ghost"
            size="sm"
            className={controls.destructive}
            onClick={onDelete}
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
          <Button
            size="sm"
            disabled={!dirty}
            onClick={() =>
              onSave({
                label,
                reasoning,
                strength: Number(strength),
                evidence,
              })
            }
          >
            Save changes
          </Button>
        </>
      }
    >
      {/* Tab body: Endpoints, Relationship + Strenght, Reasoning, Evidence */}
      <div className="flex flex-col gap-4">
        {/* Endpoints */}
        <div className={surfaces.inset}>
          <p className="text-foreground text-sm leading-snug font-medium">
            {sourceTitle}
          </p>
          <p className="text-muted-foreground my-1.5 flex items-center gap-1.5 text-xs">
            <ArrowRight className="size-3.5" />
            {label.trim() || "relates to"}
          </p>
          <p className="text-foreground text-sm leading-snug font-medium">
            {targetTitle}
          </p>
        </div>

        {/* Relationship + strength */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="edge-label">Relationship</Label>
            <Input
              id="edge-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="builds on, contradicts…"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-baseline justify-between gap-2">
              {/* Strength indicator: 0 - 100 */}
              <Label htmlFor="edge-strength">Strength</Label>

              <span className={typography.meta}>
                {Number(strength) >= 75
                  ? "Strong"
                  : Number(strength) >= 25
                    ? "Moderate"
                    : "Weak"}{" "}
                connection
              </span>
            </div>
            <Input
              id="edge-strength"
              type="number"
              min="0"
              max="100"
              value={strength}
              onChange={(e) => setStrength(e.target.value)}
              placeholder="50"
            />
          </div>
        </div>

        {/* Long-form reasoning — the reason this panel is full height. */}
        <div className="flex min-h-0 flex-1 flex-col gap-2">
          <div className="flex items-baseline justify-between gap-2">
            <Label htmlFor="edge-reasoning">Reasoning</Label>
            <span className={typography.meta}>
              {reasoning.length} characters
            </span>
          </div>
          <Textarea
            id="edge-reasoning"
            value={reasoning}
            onChange={(e) => setReasoning(e.target.value)}
            placeholder="Explain the argument that ties these two sources together — what one claims, how the other answers it, and what changes if you accept both."
            className="min-h-56 flex-1 resize-none leading-relaxed"
          />
        </div>

        {/* Evidence */}
        {/* <div className="grid gap-2">
          <div className="flex items-baseline justify-between gap-2">
            <Label>Supporting excerpts</Label>
            <span className={typography.meta}>{evidence.length}</span>
          </div>

          {evidence.length === 0 ? (
            <p className={typography.meta}>
              No excerpts yet. Paste the passages that convinced you.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {evidence.map((item) => (
                <li
                  key={item.id}
                  className="group/quote border-border bg-background flex items-start gap-2 rounded-md border p-3"
                >
                  <Quote className="text-primary mt-0.5 size-3.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground text-sm leading-relaxed text-pretty">
                      {item.quote}
                    </p>
                    {item.source ? (
                      <p className={cn(typography.meta, "mt-1")}>
                        {item.source}
                      </p>
                    ) : null}
                  </div>
                  <button
                    onClick={() =>
                      setEvidence((prev) =>
                        prev.filter((e) => e.id !== item.id),
                      )
                    }
                    className={cn(
                      controls.iconButton,
                      "opacity-0 group-hover/quote:opacity-100 focus-visible:opacity-100",
                    )}
                  >
                    <Trash2 className="size-3.5" />
                    <span className="sr-only">Remove excerpt</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="border-border mt-1 grid gap-2 rounded-md border border-dashed p-3">
            <Textarea
              value={draftQuote}
              onChange={(e) => setDraftQuote(e.target.value)}
              placeholder="Paste a quote…"
              className="max-h-20 resize-none leading-relaxed"
              aria-label="Excerpt text"
            />
            <div className="flex items-center gap-2">
              <Input
                value={draftSource}
                onChange={(e) => setDraftSource(e.target.value)}
                placeholder="Where from? e.g. Section 3.2"
                aria-label="Excerpt source"
              />
              <Button
                variant="secondary"
                size="sm"
                disabled={!draftQuote.trim()}
                onClick={addEvidence}
              >
                <Plus className="size-4" />
                Add
              </Button>
            </div>
          </div>
        </div>*/}
      </div>
    </InspectorShell>
  );
}
