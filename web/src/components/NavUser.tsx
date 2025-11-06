"use client";
import Link from "next/link";
import { useAppStore } from "@/lib/store";

export function NavUser() {
  const currentUser = useAppStore((s) => s.currentUser);
  const logout = useAppStore((s) => s.logout);
  if (!currentUser) return (
    <nav className="flex gap-4 text-sm">
      <Link href="/">Login</Link>
    </nav>
  );
  return (
    <nav className="flex items-center gap-3 text-sm">
      <span className="px-2 py-1 rounded bg-gray-100">{currentUser.role.replace('_', ' ')}</span>
      <span className="text-gray-600">{currentUser.name}</span>
      <button className="px-2 py-1 rounded border" onClick={logout}>Logout</button>
    </nav>
  );
}
