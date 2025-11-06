import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import React from "react";
import { NavUser } from "@/components/NavUser";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kindergarten Manager",
  description: "Super Admin, Director, Teacher dashboards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}>
        <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-semibold">Kindergarten Manager</Link>
            <NavUser />
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        <footer className="border-t bg-white/80">
          <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-500">? {new Date().getFullYear()} KGMS</div>
        </footer>
      </body>
    </html>
  );
}

// client NavUser is imported from components
