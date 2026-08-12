import { TopNav } from "@/components/layout/top-nav";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <TopNav variant="app" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:px-10 lg:px-12">
        {children}
      </main>
    </div>
  );
}
