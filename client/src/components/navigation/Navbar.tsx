"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // ✅ Close menu on route change (e.g. browser back/forward)
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // ✅ Scroll effect (safe)
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        setIsScrolled(window.scrollY > 20);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: session } = useSession();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/main", label: "App" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-neutral-900/90 backdrop-blur-lg border-b border-neutral-200 dark:border-neutral-700"
          : "bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm"
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-lg bg-blue-600">
              {/* <IconBrain className="h-6 w-6 text-white" /> */}
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Dialectica AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  pathname === link.href
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side - Auth buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => signOut()}
                className="border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-100"
              >
                Sign Out
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-100"
              >
                <Link href="/main/signin">Sign In</Link>
              </Button>
            )}
            <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/main">Get Started</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors duration-200"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? (
                <IconX className="h-6 w-6" />
              ) : (
                <IconMenu2 className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden border-t border-neutral-200 bg-white/95 backdrop-blur-lg"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    pathname === link.href
                      ? "text-blue-600 bg-blue-50"
                      : "text-neutral-700 hover:text-blue-600 hover:bg-neutral-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 pb-2 border-t border-neutral-200">
                <div className="flex flex-col space-y-2">
                  {session ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setIsMenuOpen(false);
                          signOut();
                        }}
                        className="justify-center border-neutral-300"
                      >
                        Sign Out
                      </Button>
                  ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="justify-center border-neutral-300"
                      >
                        <Link href="/main/signin">Sign In</Link>
                      </Button>
                  )}
                    <Button
                      size="sm"
                      asChild
                      className="justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Link href="/main">Get Started</Link>
                    </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
