import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppChrome } from "@/components/demo/app-chrome";
import { Providers } from "@/components/demo/providers";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hakika | Outcome Verification for Diaspora Capital",
  description:
    "Interactive demo for diaspora-funded project escrow, verification, and impact reporting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <AppChrome>{children}</AppChrome>
          <Toaster richColors closeButton position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
