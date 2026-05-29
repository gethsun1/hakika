"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Bell, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useHakika } from "@/context/HakikaContext";
import { formatDateTime, roleLabels } from "@/lib/hakika-format";

type DashboardShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
  actionHref?: string;
  actionLabel?: string;
};

const navItems = [
  { href: "/dashboard/diaspora", label: "Diaspora" },
  { href: "/dashboard/agent", label: "Agent" },
  { href: "/dashboard/admin", label: "Admin" },
  { href: "/dashboard/investor", label: "Investor" },
];

export function DashboardShell({
  eyebrow,
  title,
  description,
  icon: Icon,
  children,
  actionHref,
  actionLabel,
}: DashboardShellProps) {
  const { currentUserRole, notifications } = useHakika();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8faf9_0%,#eef2f0_48%,#f8faf9_100%)] pb-28 text-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-xl border border-zinc-200 bg-white/90 p-4 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-800">
                <Icon className="size-6" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="rounded-full">
                    {eyebrow}
                  </Badge>
                  <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                    Active as {roleLabels[currentUserRole]}
                    <ChevronRight className="size-3" />
                  </span>
                </div>
                <h1 className="mt-2 text-2xl font-semibold tracking-normal sm:text-3xl">
                  {title}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
                  {description}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-xs text-zinc-600">
                <Bell className="size-3.5" />
                {notifications.length} live alerts
              </div>
              {actionHref && actionLabel ? (
                <Button asChild className="h-9">
                  <Link href={actionHref}>
                    {actionLabel}
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
          <nav className="mt-5 flex gap-2 overflow-x-auto border-t border-zinc-100 pt-4">
            {navItems.map((item) => (
              <Button key={item.href} asChild variant="ghost" size="sm">
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </nav>
        </header>
        {children}
        <section className="grid gap-3 rounded-xl border border-zinc-200 bg-white/85 p-4 shadow-sm lg:grid-cols-[13rem_1fr]">
          <div>
            <p className="text-sm font-semibold">Notification trail</p>
            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Shared in-memory alerts from all dashboards.
            </p>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {notifications.slice(0, 4).map((notification) => (
              <div
                key={notification.id}
                className="rounded-lg border border-zinc-200 bg-zinc-50 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-medium">
                    {notification.title}
                  </p>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[0.68rem] text-zinc-500">
                    {notification.role}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-600">
                  {notification.message}
                </p>
                <p className="mt-2 text-[0.68rem] text-zinc-400">
                  {formatDateTime(notification.timestamp)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
