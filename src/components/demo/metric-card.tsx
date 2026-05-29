import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  label: string;
  value: string;
  detail?: string;
  icon: LucideIcon;
  tone?: "neutral" | "emerald" | "amber" | "sky" | "rose";
};

const toneClasses: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  neutral: "border-zinc-200 bg-white text-zinc-950",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-950",
  amber: "border-amber-200 bg-amber-50 text-amber-950",
  sky: "border-sky-200 bg-sky-50 text-sky-950",
  rose: "border-rose-200 bg-rose-50 text-rose-950",
};

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "neutral",
}: MetricCardProps) {
  return (
    <Card className={cn("overflow-hidden border shadow-sm", toneClasses[tone])}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">
              {label}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-normal">
              {value}
            </p>
            {detail ? (
              <p className="mt-2 text-sm leading-5 text-zinc-600">{detail}</p>
            ) : null}
          </div>
          <div className="rounded-lg border border-black/10 bg-white/70 p-2 shadow-sm">
            <Icon className="size-4 text-zinc-700" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
