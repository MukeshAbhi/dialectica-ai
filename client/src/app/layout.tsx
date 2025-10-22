import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import React from "react";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dialectica AI - Real-time Debate Platform",
  description:
    "Join structured debates in real-time. Create or join debate rooms and engage in meaningful discussions with other participants.",
  icons: {
    icon: "/logo.ico", // only one .ico file
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/logo.ico" />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <div className="min-h-screen bg-neutral-800 relative overflow-hidden">
            {/* Grid Pattern Background - lowest layer */}
            <div className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

            {/* Blurred glowing shapes - middle layer */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute top-1/2 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute bottom-0 right-1/3 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
            </div>

            {/* Main Content - top layer */}
            <div className="relative z-20">
              {children}
              <Toaster position="top-right" richColors />
            </div>
          </div>
        </body>
      </html>
    </SessionProvider>
  );
}
