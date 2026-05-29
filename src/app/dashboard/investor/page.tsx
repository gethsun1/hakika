"use client";

import { useMemo, useState } from "react";
import {
  Banknote,
  BriefcaseBusiness,
  Clock3,
  Globe2,
  MapPinned,
  TrendingUp,
} from "lucide-react";

import { DashboardShell } from "@/components/demo/dashboard-shell";
import { MetricCard } from "@/components/demo/metric-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useHakika } from "@/context/HakikaContext";
import { formatCompactCurrency, formatCurrency } from "@/lib/hakika-format";
import { cn } from "@/lib/utils";

const countyPositions = [
  { county: "Kisumu", x: "32%", y: "48%", agents: 4, cycle: "28h" },
  { county: "Kajiado", x: "56%", y: "66%", agents: 3, cycle: "34h" },
  { county: "Uasin Gishu", x: "42%", y: "30%", agents: 2, cycle: "26h" },
  { county: "Nairobi", x: "60%", y: "50%", agents: 6, cycle: "19h" },
  { county: "Mombasa", x: "78%", y: "78%", agents: 3, cycle: "37h" },
];

export default function InvestorDashboardPage() {
  const { projects, simulatedLedger } = useHakika();
  const [selectedCounty, setSelectedCounty] = useState("Kisumu");

  const countyStats = useMemo(
    () =>
      countyPositions.map((county) => {
        const countyProjects = projects.filter(
          (project) => project.county === county.county
        );
        const volume = countyProjects.reduce(
          (sum, project) => sum + project.totalBudget,
          0
        );
        const released = countyProjects.reduce(
          (sum, project) =>
            sum +
            project.milestones
              .filter((milestone) => milestone.status === "Released")
              .reduce((inner, milestone) => inner + milestone.budget, 0),
          0
        );

        return { ...county, projects: countyProjects.length, volume, released };
      }),
    [projects]
  );

  const selected =
    countyStats.find((county) => county.county === selectedCounty) ??
    countyStats[0];
  const tvv = simulatedLedger.deposited;
  const releaseRatio = Math.round(
    (simulatedLedger.released / Math.max(1, simulatedLedger.deposited)) * 100
  );

  return (
    <DashboardShell
      eyebrow="Investor impact"
      title="Verified volume and market traction"
      description="A board-ready view of verified diaspora project volume, agent capacity, cycle times, platform revenue, and county-level impact density."
      icon={TrendingUp}
    >
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Volume Verified"
          value={formatCompactCurrency(tvv)}
          detail="Deposited through simulated escrow"
          icon={Banknote}
          tone="emerald"
        />
        <MetricCard
          label="Active Agents Employed"
          value="18"
          detail="Across five Kenyan operating zones"
          icon={BriefcaseBusiness}
          tone="sky"
        />
        <MetricCard
          label="Avg Verification Cycle"
          value="31h"
          detail="Agent upload to client release-ready"
          icon={Clock3}
        />
        <MetricCard
          label="Platform Revenue"
          value={formatCompactCurrency(simulatedLedger.platformFees)}
          detail="Collected on released milestones"
          icon={Globe2}
          tone="amber"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <Card className="border-zinc-200 bg-white shadow-sm">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Impact Map by Kenyan Counties</CardTitle>
              <p className="mt-1 text-sm text-zinc-500">
                Select a county to inspect volume concentration and field
                capacity.
              </p>
            </div>
            <Badge variant="secondary" className="w-fit rounded-full">
              Interactive demo map
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="relative min-h-[28rem] overflow-hidden rounded-xl border border-zinc-200 bg-[linear-gradient(145deg,#e7f2ec,#f7f5ed_52%,#e8eef5)] p-5">
              <div className="absolute inset-6 rounded-[2rem] border border-emerald-900/10 bg-white/30" />
              <div className="absolute left-[28%] top-[16%] h-[70%] w-[48%] rounded-[48%_52%_45%_55%] border border-zinc-400/30 bg-white/45 shadow-inner" />
              <div className="absolute left-[42%] top-[32%] h-[44%] w-[30%] rotate-12 rounded-[52%_48%_58%_42%] border border-amber-700/20 bg-amber-100/45" />
              {countyStats.map((county) => {
                const active = county.county === selected.county;

                return (
                  <button
                    key={county.county}
                    type="button"
                    onClick={() => setSelectedCounty(county.county)}
                    className={cn(
                      "absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm transition",
                      active
                        ? "border-emerald-700 bg-emerald-700 text-white"
                        : "border-white bg-white/90 text-zinc-700 hover:bg-emerald-50"
                    )}
                    style={{ left: county.x, top: county.y }}
                  >
                    {county.county}
                  </button>
                );
              })}
              <div className="absolute bottom-5 left-5 z-10 rounded-xl border border-white/70 bg-white/82 p-4 shadow-sm backdrop-blur">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <MapPinned className="size-4 text-emerald-700" />
                  {selected.county} County
                </div>
                <p className="mt-2 text-xs leading-5 text-zinc-600">
                  {selected.projects} active project
                  {selected.projects === 1 ? "" : "s"} • {selected.agents}{" "}
                  agents • {selected.cycle} cycle time
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 bg-zinc-950 text-white shadow-sm">
          <CardHeader>
            <CardTitle>{selected.county} impact profile</CardTitle>
            <p className="text-sm text-white/55">
              County-level traction summary.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="text-xs uppercase text-white/45">
                Verified volume
              </p>
              <p className="mt-2 text-3xl font-semibold">
                {formatCurrency(selected.volume)}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/62">Released volume</span>
                <span>{formatCurrency(selected.released)}</span>
              </div>
              <Progress
                value={
                  selected.volume
                    ? Math.round((selected.released / selected.volume) * 100)
                    : 0
                }
                className="mt-2 h-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.06] p-3">
                <p className="text-xs text-white/45">Projects</p>
                <p className="mt-2 text-xl font-semibold">
                  {selected.projects}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.06] p-3">
                <p className="text-xs text-white/45">Agents</p>
                <p className="mt-2 text-xl font-semibold">{selected.agents}</p>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
              <p className="text-sm font-medium">Portfolio release ratio</p>
              <p className="mt-2 text-sm leading-6 text-white/62">
                {releaseRatio}% of deposited simulated escrow has cleared
                verified milestone release.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </DashboardShell>
  );
}
