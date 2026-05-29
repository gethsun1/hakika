"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Building2,
  CirclePlus,
  Layers3,
  MapPin,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import { DashboardShell } from "@/components/demo/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { NewMilestoneInput, Project } from "@/context/HakikaContext";
import { useHakika } from "@/context/HakikaContext";
import { formatCurrency } from "@/lib/hakika-format";

type DraftMilestone = NewMilestoneInput & {
  localId: string;
};

const counties = [
  "Kisumu",
  "Kajiado",
  "Nairobi",
  "Mombasa",
  "Uasin Gishu",
  "Kiambu",
  "Machakos",
  "Nakuru",
];

const categories: Project["category"][] = [
  "Construction",
  "Land Check",
  "School Fees",
  "Medical Support",
];

const wizardSteps: Array<{ label: string; icon: LucideIcon }> = [
  { label: "Project Details", icon: Building2 },
  { label: "Milestone Builder", icon: Layers3 },
  { label: "Escrow Allocation", icon: Banknote },
];

export default function CreateProjectPage() {
  const router = useRouter();
  const { createProject } = useHakika();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("Family Water Tank Installation");
  const [category, setCategory] =
    useState<Project["category"]>("Construction");
  const [location, setLocation] = useState("Nyamasaria, Kisumu");
  const [county, setCounty] = useState("Kisumu");
  const [sponsor, setSponsor] = useState("Wanjala A. - Dallas");
  const [milestones, setMilestones] = useState<DraftMilestone[]>([
    {
      localId: "draft-1",
      title: "Tank stand foundation",
      budget: 120000,
      targetOutcome:
        "Concrete base complete, cured, and ready for steel stand installation.",
    },
    {
      localId: "draft-2",
      title: "Tank purchase and delivery",
      budget: 180000,
      targetOutcome:
        "10,000L tank delivered with supplier receipt and site photo evidence.",
    },
  ]);

  const totalBudget = useMemo(
    () => milestones.reduce((sum, milestone) => sum + milestone.budget, 0),
    [milestones]
  );

  function updateMilestone(
    localId: string,
    patch: Partial<NewMilestoneInput>
  ) {
    setMilestones((current) =>
      current.map((milestone) =>
        milestone.localId === localId ? { ...milestone, ...patch } : milestone
      )
    );
  }

  function addMilestone() {
    setMilestones((current) => [
      ...current,
      {
        localId: `draft-${Date.now()}`,
        title: "New verification milestone",
        budget: 50000,
        targetOutcome: "Define the tangible proof needed before release.",
      },
    ]);
  }

  function removeMilestone(localId: string) {
    setMilestones((current) =>
      current.length > 1
        ? current.filter((milestone) => milestone.localId !== localId)
        : current
    );
  }

  function nextStep() {
    setStep((current) => Math.min(3, current + 1));
  }

  function previousStep() {
    setStep((current) => Math.max(1, current - 1));
  }

  function submitProject() {
    const project = createProject({
      name,
      category,
      location,
      county,
      sponsor,
      milestones: milestones.map(({ title, budget, targetOutcome }) => ({
        title,
        budget,
        targetOutcome,
      })),
    });

    toast.success("Project funded into simulated escrow");
    router.push(`/dashboard/diaspora/project/${project.id}`);
  }

  return (
    <DashboardShell
      eyebrow="Create project"
      title="New diaspora project request"
      description="Define a project, break the funding into verifiable outcomes, then allocate the simulated escrow ledger."
      icon={Layers3}
    >
      <section className="grid gap-5 lg:grid-cols-[16rem_1fr]">
        <Card className="border-zinc-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <Progress value={(step / 3) * 100} className="h-2" />
            <div className="mt-5 space-y-3">
              {wizardSteps.map(({ label, icon: StepIcon }, index) => {
                const itemStep = index + 1;
                const active = step === itemStep;

                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setStep(itemStep)}
                    className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition ${
                      active
                        ? "border-emerald-200 bg-emerald-50 text-emerald-950"
                        : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-white"
                    }`}
                  >
                    <StepIcon className="size-4" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>
              {step === 1
                ? "Project Details"
                : step === 2
                  ? "Milestone Builder"
                  : "Escrow Allocation"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 ? (
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="project-title">Project title</Label>
                  <Input
                    id="project-title"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={category}
                    onValueChange={(value) =>
                      setCategory(value as Project["category"])
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>County</Label>
                  <Select value={county} onValueChange={setCounty}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select county" />
                    </SelectTrigger>
                    <SelectContent>
                      {counties.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location">Location or site description</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="sponsor">Diaspora sponsor</Label>
                  <Input
                    id="sponsor"
                    value={sponsor}
                    onChange={(event) => setSponsor(event.target.value)}
                  />
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div
                    key={milestone.localId}
                    className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs text-zinc-500">
                          Milestone {index + 1}
                        </p>
                        <p className="text-sm font-semibold">
                          {formatCurrency(milestone.budget)}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        title="Remove milestone"
                        onClick={() => removeMilestone(milestone.localId)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-[1fr_12rem]">
                      <div className="space-y-2">
                        <Label>Milestone name</Label>
                        <Input
                          value={milestone.title}
                          onChange={(event) =>
                            updateMilestone(milestone.localId, {
                              title: event.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Budget</Label>
                        <Input
                          type="number"
                          value={milestone.budget}
                          min={0}
                          onChange={(event) =>
                            updateMilestone(milestone.localId, {
                              budget: Number(event.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Target outcome</Label>
                        <Textarea
                          value={milestone.targetOutcome}
                          onChange={(event) =>
                            updateMilestone(milestone.localId, {
                              targetOutcome: event.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addMilestone}>
                  <CirclePlus className="size-4" />
                  Add milestone
                </Button>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-800">
                      <MapPin className="size-4" />
                    </div>
                    <div>
                      <h2 className="font-semibold">{name}</h2>
                      <p className="mt-1 text-sm text-zinc-600">
                        {category} • {location}, {county}
                      </p>
                    </div>
                  </div>
                  <Separator className="my-5" />
                  <div className="space-y-3">
                    {milestones.map((milestone, index) => (
                      <div
                        key={milestone.localId}
                        className="flex items-start justify-between gap-4 rounded-lg bg-white p-3"
                      >
                        <div>
                          <p className="text-xs text-zinc-500">
                            Milestone {index + 1}
                          </p>
                          <p className="text-sm font-medium">
                            {milestone.title}
                          </p>
                        </div>
                        <p className="text-sm font-semibold">
                          {formatCurrency(milestone.budget)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
                  <p className="text-xs font-medium uppercase">
                    Simulated ledger allocation
                  </p>
                  <p className="mt-3 text-3xl font-semibold">
                    {formatCurrency(totalBudget)}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-emerald-900/80">
                    This capital will be deposited and held in the demo escrow
                    bucket until milestone evidence clears review.
                  </p>
                </div>
              </div>
            ) : null}

            <div className="flex flex-col-reverse gap-2 border-t border-zinc-100 pt-5 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={step === 1 ? () => router.push("/dashboard/diaspora") : previousStep}
              >
                <ArrowLeft className="size-4" />
                {step === 1 ? "Back to dashboard" : "Previous"}
              </Button>
              {step < 3 ? (
                <Button type="button" onClick={nextStep}>
                  Continue
                  <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button type="button" onClick={submitProject}>
                  Fund Simulated Escrow
                  <Banknote className="size-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </DashboardShell>
  );
}
