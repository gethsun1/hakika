"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownUp,
  CheckCircle2,
  ClipboardList,
  ServerCog,
  ShieldCheck,
  WalletCards,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

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
import type { Milestone, Project } from "@/context/HakikaContext";
import { useHakika } from "@/context/HakikaContext";
import { formatCurrency, formatDate } from "@/lib/hakika-format";

type QueueItem = {
  project: Project;
  milestone: Milestone;
};

type SortMode = "due" | "budget";

export default function AdminDashboardPage() {
  const {
    projects,
    simulatedLedger,
    approveAgentProof,
    rejectAgentProof,
  } = useHakika();
  const [sortMode, setSortMode] = useState<SortMode>("due");

  const allMilestones = useMemo<QueueItem[]>(
    () =>
      projects.flatMap((project) =>
        project.milestones.map((milestone) => ({ project, milestone }))
      ),
    [projects]
  );

  const sortQueue = (items: QueueItem[]) =>
    [...items].sort((a, b) =>
      sortMode === "budget"
        ? b.milestone.budget - a.milestone.budget
        : a.milestone.dueDate.localeCompare(b.milestone.dueDate)
    );

  const pendingVerifications = sortQueue(
    allMilestones.filter(
      ({ milestone }) =>
        milestone.status === "Submitted" && milestone.adminReview === "Queued"
    )
  );
  const disputedMilestones = sortQueue(
    allMilestones.filter(({ milestone }) => milestone.status === "Disputed")
  );
  const pendingDisbursements = sortQueue(
    allMilestones.filter(
      ({ milestone }) =>
        milestone.status === "Submitted" && milestone.adminReview === "Approved"
    )
  );

  function approve(projectId: string, milestoneId: string) {
    approveAgentProof(projectId, milestoneId);
    toast.success("Agent proof approved for client release");
  }

  function reject(projectId: string, milestoneId: string) {
    rejectAgentProof(projectId, milestoneId);
    toast.warning("Proof rejected and returned to agent");
  }

  return (
    <DashboardShell
      eyebrow="System admin"
      title="Operations command center"
      description="Monitor verification queues, dispute risk, simulated escrow health, and proof packets before clients release funds."
      icon={ServerCog}
    >
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="System Health"
          value="99.98%"
          detail="Portal, ledger, and evidence services"
          icon={ShieldCheck}
          tone="emerald"
        />
        <MetricCard
          label="Agent Queue"
          value={`${pendingVerifications.length}`}
          detail="Proof packets awaiting admin action"
          icon={ClipboardList}
          tone="sky"
        />
        <MetricCard
          label="Disputes"
          value={`${disputedMilestones.length}`}
          detail="Milestones under operations review"
          icon={AlertTriangle}
          tone={disputedMilestones.length ? "rose" : "neutral"}
        />
        <MetricCard
          label="Held Ledger"
          value={formatCurrency(simulatedLedger.held)}
          detail="Simulated escrow exposure"
          icon={WalletCards}
          tone="amber"
        />
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div>
          <p className="text-sm font-semibold">Queue sorting</p>
          <p className="mt-1 text-xs text-zinc-500">
            Applies to all operations tables below.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={sortMode === "due" ? "default" : "outline"}
            onClick={() => setSortMode("due")}
          >
            <ArrowDownUp className="size-4" />
            Due date
          </Button>
          <Button
            variant={sortMode === "budget" ? "default" : "outline"}
            onClick={() => setSortMode("budget")}
          >
            <ArrowDownUp className="size-4" />
            Budget
          </Button>
        </div>
      </div>

      <AdminTable
        title="Pending Agent Verifications"
        description="Agent proof packets that need admin approval before the diaspora client sees release controls."
        items={pendingVerifications}
        empty="No proof packets are waiting for admin review."
        renderActions={(item) => (
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              onClick={() => approve(item.project.id, item.milestone.id)}
            >
              <CheckCircle2 className="size-4" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => reject(item.project.id, item.milestone.id)}
            >
              <XCircle className="size-4" />
              Reject
            </Button>
          </div>
        )}
      />

      <AdminTable
        title="Disputed Milestones"
        description="Milestones flagged by the client or operations team for exception handling."
        items={disputedMilestones}
        empty="No disputed milestones in the current demo state."
        renderActions={() => (
          <Badge variant="destructive" className="rounded-full">
            Operations review
          </Badge>
        )}
      />

      <AdminTable
        title="Pending Fund Disbursements"
        description="Admin-approved proof packets awaiting diaspora client release."
        items={pendingDisbursements}
        empty="No milestones are currently waiting for client release."
        renderActions={() => (
          <Badge variant="secondary" className="rounded-full">
            Waiting on client
          </Badge>
        )}
      />
    </DashboardShell>
  );
}

type AdminTableProps = {
  title: string;
  description: string;
  items: QueueItem[];
  empty: string;
  renderActions: (item: QueueItem) => React.ReactNode;
};

function AdminTable({
  title,
  description,
  items,
  empty,
  renderActions,
}: AdminTableProps) {
  return (
    <Card className="border-zinc-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-zinc-500">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border border-zinc-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50">
                <TableHead>Project</TableHead>
                <TableHead>Milestone</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>State</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length ? (
                items.map((item) => (
                  <TableRow key={`${item.project.id}-${item.milestone.id}`}>
                    <TableCell className="font-medium">
                      {item.project.name}
                      <div className="mt-1 text-xs text-zinc-500">
                        {item.project.county} County
                      </div>
                    </TableCell>
                    <TableCell>{item.milestone.title}</TableCell>
                    <TableCell>
                      {formatCurrency(item.milestone.budget)}
                    </TableCell>
                    <TableCell>{formatDate(item.milestone.dueDate)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <StatusBadge status={item.milestone.status} />
                        <span className="text-xs text-zinc-500">
                          Admin: {item.milestone.adminReview}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {renderActions(item)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <span className="text-sm text-zinc-500">{empty}</span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
