// src/app/layout.tsx is anything that's common across all pages, like a nav bar and footer

"use client";

import React, { useState } from "react";
import "./globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import Providers from "./providers";
import { UserListsProvider } from "./UserListsContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground min-h-screen">
        <Providers>
          <UserListsProvider>
            {/* Navigation Bar */}
            <nav
              className="bg-blue-600 text-white shadow-lg border-b-2 border-blue-500"
              style={{ backgroundColor: "#3b82f6" }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    <Link
                      href="/"
                      className="text-2xl font-bold text-white hover:text-blue-200"
                      style={{ color: "#ffffff" }}
                    >
                      Anirank
                    </Link>
                  </div>

                  {/* Search Bar */}
                  <div className="hidden md:flex flex-1 max-w-2xl mx-4">
                    <SearchBar />
                  </div>

                  {/* Navigation Links */}
                  <div className="hidden md:flex items-center space-x-4">
                    <div className="flex items-baseline space-x-4">
                      <Link
                        href="/"
                        className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors text-white"
                        style={{ color: "#ffffff" }}
                      >
                        Home
                      </Link>
                      <Link
                        href="/anime"
                        className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors text-white"
                        style={{ color: "#ffffff" }}
                      >
                        Anime
                      </Link>
                      <Link
                        href="/reviews"
                        className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors text-white"
                        style={{ color: "#ffffff" }}
                      >
                        Reviews
                      </Link>
                      <Link
                        href="/search"
                        className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors text-white"
                        style={{ color: "#ffffff" }}
                      >
                        Search
                      </Link>
                    </div>

                    {/* Profile Icon */}
                    <div className="ml-4 relative">
                      <Link
                        href="/profile"
                        className="flex items-center justify-center w-8 h-8 bg-blue-700 rounded-full hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-blue-600"
                      >
                        <svg
                          className="w-5 h-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="8" r="4" />
                          <path d="M4 19c0-3.5 4-5.5 8-5.5s8 2 8 5.5v1H4z" />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  {/* Mobile menu button */}
                  <div className="md:hidden">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-blue-700"
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M3 6h18M3 12h18M3 18h18" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Mobile menu */}
              {isMobileMenuOpen && (
                <div className="md:hidden border-t border-blue-500">
                  <div className="px-2 pt-2 pb-3 space-y-1">
                    {/* Mobile Search */}
                    <div className="px-3 py-2">
                      <SearchBar />
                    </div>
                    <Link
                      href="/"
                      className="hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Home
                    </Link>
                    <Link
                      href="/anime"
                      className="hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Anime
                    </Link>
                    <Link
                      href="/reviews"
                      className="hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Reviews
                    </Link>
                    <Link
                      href="/search"
                      className="hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Search
                    </Link>

                    {/* Mobile Profile */}
                    <div className="border-t border-blue-500 pt-3 mt-3">
                      <Link
                        href="/profile"
                        className="flex items-center w-full px-3 py-2 text-base font-medium text-white hover:bg-blue-700 rounded-md transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-700 rounded-full mr-3">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 19c0-3.5 4-5.5 8-5.5s8 2 8 5.5v1H4z" />
                          </svg>
                        </div>
                        Profile
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </nav>

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer
              className="border-t-4"
              style={{
                background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1d4ed8 100%)",
                borderColor: "#60a5fa",
              }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Brand Section */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Anirank</h3>
                    <p className="text-blue-100 mb-4">
                      Your ultimate destination for anime discovery, reviews, and ratings.
                    </p>
                    <div className="flex space-x-2">
                      <div className="w-8 h-1 bg-white rounded-full"></div>
                      <div className="w-4 h-1 bg-blue-200 rounded-full"></div>
                      <div className="w-8 h-1 bg-white rounded-full"></div>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div>
                    <h4 className="text-lg font-semibold text-blue-200 mb-4">Quick Links</h4>
                    <ul className="space-y-2">
                      <li>
                        <Link href="/" className="text-blue-100 hover:text-white transition-colors">
                          Home
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/anime"
                          className="text-blue-100 hover:text-white transition-colors"
                        >
                          Anime
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/reviews"
                          className="text-blue-100 hover:text-white transition-colors"
                        >
                          Reviews
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* About */}
                  <div>
                    <h4 className="text-lg font-semibold text-blue-200 mb-4">About</h4>
                    <p className="text-blue-100 text-sm">
                      Built with modern web technologies to provide the best anime discovery
                      experience.
                    </p>
                  </div>
                </div>

                <hr className="my-8" style={{ borderColor: "#60a5fa" }} />

                <div className="text-center text-sm text-blue-100">
                  <p>&copy; 2025 Anirank. Built with ❤️ for anime enthusiasts.</p>
                </div>
              </div>
            </footer>
          </UserListsProvider>
        </Providers>
      </body>
    </html>
  );
}
