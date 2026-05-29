"use client";

import { useState } from "react";
import { CirclePlay } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ExplainerVideoDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          variant="outline"
          className="h-11 border-white/20 bg-white/10 text-white hover:bg-white/15"
        >
          <CirclePlay className="size-4" />
          Watch 1-Min Explainer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[min(62rem,calc(100vw-2rem))] border-white/10 bg-zinc-950 p-4 text-white sm:max-w-4xl">
        <DialogHeader className="pr-8">
          <DialogTitle>Hakika Explainer</DialogTitle>
          <DialogDescription className="text-zinc-400">
            A one-minute overview of milestone escrow, field verification, and
            audit-ready release workflows.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
          {open ? (
            <iframe
              src="https://app.heygen.com/embeds/ebfa96855e8c4c7498c125493945101d"
              title="HeyGen video player"
              className="aspect-video h-auto w-full"
              allow="encrypted-media; fullscreen;"
              allowFullScreen
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
