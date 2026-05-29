"use client";

import { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Camera,
  CheckCircle2,
  FileUp,
  MapPin,
  ReceiptText,
  Send,
} from "lucide-react";
import { toast } from "sonner";

import { DashboardShell } from "@/components/demo/dashboard-shell";
import { StatusBadge } from "@/components/demo/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useHakika } from "@/context/HakikaContext";
import { formatCurrency, formatDate } from "@/lib/hakika-format";
import { cn } from "@/lib/utils";

export default function AgentDashboardPage() {
  const { projects, submitAgentEvidence } = useHakika();
  const tasks = useMemo(
    () =>
      projects.flatMap((project) =>
        project.milestones
          .filter((milestone) => milestone.status !== "Released")
          .map((milestone) => ({ project, milestone }))
      ),
    [projects]
  );
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const selectedTask =
    tasks.find((task) => task.milestone.id === selectedTaskId) ?? tasks[0];
  const [receiptAmount, setReceiptAmount] = useState(248500);
  const [receiptText, setReceiptText] = useState(
    "Receipt KSM-4509: Fundi labor + materials delivery"
  );
  const [notes, setNotes] = useState(
    "Work completed on schedule. Photo shows site progress and delivery stack."
  );

  function handleSubmitProof() {
    if (!selectedTask) {
      return;
    }

    submitAgentEvidence(selectedTask.project.id, selectedTask.milestone.id, {
      receiptAmount,
      receiptText,
      notes,
    });
    toast.success("Proof package submitted to admin");
  }

  return (
    <DashboardShell
      eyebrow="Field agent"
      title="Task proof portal"
      description="A mobile-first operations surface for verified agents in Kenya to submit field evidence into the Hakika review pipeline."
      icon={BriefcaseBusiness}
    >
      <section className="grid gap-5 lg:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1fr)]">
        <Card className="border-zinc-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Assigned tasks</CardTitle>
            <p className="text-sm text-zinc-500">
              {tasks.length} active field checks across funded projects.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.map(({ project, milestone }) => {
              const selected = selectedTask?.milestone.id === milestone.id;

              return (
                <button
                  key={`${project.id}-${milestone.id}`}
                  type="button"
                  onClick={() => setSelectedTaskId(milestone.id)}
                  className={cn(
                    "w-full rounded-xl border p-4 text-left transition",
                    selected
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-zinc-200 bg-zinc-50 hover:bg-white"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">
                        {milestone.agentTask}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {project.name}
                      </p>
                    </div>
                    <StatusBadge status={milestone.status} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-500">
                    <span>{project.county} County</span>
                    <span>Due {formatDate(milestone.dueDate)}</span>
                    <span>{formatCurrency(milestone.budget)}</span>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-zinc-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Submit proof package</CardTitle>
            <p className="text-sm text-zinc-500">
              {selectedTask
                ? selectedTask.milestone.title
                : "Select a task to continue"}
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            {selectedTask ? (
              <>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                    <div className="flex items-center gap-2 text-xs font-medium uppercase text-zinc-500">
                      <MapPin className="size-3.5" />
                      Site
                    </div>
                    <p className="mt-2 text-sm font-medium">
                      {selectedTask.project.location}
                    </p>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                    <div className="flex items-center gap-2 text-xs font-medium uppercase text-zinc-500">
                      <ReceiptText className="size-3.5" />
                      Budget
                    </div>
                    <p className="mt-2 text-sm font-medium">
                      {formatCurrency(selectedTask.milestone.budget)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                    <div className="flex items-center gap-2 text-xs font-medium uppercase text-zinc-500">
                      <CheckCircle2 className="size-3.5" />
                      Review
                    </div>
                    <p className="mt-2 text-sm font-medium">
                      {selectedTask.milestone.adminReview}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center">
                  <Camera className="mx-auto size-10 text-zinc-400" />
                  <p className="mt-3 text-sm font-semibold">
                    Photo file picker mock
                  </p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    JPG or PNG evidence would be captured from the agent phone.
                  </p>
                  <Button variant="outline" className="mt-4">
                    <FileUp className="size-4" />
                    Choose site photo
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="receipt-amount">Receipt amount</Label>
                    <Input
                      id="receipt-amount"
                      type="number"
                      value={receiptAmount}
                      onChange={(event) =>
                        setReceiptAmount(Number(event.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Auto-generated location</Label>
                    <Input
                      id="location"
                      readOnly
                      value="-0.0919, 34.7684 - GPS locked"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="receipt-text">Receipt text</Label>
                    <Input
                      id="receipt-text"
                      value={receiptText}
                      onChange={(event) => setReceiptText(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">Field notes</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                    />
                  </div>
                </div>
                <Button
                  className="w-full sm:w-auto"
                  disabled={selectedTask.milestone.status === "Disputed"}
                  onClick={handleSubmitProof}
                >
                  <Send className="size-4" />
                  Submit Proof to Admin
                </Button>
              </>
            ) : null}
          </CardContent>
        </Card>
      </section>
    </DashboardShell>
  );
}
