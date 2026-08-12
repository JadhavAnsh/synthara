"use client";

import Link from "next/link";
import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const easeOut = [0.16, 1, 0.3, 1] as const;

const springSnappy = { type: "spring" as const, stiffness: 400, damping: 30 };
const springSoft = { type: "spring" as const, stiffness: 320, damping: 28 };

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 500, damping: 32 },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: easeOut },
  },
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-48px" }}
      variants={fadeUp}
      transition={reduceMotion ? { duration: 0 } : { delay }}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
};

export function Stagger({ children, className }: StaggerProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-48px" }}
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  );
}

type StaggerChildProps = {
  children: ReactNode;
  className?: string;
};

export function StaggerChild({ children, className }: StaggerChildProps) {
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}

type HoverLiftProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
};

export function HoverLift({ children, className, ...props }: HoverLiftProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn("transition-colors", className)}
      whileHover={reduceMotion ? undefined : { y: -3, scale: 1.01 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={springSnappy}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type MotionPressProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
};

export function MotionPress({ children, className, ...props }: MotionPressProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      whileHover={reduceMotion ? undefined : { scale: 1.02, y: -1 }}
      whileTap={reduceMotion ? undefined : { scale: 0.96, y: 0 }}
      transition={springSnappy}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type HoverCardProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
};

export function HoverCard({ children, className, ...props }: HoverCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn("h-full", className)}
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -4,
              boxShadow: "0 8px 24px rgba(20, 20, 19, 0.08)",
            }
      }
      whileTap={reduceMotion ? undefined : { y: -1, scale: 0.995 }}
      transition={springSoft}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type NavLinkMotionProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function NavLinkMotion({ href, children, className }: NavLinkMotionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <Link
      href={href}
      className={cn(
        "group relative py-1 text-body transition-colors hover:text-ink",
        className,
      )}
    >
      {children}
      <motion.span
        aria-hidden
        className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left rounded-full bg-primary"
        initial={false}
        animate={reduceMotion ? { scaleX: 1, opacity: 0 } : { scaleX: 0, opacity: 1 }}
        whileHover={reduceMotion ? undefined : { scaleX: 1 }}
        transition={{ duration: 0.22, ease: easeOut }}
      />
    </Link>
  );
}

type HighlightItemProps = {
  children: ReactNode;
  index: number;
};

export function HighlightItem({ children, index }: HighlightItemProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.li
      className="flex items-start gap-3 text-sm text-body-strong"
      initial={reduceMotion ? false : { opacity: 0, x: -10 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-24px" }}
      transition={{
        delay: index * 0.08,
        duration: 0.3,
        ease: easeOut,
      }}
    >
      <motion.span
        aria-hidden
        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
        initial={reduceMotion ? false : { scale: 0 }}
        whileInView={reduceMotion ? undefined : { scale: 1 }}
        viewport={{ once: true, margin: "-24px" }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          delay: index * 0.08 + 0.04,
        }}
      />
      {children}
    </motion.li>
  );
}
