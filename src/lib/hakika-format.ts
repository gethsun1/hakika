import type { MilestoneStatus, UserRole } from "@/context/HakikaContext";

export const roleLabels: Record<UserRole, string> = {
  diaspora: "Diaspora",
  agent: "Field Agent",
  admin: "System Admin",
  investor: "Investor",
};

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("KES", "KSh");
}

export function formatCompactCurrency(value: number): string {
  if (value >= 1000000) {
    return `KSh ${(value / 1000000).toFixed(2)}M`;
  }

  if (value >= 1000) {
    return `KSh ${Math.round(value / 1000)}K`;
  }

  return formatCurrency(value);
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function statusTone(status: MilestoneStatus): string {
  const styles: Record<MilestoneStatus, string> = {
    Pending:
      "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300",
    Held:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-200",
    Submitted:
      "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900/60 dark:bg-sky-950/50 dark:text-sky-200",
    Released:
      "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-200",
    Disputed:
      "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-200",
  };

  return styles[status];
}
