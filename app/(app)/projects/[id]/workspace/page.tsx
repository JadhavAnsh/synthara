import { WorkspacePageClient } from "@/components/workspace/workspace-page-client";

type WorkspacePageProps = {
  params: Promise<{ id: string }>;
};

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { id } = await params;

  return <WorkspacePageClient projectId={id} />;
}
