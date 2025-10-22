"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function getInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("dialectica_theme");
  if (stored === "light" || stored === "dark") return stored;
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  
  // Debug logging to help identify session issues
  console.log("Settings Page - Session Status:", status);
  console.log("Settings Page - Session Data:", session);

  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("dialectica_sound_enabled");
    return stored ? stored === "true" : true;
  });

  useEffect(() => {
    // Store theme preference but don't apply it (visual only for MVP)
    localStorage.setItem("dialectica_theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("dialectica_sound_enabled", String(soundEnabled));
  }, [soundEnabled]);

  const handleRequestNotificationPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    try {
      if (Notification.permission === "default") {
        await Notification.requestPermission();
      }
    } catch (e) {
      // noop for MVP
    }
  };

  if (status === "loading") {
    return (
      <div className="flex-1 min-h-screen bg-gray-100 dark:bg-neutral-900 flex items-center justify-center p-6">
        <p className="text-neutral-600 dark:text-neutral-300">Loading settings…</p>
      </div>
    );
  }


  return (
    <div className="flex-1 min-h-screen bg-gray-100 dark:bg-neutral-900 flex items-center justify-center p-6 overflow-y-auto">
      <div className="w-full max-w-6xl">
        <Card className="bg-white dark:bg-neutral-800 shadow-lg w-full border-0">
          <CardHeader>
            <CardTitle className="text-xl text-neutral-900 dark:text-white">Settings</CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-300">Manage your account and preferences</CardDescription>
          </CardHeader>

          <div className="px-6 pb-6 space-y-8">
            {/* Account */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-neutral-900 dark:text-white">Account</h2>
              {status === "unauthenticated" ? (
                <div className="text-center py-8">
                  <div className="mb-4">
                    <div className="h-12 w-12 rounded-full bg-neutral-600 flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-sm font-medium">?</span>
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">
                      Sign In Required
                    </h3>
                    <p className="text-white mb-4">
                      Please sign in to view your account details and manage your profile.
                    </p>
                  </div>
                  <Button
                    onClick={() => window.location.href = "/signin"}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Go to Sign In
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    {session?.user?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={session.user.image} 
                        alt={`${session.user.name || 'User'} avatar`} 
                        className="h-12 w-12 rounded-full object-cover" 
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {session?.user?.name?.charAt(0)?.toUpperCase() || session?.user?.email?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {session?.user?.name || session?.user?.email?.split('@')[0] || "User"}
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300">
                        {session?.user?.email || "No email available"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300">Connected providers</p>
                      <div className="mt-1 text-sm text-neutral-900 dark:text-white">
                        {session?.user?.email ? (
                          <div className="flex gap-2">
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">
                              Google
                            </span>
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                              Twitter
                            </span>
                          </div>
                        ) : (
                          "No providers connected"
                        )}
                      </div>
                    </div>
                    <Button variant="destructive" onClick={() => signOut()}>Sign out</Button>
                  </div>
                </>
              )}
            </section>

            <Separator />

            {/* Appearance */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-neutral-900 dark:text-white">Appearance</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">Theme</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    Light or Dark (preference saved, not applied)
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "secondary"}
                    onClick={() => setTheme("light")}
                  >
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "secondary"}
                    onClick={() => setTheme("dark")}
                  >
                    Dark
                  </Button>
                </div>
              </div>
            </section>

            <Separator />

            {/* Notifications */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-neutral-900 dark:text-white">Notifications</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">Sound notifications</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">Play a sound for new messages</p>
                </div>
                <Button
                  variant={soundEnabled ? "default" : "secondary"}
                  onClick={() => setSoundEnabled((v) => !v)}
                >
                  {soundEnabled ? "On" : "Off"}
                </Button>
              </div>

              {typeof window !== "undefined" && "Notification" in window && (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">Desktop notifications</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">
                      {typeof window !== "undefined" ? `Permission: ${Notification.permission}` : ""}
                    </p>
                  </div>
                  <Button onClick={handleRequestNotificationPermission}>Enable</Button>
                </div>
              )}
            </section>

            <Separator />

            {/* Privacy */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-neutral-900 dark:text-white">Privacy</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">Request account deletion</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">Opens a placeholder flow (MVP)</p>
                </div>
                <Button variant="secondary" onClick={() => alert("Account deletion request flow coming soon.")}>Request</Button>
              </div>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}


