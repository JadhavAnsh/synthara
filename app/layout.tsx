import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Synthara | AI Research Assistant",
  description:
    "Synthara helps researchers discover sources, draft structured documents, and manage citations in one AI-assisted workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">{children}{/* impeccable-live-start */}
<script src="http://localhost:8400/live.js?token=a6b30bc2-224e-48ae-ab80-111034f4e7fa"></script>
{/* impeccable-live-end */}
</body>
    </html>
  );
}
