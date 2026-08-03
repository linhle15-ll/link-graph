"use client";

import { useRouter } from "next/navigation";
import {
  FileText,
  GitBranch,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { colorVar, controls, typography } from "@/lib/theme";
import type { FolderSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FolderCard({ folder }: { folder: FolderSummary }) {
  const router = useRouter();

  return (
    <Card className="group hover:border-primary/40 relative flex flex-col gap-0 overflow-hidden p-0 transition hover:shadow-md">
      <button
        onClick={() => router.push(`/folder/${folder.id}`)}
        className="flex flex-1 flex-col items-start gap-3 p-5 text-left"
      >
        <span
          className="h-1.5 w-10 rounded-full"
          style={{ backgroundColor: colorVar(folder.color) }}
        />
        <div className="space-y-1.5">
          <h3 className={typography.cardTitle}>{folder.name}</h3>
          {folder.description ? (
            <p className={cn(typography.bodyMuted, "line-clamp-2")}>
              {folder.description}
            </p>
          ) : (
            <p className={typography.placeholder}>No description</p>
          )}
        </div>
      </button>

      <div className="border-border flex items-center justify-between border-t px-5 py-3">
        <div className="text-muted-foreground flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <FileText className="size-3.5" />
            {folder.linkCount} {folder.linkCount === 1 ? "link" : "links"}
          </span>
          <span className="flex items-center gap-1.5">
            <GitBranch className="size-3.5" />
            {folder.edgeCount} {folder.edgeCount === 1 ? "edge" : "edges"}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              controls.iconButton,
              "opacity-0 group-hover:opacity-100 focus:opacity-100 data-[state=open]:opacity-100",
            )}
          >
            <MoreVertical className="size-4" />
            <span className="sr-only">Folder options</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Pencil className="size-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <Trash2 className="size-4" />
              Delete folder
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
