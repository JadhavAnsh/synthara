export default function WorkspaceRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="-mx-6 -my-10 sm:-mx-10 lg:-mx-12">
      {children}
    </div>
  );
}
