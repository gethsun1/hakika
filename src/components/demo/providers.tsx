"use client";

import { ThemeProvider } from "next-themes";

import { HakikaProvider } from "@/context/HakikaContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <HakikaProvider>{children}</HakikaProvider>
    </ThemeProvider>
  );
}
