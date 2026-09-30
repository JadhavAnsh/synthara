"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const stages = ["Discover", "Connect", "Draft"] as const;
const sources = [
  { title: "Attention is all you need", meta: "Vaswani et al. · 2017", type: "Paper" },
  { title: "BERT: pre-training deep bidirectional transformers", meta: "Devlin et al. · 2019", type: "Paper" },
  { title: "The annotated transformer", meta: "Architecture and implementation", type: "Web" },
];

export function ProductMockup() {
  const [stage, setStage] = useState(0);
  const reduced = useReducedMotion();
  return (
    <div className="observatory-demo overflow-hidden rounded-2xl bg-[#fffdf8]">
      <div className="flex items-center justify-between gap-4 border-b border-hairline px-6 py-4 text-xs text-muted-foreground">
        <span>Research in motion</span><span>Interactive example</span>
      </div>
      <div className="px-6 pt-7 sm:px-8">
        <p className="font-[family-name:var(--font-display)] text-3xl leading-tight text-ink">How do transformers<br />understand context?</p>
        <div className="mt-6 flex border-b border-hairline" role="group" aria-label="Explore the research workflow">
          {stages.map((label, index) => (
            <button key={label} type="button" aria-pressed={stage === index} onClick={() => setStage(index)} className={`relative flex-1 py-3 text-sm transition-colors ${stage === index ? "font-semibold text-primary" : "text-muted-foreground hover:text-ink"}`}>
              {label}
              {stage === index && <motion.span layoutId="demo-stage" transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }} className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />}
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-[290px] px-6 py-6 sm:px-8" aria-live="polite">
        <motion.div key={stage} initial={reduced ? false : { opacity: 0.6, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {stage === 0 ? <ul className="divide-y divide-hairline">{sources.map((source) => <li key={source.title} className="flex items-start gap-4 py-4 first:pt-0"><span className="mt-1 w-10 shrink-0 text-xs text-primary">{source.type}</span><div><p className="text-sm font-medium leading-6 text-ink">{source.title}</p><p className="mt-1 text-xs text-muted-foreground">{source.meta}</p></div></li>)}</ul> : stage === 1 ? <div><p className="text-sm text-muted-foreground">A shared idea across your sources</p><p className="mt-5 font-[family-name:var(--font-display)] text-3xl text-ink">Context changes meaning.</p><p className="mt-4 text-sm leading-7 text-body">Self-attention connects words across a sequence. Bidirectional training builds on that idea to learn from the surrounding context.</p><div className="mt-5 flex flex-wrap gap-3 text-xs text-primary"><span>Attention architecture</span><span aria-hidden>→</span><span>Contextual representations</span></div></div> : <div><p className="font-[family-name:var(--font-display)] text-2xl text-ink">From attention to understanding</p><p className="mt-4 text-sm leading-8 text-body">Transformer models use self-attention to model relationships within a sequence <span className="rounded bg-surface-card px-1 text-primary">[1]</span>. BERT extends this approach through bidirectional pre-training <span className="rounded bg-surface-card px-1 text-primary">[2]</span>.</p><p className="mt-6 border-t border-hairline pt-4 text-xs leading-5 text-muted-foreground">Illustrative draft · Review evidence before using generated text.</p></div>}
        </motion.div>
      </div>
      <div className="flex items-center justify-between gap-4 bg-surface-dark px-6 py-4 text-xs text-on-dark-soft"><span>From question to a grounded draft</span><button type="button" onClick={() => setStage((stage + 1) % stages.length)} className="shrink-0 py-2 text-on-dark underline underline-offset-4">{stage === 2 ? "Start again" : `Explore ${stages[stage + 1].toLowerCase()}`}</button></div>
    </div>
  );
}
