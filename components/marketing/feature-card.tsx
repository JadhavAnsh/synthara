"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { HoverCard } from "@/components/marketing/motion-primitives";

type FeatureIconKind = "search" | "shield" | "citation";

function FeatureIcon({ kind, active }: { kind: FeatureIconKind; active: boolean }) {
  const reduceMotion = useReducedMotion();
  const draw = active && !reduceMotion;

  const pathProps = {
    initial: { pathLength: 0, opacity: 0.4 },
    animate: draw ? { pathLength: 1, opacity: 1 } : { pathLength: 1, opacity: 1 },
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
  };

  if (kind === "search") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className="size-6 text-primary" fill="none">
        <motion.circle
          cx="11"
          cy="11"
          r="6"
          stroke="currentColor"
          strokeWidth="1.75"
          {...pathProps}
        />
        <motion.path
          d="M16 16l4 4"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          {...pathProps}
          transition={{ ...pathProps.transition, delay: 0.12 }}
        />
        <motion.path
          d="M8 11h6M11 8v6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          {...pathProps}
          transition={{ ...pathProps.transition, delay: 0.2 }}
        />
      </svg>
    );
  }

  if (kind === "shield") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className="size-6 text-primary" fill="none">
        <motion.path
          d="M12 3.5 5 6.5v5.8c0 4.2 3 7.9 7 9.2 4-1.3 7-5 7-9.2V6.5L12 3.5Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
          {...pathProps}
        />
        <motion.path
          d="m9.5 12 1.8 1.8L15 10.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...pathProps}
          transition={{ ...pathProps.transition, delay: 0.18 }}
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-6 text-primary" fill="none">
      <motion.path
        d="M7 5.5v13M17 5.5v13"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        {...pathProps}
      />
      <motion.path
        d="M10 9h4M10 15h2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        {...pathProps}
        transition={{ ...pathProps.transition, delay: 0.12 }}
      />
      <motion.circle
        cx="16"
        cy="15"
        r="1.25"
        fill="currentColor"
        initial={{ scale: 0 }}
        animate={draw ? { scale: 1 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 28, delay: 0.28 }}
      />
    </svg>
  );
}

type FeatureCardProps = {
  title: string;
  description: string;
  icon: FeatureIconKind;
};

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  const reduceMotion = useReducedMotion();
  const [iconActive, setIconActive] = useState(reduceMotion === true);

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      onViewportEnter={() => setIconActive(true)}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ type: "spring", stiffness: 500, damping: 32 }}
    >
      <HoverCard className="rounded-lg bg-surface-card p-8">
        <FeatureIcon kind={icon} active={iconActive} />
        <h3 className="mt-5 text-lg font-medium text-ink">{title}</h3>
        <p className="mt-3 leading-7 text-body">{description}</p>
      </HoverCard>
    </motion.div>
  );
}
