"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CustomSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOAuthSignIn = async (provider: "google" | "twitter") => {
    setIsLoading(true);
    setError("");
    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch (err: any) {
      setError("An error occurred during sign in.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-4">
      <Card className="w-full max-w-md bg-neutral-900 border-neutral-800">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-white">Welcome back</CardTitle>
          <CardDescription className="text-neutral-400">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Google Sign-In */}
          <Button
            variant="outline"
            className="w-full bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-white"
            onClick={() => handleOAuthSignIn("google")}
            disabled={isLoading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-neutral-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-neutral-900 px-2 text-neutral-500">Or continue with</span>
            </div>
          </div>

          {/* Twitter Sign-In */}
          <Button
            variant="outline"
            className="w-full bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-white"
            onClick={() => handleOAuthSignIn("twitter")}
            disabled={isLoading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.954 4.569c-.885.392-1.83.656-2.825.775a4.932 4.932 0 0 0 2.163-2.723 9.864 9.864 0 0 1-3.127 1.184A4.918 4.918 0 0 0 16.616 3c-2.723 0-4.932 2.209-4.932 4.932 0 .39.045.765.127 1.124C7.728 8.84 4.1 6.86 1.671 3.884a4.93 4.93 0 0 0-.666 2.475c0 1.708.869 3.216 2.188 4.099a4.92 4.92 0 0 1-2.229-.616v.06c0 2.385 1.693 4.374 3.946 4.827a4.935 4.935 0 0 1-2.224.084 4.934 4.934 0 0 0 4.604 3.417A9.875 9.875 0 0 1 .96 19.54a13.905 13.905 0 0 0 7.548 2.212c9.057 0 14.009-7.514 14.009-14.009 0-.213-.005-.425-.014-.636a10.012 10.012 0 0 0 2.451-2.548z" />
            </svg>
            Continue with Twitter
          </Button>

          {error && <div className="text-red-400 text-sm text-center">{error}</div>}
        </CardContent>
      </Card>
    </div>
  );
}
