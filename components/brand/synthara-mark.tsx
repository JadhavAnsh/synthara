import { cn } from "@/lib/utils";

type SyntharaMarkProps = {
  className?: string;
  size?: "sm" | "md";
};

/** Citation-bracket mark: source linked to document. */
export function SyntharaMark({ className, size = "md" }: SyntharaMarkProps) {
  const dimension = size === "sm" ? 16 : 20;

  return (
    <svg
      aria-hidden
      width={dimension}
      height={dimension}
      viewBox="0 0 20 20"
      fill="none"
      className={cn("shrink-0 text-primary", className)}
    >
      <path
        d="M4 5.5v9M16 5.5v9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M7.5 8h5M7.5 12h3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="14.5" cy="12" r="1.25" fill="currentColor" />
    </svg>
  );
}
