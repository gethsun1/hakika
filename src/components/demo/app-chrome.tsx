"use client";

import { usePathname } from "next/navigation";

import { DemoBanner } from "@/components/demo/demo-banner";
import { RoleSwitcher } from "@/components/demo/role-switcher";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <>
      {!isLandingPage ? <DemoBanner /> : null}
      {children}
      {!isLandingPage ? <RoleSwitcher /> : null}
    </>
  );
}
