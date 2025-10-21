import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import React from "react";
import SideBar from "@/components/navigation/SideBar";

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
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-screen mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden h-screen`}
        >
          <SideBar />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
