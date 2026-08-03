import { FolderOpen } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { CreateFolderDialog } from "@/components/create-folder-dialog";
import { FolderCard } from "@/components/folder-card";
import { folders } from "@/lib/placeholder-content";
import { surfaces, typography } from "@/lib/theme";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className={surfaces.page}>
      <SiteHeader>
        <CreateFolderDialog />
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
            <CreateFolderDialog />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {folders.map((folder) => (
              <FolderCard key={folder.id} folder={folder} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
