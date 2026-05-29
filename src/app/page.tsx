import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Bot,
  ClipboardCheck,
  MapPinned,
  ShieldCheck,
} from "lucide-react";

import { ExplainerVideoDialog } from "@/components/demo/explainer-video-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const valueProps = [
  {
    title: "Escrow Milestones",
    description:
      "Every diaspora-funded project is broken into payable outcomes, not vague promises.",
    icon: Banknote,
  },
  {
    title: "On-Ground Verification",
    description:
      "Verified agents capture photos, receipts, geo-tags, and field notes before funds move.",
    icon: MapPinned,
  },
  {
    title: "AI Auditing",
    description:
      "Hakika summarizes evidence quality, flags variance, and creates a clean audit trail.",
    icon: Bot,
  },
];

const trustStats = [
  { label: "Simulated escrow flow", value: "KSh 1.73M" },
  { label: "Evidence cycle", value: "31h" },
  { label: "Release confidence", value: "96%" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#08110f] text-white">
      <section className="relative isolate min-h-[92vh] overflow-hidden">
        <Image
          src="/assets/hakika-hero.png"
          alt="Field agent verifying a diaspora-funded construction milestone"
          fill
          priority
          className="object-cover object-center opacity-72"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#08110f_0%,rgba(8,17,15,0.92)_34%,rgba(8,17,15,0.36)_72%,rgba(8,17,15,0.12)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(180deg,rgba(8,17,15,0)_0%,#08110f_100%)]" />
        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 backdrop-blur">
                <ShieldCheck className="size-5 text-emerald-200" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-normal">Hakika</p>
                <p className="text-xs text-white/55">Trust infrastructure</p>
              </div>
            </div>
            <Button
              asChild
              variant="outline"
              className="border-white/20 bg-white/10 text-white hover:bg-white/15"
            >
              <Link href="/auth">Open demo</Link>
            </Button>
          </header>
          <div className="grid flex-1 items-center gap-8 py-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(22rem,0.45fr)]">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-sm text-emerald-100 backdrop-blur">
                <BadgeCheck className="size-4" />
                Diaspora capital, verified outcomes
              </div>
              <h1 className="mt-7 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-normal sm:text-6xl lg:text-7xl">
                Remittance moves money. Hakika verifies outcomes.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
                A trust infrastructure layer closing the $4B trust gap in
                African diaspora project management with milestone escrow,
                field evidence, and audit-ready release controls.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-11 bg-emerald-300 text-emerald-950 hover:bg-emerald-200">
                  <Link href="/auth">
                    Launch Demo Dashboard
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <ExplainerVideoDialog />
              </div>
            </div>
            <div className="rounded-xl border border-white/15 bg-zinc-950/68 p-4 shadow-2xl shadow-black/40 backdrop-blur">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm font-medium">Live Verification Flow</p>
                  <p className="mt-1 text-xs text-white/50">
                    Diaspora escrow to field proof to release
                  </p>
                </div>
                <ClipboardCheck className="size-5 text-emerald-200" />
              </div>
              <div className="mt-4 space-y-3">
                {[
                  "Funds held against scoped outcome",
                  "Agent uploads receipt, image, and geo-tag",
                  "Admin approves proof quality",
                  "Client releases milestone capital",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.06] p-3"
                  >
                    <span className="flex size-7 items-center justify-center rounded-full bg-emerald-300/15 text-xs font-semibold text-emerald-100">
                      {index + 1}
                    </span>
                    <span className="text-sm text-white/76">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {trustStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-white/10 bg-white/[0.06] p-3"
                  >
                    <p className="text-lg font-semibold">{stat.value}</p>
                    <p className="mt-1 text-[0.68rem] leading-4 text-white/50">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        id="explainer"
        className="mx-auto grid max-w-7xl gap-4 px-4 pb-20 sm:px-6 md:grid-cols-3 lg:px-8"
      >
        {valueProps.map(({ title, description, icon: Icon }) => (
          <Card
            key={title}
            className="border-white/10 bg-white/[0.06] text-white shadow-xl shadow-black/10"
          >
            <CardContent className="p-5">
              <div className="mb-8 flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/10">
                <Icon className="size-5 text-emerald-200" />
              </div>
              <h2 className="text-lg font-semibold tracking-normal">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/62">
                {description}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
