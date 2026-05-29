import { AlertTriangle } from "lucide-react";

export function DemoBanner() {
  return (
    <div className="sticky top-0 z-40 border-b border-amber-200 bg-amber-50 px-4 py-2 text-amber-950 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 text-center text-xs font-medium sm:text-sm">
        <AlertTriangle className="size-4 shrink-0" />
        <span>
          ⚠️ DEMO MODE: Financial ledger and operations simulated. Production
          ready for Tier-1 Bank &amp; M-Pesa Escrow API integration.
        </span>
      </div>
    </div>
  );
}
