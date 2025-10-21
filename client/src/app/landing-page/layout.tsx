import React from "react";
import { Navbar } from "@/components/navigation/Navbar";

interface LandingPageLayoutProps {
  children: React.ReactNode;
}

export default function LandingPageLayout({ children }: LandingPageLayoutProps) {
  return (
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
        <Navbar />
        {children}
      </div>
    </div>
  );
}

