"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  CheckCircle2,
  FileText,
  ImageIcon,
  MapPin,
  MessageSquareText,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Timer,
} from "lucide-react";
import { toast } from "sonner";

import { AuditReportDialog } from "@/components/demo/audit-report-dialog";
import { DashboardShell } from "@/components/demo/dashboard-shell";
import { StatusBadge } from "@/components/demo/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useHakika } from "@/context/HakikaContext";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
} from "@/lib/hakika-format";
import { cn } from "@/lib/utils";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const {
    getProjectById,
    approveMilestoneRelease,
    raiseDisputeFlag,
    simulatedLedger,
  } = useHakika();
  const project = getProjectById(params.id);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(
    null
  );

  const selectedMilestone = useMemo(() => {
    if (!project) {
      return undefined;
    }

    return (
      project.milestones.find(
        (milestone) => milestone.id === selectedMilestoneId
      ) ??
      project.milestones.find((milestone) => milestone.status === "Submitted") ??
      project.milestones[0]
    );
  }, [project, selectedMilestoneId]);

  if (!project || !selectedMilestone) {
    return (
      <main className="min-h-screen bg-zinc-50 p-6">
        <Card className="mx-auto max-w-xl border-zinc-200 bg-white">
          <CardContent className="p-6">
            <h1 className="text-xl font-semibold">Project not found</h1>
            <p className="mt-2 text-sm text-zinc-600">
              The selected demo project is not available in memory.
            </p>
            <Button asChild className="mt-5">
              <Link href="/dashboard/diaspora">
                <ArrowLeft className="size-4" />
                Back to dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const currentProject = project;
  const currentMilestone = selectedMilestone;
  const releasedAmount = project.milestones
    .filter((milestone) => milestone.status === "Released")
    .reduce((sum, milestone) => sum + milestone.budget, 0);
  const canRelease =
    selectedMilestone.status === "Submitted" &&
    selectedMilestone.adminReview === "Approved";
  const canDispute =
    selectedMilestone.status !== "Released" &&
    selectedMilestone.status !== "Disputed";

  function handleApprove() {
    approveMilestoneRelease(currentProject.id, currentMilestone.id);
    toast.success("Milestone released and ledger updated");
  }

  function handleDispute() {
    raiseDisputeFlag(currentProject.id, currentMilestone.id);
    toast.warning("Dispute flag raised for admin review");
  }

  return (
    <DashboardShell
      eyebrow="Project detail"
      title={project.name}
      description={`${project.location} • ${project.sponsor} • ${project.currentStage}`}
      icon={ShieldCheck}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild variant="outline">
          <Link href="/dashboard/diaspora">
            <ArrowLeft className="size-4" />
            Back to projects
          </Link>
        </Button>
        <AuditReportDialog project={project} />
      </div>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="grid gap-5 lg:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1fr)]">
          <Card className="border-zinc-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Milestone track</CardTitle>
              <p className="text-sm text-zinc-500">
                {formatCurrency(releasedAmount)} released of{" "}
                {formatCurrency(project.totalBudget)}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {project.milestones.map((milestone, index) => {
                const selected = milestone.id === selectedMilestone.id;

                return (
                  <button
                    key={milestone.id}
                    type="button"
                    onClick={() => setSelectedMilestoneId(milestone.id)}
                    className={cn(
                      "flex w-full gap-3 rounded-xl border p-3 text-left transition",
                      selected
                        ? "border-emerald-300 bg-emerald-50"
                        : "border-zinc-200 bg-zinc-50 hover:bg-white"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                        milestone.status === "Released"
                          ? "border-emerald-300 bg-emerald-100 text-emerald-800"
                          : "border-zinc-200 bg-white text-zinc-600"
                      )}
                    >
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{milestone.title}</span>
                        <StatusBadge status={milestone.status} />
                      </span>
                      <span className="mt-2 block text-sm leading-6 text-zinc-600">
                        {milestone.targetOutcome}
                      </span>
                      <span className="mt-2 block text-xs text-zinc-500">
                        Due {formatDate(milestone.dueDate)} •{" "}
                        {formatCurrency(milestone.budget)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-zinc-200 bg-white shadow-sm">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>Evidence wall</CardTitle>
                <p className="mt-1 text-sm text-zinc-500">
                  {selectedMilestone.title}
                </p>
              </div>
              <StatusBadge status={selectedMilestone.status} />
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedMilestone.evidence ? (
                <>
                  <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
                    <Image
                      src={selectedMilestone.evidence.photoUrl}
                      alt={`${selectedMilestone.title} evidence`}
                      width={1200}
                      height={768}
                      priority
                      className="h-64 w-full object-cover"
                    />
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <EvidenceItem
                      icon={ReceiptText}
                      label="Receipt"
                      value={selectedMilestone.evidence.receiptText}
                    />
                    <EvidenceItem
                      icon={MapPin}
                      label="Geo-tag"
                      value={selectedMilestone.evidence.geoTag}
                    />
                    <EvidenceItem
                      icon={Timer}
                      label="Timestamp"
                      value={formatDateTime(
                        selectedMilestone.evidence.timestamp
                      )}
                    />
                    <EvidenceItem
                      icon={FileText}
                      label="Receipt amount"
                      value={formatCurrency(
                        selectedMilestone.evidence.receiptAmount
                      )}
                    />
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                    <p className="text-xs font-medium uppercase text-zinc-500">
                      Field notes
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      {selectedMilestone.evidence.notes}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
                  <ImageIcon className="size-10 text-zinc-400" />
                  <h2 className="mt-4 text-base font-semibold">
                    Evidence not submitted yet
                  </h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                    The assigned field agent must upload a proof package before
                    this milestone can be released.
                  </p>
                </div>
              )}
              <Separator />
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button disabled={!canRelease} onClick={handleApprove}>
                  <CheckCircle2 className="size-4" />
                  Approve Milestone Release
                </Button>
                <Button
                  disabled={!canDispute}
                  variant="destructive"
                  onClick={handleDispute}
                >
                  <AlertTriangle className="size-4" />
                  Raise Dispute Flag
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="border-zinc-200 bg-zinc-950 text-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="size-5 text-emerald-200" />
                Hakika AI Verification Assistant
              </CardTitle>
              <p className="text-sm leading-6 text-white/55">
                Simulated validation report for the selected milestone.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <AssistantBubble
                icon={Sparkles}
                title="Evidence confidence"
                lines={[
                  selectedMilestone.evidence
                    ? "Photo, receipt text, GPS, and timestamp are present."
                    : "No proof package detected for this milestone.",
                  `Admin review state: ${selectedMilestone.adminReview}.`,
                ]}
              />
              <AssistantBubble
                icon={MessageSquareText}
                title="Budget variance"
                lines={[
                  selectedMilestone.evidence
                    ? `${formatCurrency(
                        selectedMilestone.budget -
                          selectedMilestone.evidence.receiptAmount
                      )} variance against milestone budget.`
                    : "Variance check pending receipt upload.",
                  `Ledger held balance: ${formatCurrency(simulatedLedger.held)}.`,
                ]}
              />
              <AssistantBubble
                icon={ShieldCheck}
                title="Recommended next step"
                lines={[
                  canRelease
                    ? "Approve release if the sponsor accepts the submitted work quality."
                    : selectedMilestone.status === "Held"
                      ? "Wait for field proof before releasing capital."
                      : "Monitor admin queue and dispute flags.",
                ]}
              />
            </CardContent>
          </Card>
        </aside>
      </section>
    </DashboardShell>
  );
}

type EvidenceItemProps = {
  icon: typeof ReceiptText;
  label: string;
  value: string;
};

function EvidenceItem({ icon: Icon, label, value }: EvidenceItemProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      <div className="flex items-center gap-2 text-xs font-medium uppercase text-zinc-500">
        <Icon className="size-3.5" />
        {label}
      </div>
      <p className="mt-2 text-sm leading-6 text-zinc-800">{value}</p>
    </div>
  );
}

type AssistantBubbleProps = {
  icon: typeof Sparkles;
  title: string;
  lines: string[];
};

function AssistantBubble({ icon: Icon, title, lines }: AssistantBubbleProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="size-4 text-emerald-200" />
        {title}
      </div>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-white/68">
        {lines.map((line) => (
          <li key={line} className="flex gap-2">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-200" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
