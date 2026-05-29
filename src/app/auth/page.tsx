"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  Globe2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { UserRole } from "@/context/HakikaContext";
import { useHakika } from "@/context/HakikaContext";

const authOptions: Array<{
  role: UserRole;
  href: string;
  title: string;
  description: string;
  icon: typeof Globe2;
}> = [
  {
    role: "diaspora",
    href: "/dashboard/diaspora",
    title: "Diaspora Client",
    description:
      "Fund projects, inspect submitted evidence, approve releases, and raise disputes.",
    icon: Globe2,
  },
  {
    role: "agent",
    href: "/dashboard/agent",
    title: "Verified Field Agent",
    description:
      "Review assigned tasks, capture receipts, add notes, and submit proof packages.",
    icon: BriefcaseBusiness,
  },
  {
    role: "admin",
    href: "/dashboard/admin",
    title: "Portal Admin",
    description:
      "Triage verification queues, approve proof quality, and watch fund disbursement risk.",
    icon: ShieldCheck,
  },
];

export default function AuthPage() {
  const router = useRouter();
  const { setCurrentUserRole } = useHakika();

  function enterPortal(role: UserRole, href: string, label: string) {
    setCurrentUserRole(role);
    toast.success(`${label} session started`);
    router.push(href);
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8faf9,#edf2ef)] pb-28 text-zinc-950">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-6xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800">
            <ShieldCheck className="size-6" />
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-normal sm:text-4xl">
            Choose a simulated portal
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Each role uses the same shared in-memory ledger, so actions taken in
            one dashboard are immediately visible in the others.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {authOptions.map(({ role, href, title, description, icon: Icon }) => (
            <Card key={role} className="border-zinc-200 bg-white shadow-sm">
              <CardContent className="flex h-full flex-col p-5">
                <div className="flex size-11 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-800">
                  <Icon className="size-5" />
                </div>
                <h2 className="mt-5 text-lg font-semibold">{title}</h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-zinc-600">
                  {description}
                </p>
                <Button
                  className="mt-6 w-full"
                  onClick={() => enterPortal(role, href, title)}
                >
                  Enter {title}
                  <ArrowRight className="size-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
