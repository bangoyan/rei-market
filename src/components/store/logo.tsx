import { cn } from "@/lib/utils";

/**
 * Rei Market logo: stylized "R" formed by a leaf shape.
 * The leaf doubles as the letter R's vertical stroke,
 * with a stem curving into the leg.
 */
export function Logo({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dims = { sm: "h-7 w-7", md: "h-9 w-9", lg: "h-14 w-14" };
  const text = { sm: "text-lg", md: "text-xl", lg: "text-3xl" };

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={dims[size]}
        aria-hidden="true"
      >
        {/* Background circle */}
        <rect width="40" height="40" rx="10" className="fill-primary" />
        {/* Leaf / R hybrid mark */}
        <path
          d="M13 30V12c0-1 .5-2 1.5-2.5C17 8.5 21 8 24 10c2.5 1.7 3 4.5 1.5 7-.8 1.3-2 2.2-3.5 2.8l5.5 10"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Leaf vein accent */}
        <path
          d="M17 15c2-1 4.5-1 6 .5"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
      <span className={cn("font-bold tracking-tight", text[size])}>
        <span className="text-primary">Rei</span>
        <span className="text-foreground"> Market</span>
      </span>
    </span>
  );
}

/** Icon-only version for favicon/compact use */
export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8", className)}
      aria-label="Rei Market"
    >
      <rect width="40" height="40" rx="10" fill="#15803D" />
      <path
        d="M13 30V12c0-1 .5-2 1.5-2.5C17 8.5 21 8 24 10c2.5 1.7 3 4.5 1.5 7-.8 1.3-2 2.2-3.5 2.8l5.5 10"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M17 15c2-1 4.5-1 6 .5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}
