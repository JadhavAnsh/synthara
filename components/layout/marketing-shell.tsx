import { Footer } from "@/components/layout/footer";
import { TopNav } from "@/components/layout/top-nav";

type MarketingShellProps = {
  children: React.ReactNode;
};

export function MarketingShell({ children }: MarketingShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <a
        href="#overview"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-canvas focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink focus:shadow-sm"
      >
        Skip to content
      </a>
      <TopNav variant="marketing" />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
