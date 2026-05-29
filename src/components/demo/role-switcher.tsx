"use client";

import { useRouter } from "next/navigation";
import { Banknote, BriefcaseBusiness, Globe2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import type { UserRole } from "@/context/HakikaContext";
import { useHakika } from "@/context/HakikaContext";
import { roleLabels } from "@/lib/hakika-format";
import { cn } from "@/lib/utils";

const roleConfig: Array<{
  role: UserRole;
  href: string;
  icon: typeof Globe2;
}> = [
  { role: "diaspora", href: "/dashboard/diaspora", icon: Globe2 },
  { role: "agent", href: "/dashboard/agent", icon: BriefcaseBusiness },
  { role: "admin", href: "/dashboard/admin", icon: ShieldCheck },
  { role: "investor", href: "/dashboard/investor", icon: Banknote },
];

export function RoleSwitcher() {
  const router = useRouter();
  const { currentUserRole, setCurrentUserRole } = useHakika();

  function handleRoleChange(role: UserRole, href: string) {
    setCurrentUserRole(role);
    toast.info(`Switched to ${roleLabels[role]} view`);
    router.push(href);
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 w-[min(23rem,calc(100vw-2rem))] rounded-xl border border-white/15 bg-zinc-950/92 p-2 text-white shadow-2xl shadow-black/30 backdrop-blur">
      <div className="mb-2 flex items-center justify-between px-2">
        <span className="text-xs font-medium uppercase text-zinc-400">
          Demo role
        </span>
        <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-xs text-emerald-200">
          {roleLabels[currentUserRole]}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {roleConfig.map(({ role, href, icon: Icon }) => {
          const active = role === currentUserRole;

          return (
            <button
              key={role}
              type="button"
              title={roleLabels[role]}
              onClick={() => handleRoleChange(role, href)}
              className={cn(
                "flex h-14 flex-col items-center justify-center gap-1 rounded-lg border text-[0.68rem] font-medium transition",
                active
                  ? "border-emerald-300/50 bg-emerald-300/15 text-emerald-100"
                  : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
              )}
            >
              <Icon className="size-4" />
              <span className="max-w-full truncate px-1">
                {roleLabels[role].replace("System ", "")}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
