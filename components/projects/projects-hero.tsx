"use client";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

export function ProjectsHero({ projectCount }: { projectCount: number }) {
  return <header className="border-b border-hairline pb-9 pt-3 sm:pb-12">
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-xl"><h1 className="font-[family-name:var(--font-display)] text-5xl leading-tight text-ink sm:text-6xl">Your research,<br /><span className="text-primary">taking shape.</span></h1>
      <p className="mt-5 text-base leading-7 text-body">A place for your sources, questions, and the next good idea.</p></div>
      <Button size="lg" render={<Link href="/projects/new" />} className="h-12 w-full px-6 sm:w-auto"><HugeiconsIcon icon={Add01Icon} strokeWidth={1.75} className="size-4" />New project</Button>
    </div>
    <p className="mt-8 text-sm text-muted-foreground">{projectCount} research project{projectCount === 1 ? "" : "s"}</p>
  </header>;
}
