import { notFound } from "next/navigation";

import { FolderWorkspace } from "@/components/folder-workspace";
import { getFolder, getGraph } from "@/lib/placeholder-content";

export default async function FolderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const folderId = Number(id);
  const folder = Number.isInteger(folderId) ? getFolder(folderId) : null;
  if (!folder) notFound();

  const { nodes, edges } = getGraph(folderId);

  return (
    <FolderWorkspace
      folder={folder}
      initialLinks={nodes}
      initialEdges={edges}
    />
  );
}
