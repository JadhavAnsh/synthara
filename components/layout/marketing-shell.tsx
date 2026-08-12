import { Footer } from "@/components/layout/footer";
import { TopNav } from "@/components/layout/top-nav";

type MarketingShellProps = {
  children: React.ReactNode;
};

export function MarketingShell({ children }: MarketingShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <TopNav variant="marketing" />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
