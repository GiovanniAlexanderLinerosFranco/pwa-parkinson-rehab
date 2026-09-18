import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { brand } from "@/lib/brand";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${brand.name} — ${brand.taglineEs}`,
  description: brand.taglineEs,
  applicationName: brand.name,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: brand.name,
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/icon-balanx.jpeg",
    apple: "/icon-balanx.jpeg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B132B",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col bg-[var(--balanx-bg)] text-[var(--balanx-ink)]">
        {children}
      </body>
    </html>
  );
}
