import type { MilestoneStatus } from "@/context/HakikaContext";
import { statusTone } from "@/lib/hakika-format";
import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: MilestoneStatus;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full border px-2.5 text-xs font-medium",
        statusTone(status),
        className
      )}
    >
      {status}
    </span>
  );
}
