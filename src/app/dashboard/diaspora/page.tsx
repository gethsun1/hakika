"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Banknote,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  FolderKanban,
  Globe2,
  ShieldCheck,
} from "lucide-react";

import { DashboardShell } from "@/components/demo/dashboard-shell";
import { MetricCard } from "@/components/demo/metric-card";
import { StatusBadge } from "@/components/demo/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useHakika } from "@/context/HakikaContext";
import {
  formatCompactCurrency,
  formatCurrency,
  formatDate,
} from "@/lib/hakika-format";

export default function DiasporaDashboardPage() {
  const { projects, simulatedLedger } = useHakika();
  const pendingApprovals = projects.reduce(
    (sum, project) =>
      sum +
      project.milestones.filter(
        (milestone) =>
          milestone.status === "Submitted" &&
          milestone.adminReview === "Approved"
      ).length,
    0
  );
  const totalFunded = projects.reduce(
    (sum, project) => sum + project.totalBudget,
    0
  );

  return (
    <DashboardShell
      eyebrow="Diaspora client"
      title="Project funding command"
      description="Track funded projects in Kenya, inspect milestone status, and release capital only after verified outcomes are submitted."
      icon={Globe2}
      actionHref="/dashboard/diaspora/create"
      actionLabel="Create New Project Request"
    >
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Funded"
          value={formatCompactCurrency(totalFunded)}
          detail="All simulated diaspora deposits"
          icon={CircleDollarSign}
          tone="emerald"
        />
        <MetricCard
          label="Active Projects"
          value={`${projects.length}`}
          detail="Across Kenyan counties"
          icon={FolderKanban}
        />
        <MetricCard
          label="Pending Approval"
          value={`${pendingApprovals}`}
          detail="Admin-approved proof packages"
          icon={ClipboardCheck}
          tone="sky"
        />
        <MetricCard
          label="Capital in Escrow"
          value={formatCompactCurrency(simulatedLedger.held)}
          detail="Held until milestone release"
          icon={Banknote}
          tone="amber"
        />
      </section>

      <Card className="border-zinc-200 bg-white shadow-sm">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Active Kenyan projects</CardTitle>
            <p className="mt-1 text-sm text-zinc-500">
              Shared project state updates when agents, admins, or clients act.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/dashboard/diaspora/create">
              New request
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-zinc-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50">
                  <TableHead>Project</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => {
                  const activeMilestone =
                    project.milestones.find(
                      (milestone) => milestone.status !== "Released"
                    ) ?? project.milestones.at(-1);

                  return (
                    <TableRow key={project.id}>
                      <TableCell className="min-w-64">
                        <div className="font-medium">{project.name}</div>
                        <div className="mt-1 flex flex-wrap gap-2">
                          <Badge variant="secondary">{project.category}</Badge>
                          <span className="text-xs text-zinc-500">
                            Created {formatDate(project.createdAt)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{project.location}</div>
                        <div className="text-xs text-zinc-500">
                          {project.county} County
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(project.totalBudget)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          {activeMilestone ? (
                            <StatusBadge status={activeMilestone.status} />
                          ) : null}
                          <span className="max-w-72 text-xs leading-5 text-zinc-500">
                            {project.currentStage}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/dashboard/diaspora/project/${project.id}`}>
                            View
                            <ArrowUpRight className="size-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <Card className="border-zinc-200 bg-white shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-700">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold">Client release rule</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Funds stay held until a verified agent submits evidence, an
                  admin approves proof quality, and the diaspora sponsor releases
                  the milestone.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-200 bg-zinc-950 text-white shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-emerald-200">
              <Clock3 className="size-4" />
              <span className="text-sm font-medium">Next best action</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/72">
              Open the Kisumu roofing project and approve or dispute the
              submitted truss milestone to watch every other dashboard update.
            </p>
          </CardContent>
        </Card>
      </section>
    </DashboardShell>
  );
}
