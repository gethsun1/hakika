"use client";

import { Download, FileCheck2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Project } from "@/context/HakikaContext";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
} from "@/lib/hakika-format";

type AuditReportDialogProps = {
  project: Project;
};

export function AuditReportDialog({ project }: AuditReportDialogProps) {
  const released = project.milestones
    .filter((milestone) => milestone.status === "Released")
    .reduce((sum, milestone) => sum + milestone.budget, 0);
  const held = project.totalBudget - released;

  function handlePrintSimulation() {
    toast.success("Verified audit report prepared for browser print export");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="size-4" />
          Export Verified Audit Report
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCheck2 className="size-5 text-emerald-700" />
            Verified Audit Report
          </DialogTitle>
          <DialogDescription>
            Print-friendly simulated PDF export for project ledger,
            verification history, and evidence timestamps.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 text-zinc-950">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                <ShieldCheck className="size-4" />
                Hakika Verification Ledger
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-normal">
                {project.name}
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                {project.location} • {project.sponsor}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-right text-xs text-zinc-500">
              <p>Report ID</p>
              <p className="font-mono text-zinc-900">
                HK-{project.id.toUpperCase().slice(0, 12)}
              </p>
              <p className="mt-2">Generated 29 May 2026</p>
            </div>
          </div>
          <Separator className="my-5" />
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-zinc-200 p-3">
              <p className="text-xs text-zinc-500">Deposited</p>
              <p className="mt-1 text-lg font-semibold">
                {formatCurrency(project.totalBudget)}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 p-3">
              <p className="text-xs text-zinc-500">Released</p>
              <p className="mt-1 text-lg font-semibold">
                {formatCurrency(released)}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 p-3">
              <p className="text-xs text-zinc-500">Held or disputed</p>
              <p className="mt-1 text-lg font-semibold">
                {formatCurrency(held)}
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {project.milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className="rounded-lg border border-zinc-200 p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase text-zinc-500">
                      Milestone {index + 1}
                    </p>
                    <h3 className="text-sm font-semibold">
                      {milestone.title}
                    </h3>
                  </div>
                  <div className="text-sm font-semibold">
                    {formatCurrency(milestone.budget)}
                  </div>
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {milestone.targetOutcome}
                </p>
                <div className="mt-3 grid gap-2 text-xs text-zinc-500 sm:grid-cols-3">
                  <p>Status: {milestone.status}</p>
                  <p>Admin: {milestone.adminReview}</p>
                  <p>Due: {formatDate(milestone.dueDate)}</p>
                </div>
                {milestone.evidence ? (
                  <div className="mt-3 rounded-lg bg-zinc-50 p-3 text-xs leading-5 text-zinc-600">
                    <p>Receipt: {milestone.evidence.receiptText}</p>
                    <p>
                      Timestamp: {formatDateTime(milestone.evidence.timestamp)}
                    </p>
                    <p>Geo-tag: {milestone.evidence.geoTag}</p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <Button className="mt-5 w-full" onClick={handlePrintSimulation}>
            <Download className="size-4" />
            Simulate Browser PDF Export
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
