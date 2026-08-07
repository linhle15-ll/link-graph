import { FolderWorkspace } from "@/components/folder-workspace";

export default async function FolderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const folderId = parseInt(id, 10);

  if (isNaN(folderId)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Invalid folder ID</p>
      </div>
    );
  }

  return <FolderWorkspace folderId={folderId} />;
}
