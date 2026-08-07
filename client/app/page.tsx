"use client";

import { useEffect, useState } from "react";
import { FolderOpen } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { CreateFolderDialog } from "@/components/create-folder-dialog";
import { FolderCard } from "@/components/folder-card";
import { surfaces, typography } from "@/lib/theme";
import { cn } from "@/lib/utils";
import * as api from "@/lib/api";
import type { KnowledgeFolder } from "@/lib/types";
import { toast } from "sonner";

export default function HomePage() {
  const [folders, setFolders] = useState<KnowledgeFolder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFolders() {
      try {
        setLoading(true);
        const { folders: fetchedFolders } = await api.getAllKnowledgeFolders();
        setFolders(fetchedFolders);
      } catch (error) {
        console.error("Failed to load folders:", error);
        toast.error("Failed to load folders");
      } finally {
        setLoading(false);
      }
    }
    loadFolders();
  }, []);

  async function handleCreateFolder(folder: {
    title: string;
    description?: string;
    color?: string;
  }) {
    try {
      const { folder: newFolder } = await api.createKnowledgeFolder(folder);
      setFolders((prev) => [...prev, newFolder]);
      toast.success("Folder created");
    } catch (error) {
      console.error("Failed to create folder:", error);
      toast.error("Failed to create folder");
    }
  }

  async function handleDeleteFolder(id: number) {
    try {
      await api.deleteKnowledgeFolder(id);
      setFolders((prev) => prev.filter((f) => f.id !== id));
      toast.success("Folder deleted");
    } catch (error) {
      console.error("Failed to delete folder:", error);
      toast.error("Failed to delete folder");
    }
  }

  if (loading) {
    return (
      <div className={surfaces.page}>
        <SiteHeader>
          <CreateFolderDialog onCreate={handleCreateFolder} />
        </SiteHeader>
        <main className={cn(surfaces.container, "py-10")}>
          <p className={typography.bodyMuted}>Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className={surfaces.page}>
      <SiteHeader>
        <CreateFolderDialog onCreate={handleCreateFolder} />
      </SiteHeader>

      <main className={cn(surfaces.container, "py-10")}>
        <div className="mb-8 max-w-2xl">
          <h1 className={typography.display}>Your knowledge folders</h1>
          <p className={cn(typography.lead, "mt-3")}>
            Group the links you collect while researching, then map how each
            source connects to the others in an interactive knowledge graph.
          </p>
        </div>

        {folders.length === 0 ? (
          <div className={surfaces.empty}>
            <span className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
              <FolderOpen className="size-6" />
            </span>
            <div className="space-y-1">
              <p className="text-foreground font-medium">No folders yet</p>
              <p className={typography.bodyMuted}>
                Create your first knowledge folder to start collecting links.
              </p>
            </div>
            <CreateFolderDialog onCreate={handleCreateFolder} />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {folders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                nodeCount={folder.nodeCount || 0}
                edgeCount={folder.edgeCount || 0}
                onDelete={handleDeleteFolder}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
