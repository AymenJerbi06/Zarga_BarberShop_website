import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

type BadgeVariant =
  | "default"
  | "amber"
  | "green"
  | "red"
  | "blue"
  | "yellow"
  | "zinc";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-zinc-700 text-zinc-300",
  amber: "bg-amber-400/20 text-amber-400 border border-amber-400/30",
  green: "bg-green-500/20 text-green-400 border border-green-500/30",
  red: "bg-red-500/20 text-red-400 border border-red-500/30",
  blue: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  yellow: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  zinc: "bg-zinc-800 text-zinc-400 border border-zinc-700",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-sm",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; variant: BadgeVariant }> = {
    pending: { label: "En attente", variant: "yellow" },
    confirmed: { label: "Confirmé", variant: "blue" },
    arrived: { label: "Arrivé", variant: "blue" },
    in_service: { label: "En service", variant: "amber" },
    completed: { label: "Terminé", variant: "green" },
    cancelled_client: { label: "Annulé (client)", variant: "red" },
    cancelled_shop: { label: "Annulé (salon)", variant: "red" },
    no_show: { label: "Absent", variant: "red" },
    rescheduled: { label: "Reprogrammé", variant: "zinc" },
  };

  const { label, variant } = config[status] ?? { label: status, variant: "default" as BadgeVariant };

  return <Badge variant={variant}>{label}</Badge>;
}
