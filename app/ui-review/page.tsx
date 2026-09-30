"use client";
import { WorkspaceLayout } from "@/components/workspace/workspace-layout";
import { ProjectsHero } from "@/components/projects/projects-hero";
export default function ReviewPage() {
  return <main><div className="mx-auto max-w-5xl px-5 py-8"><ProjectsHero projectCount={3} /></div><div className="flex h-[700px] flex-col"><WorkspaceLayout outline={<p className="p-4 text-on-dark">Introduction</p>} editor={<textarea aria-label="Review draft" defaultValue="A research draft. This text should survive switching panels." className="h-full w-full rounded-xl bg-canvas p-8" />} sourcePicker={<p className="text-on-dark">Selected source: Attention is all you need</p>} assistant={<p className="p-8 text-on-dark">Research assistant preview</p>} /></div></main>;
}
