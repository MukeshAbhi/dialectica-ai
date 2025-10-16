"use client";

import { useEffect } from "react";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-neutral-400 mb-4">Completing sign in...</p>
        <AuthenticateWithRedirectCallback />
      </div>
    </div>
  );
}
