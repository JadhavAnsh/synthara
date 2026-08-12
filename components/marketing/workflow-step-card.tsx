"use client";

import { motion, useReducedMotion } from "motion/react";

type WorkflowStepCardProps = {
  title: string;
  description: string;
  index: number;
};

export function WorkflowStepCard({ title, description, index }: WorkflowStepCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="group h-full rounded-lg border border-hairline bg-canvas p-6"
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 32,
        delay: index * 0.06,
      }}
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -3,
              borderColor: "rgba(204, 120, 92, 0.35)",
              boxShadow: "0 6px 20px rgba(20, 20, 19, 0.06)",
            }
      }
      whileTap={reduceMotion ? undefined : { scale: 0.995 }}
    >
      <motion.span
        aria-hidden
        className="inline-flex size-7 items-center justify-center rounded-md bg-surface-soft text-xs font-medium text-primary"
        whileHover={reduceMotion ? undefined : { scale: 1.08 }}
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
      >
        {index + 1}
      </motion.span>
      <h3 className="mt-4 font-medium text-ink transition-colors group-hover:text-body-strong">
        {title}
      </h3>
      <p className="mt-2 leading-7 text-body">{description}</p>
    </motion.div>
  );
}
