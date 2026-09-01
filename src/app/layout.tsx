import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalHeader from "./components/GlobalHeader";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Plataforma de Asistencia Clínica - Parkinson",
  description:
    "Plataforma de asistencia clínica para valoración e intervención fisioterapéutica en enfermedad de Parkinson.",
  applicationName: "pwa-parkinson-rehab",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Plataforma de Asistencia Clínica - Parkinson",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#991b1b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <GlobalHeader />
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
