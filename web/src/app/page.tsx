"use client";
import { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";

export default function Home() {
  const { db, loginAs } = useAppStore();
  const [name, setName] = useState("");
  const [role, setRole] = useState<"super_admin" | "director" | "teacher" | "parent">("super_admin");
  const [phone, setPhone] = useState("");
  const [kindergartenId, setKindergartenId] = useState("");
  const [branchId, setBranchId] = useState("");

  const handleLogin = () => {
    loginAs(role, name || (role === "super_admin" ? "Super Admin" : role), {
      phone,
      kindergartenId: kindergartenId || undefined,
      branchId: branchId || undefined,
    });
  };

  return (
    <div className="grid gap-8">
      <section className="rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold mb-4">Sign in</h1>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-sm text-gray-600">Role</span>
            <select className="border rounded px-3 py-2" value={role} onChange={(e) => setRole(e.target.value as any)}>
              <option value="super_admin">Super Admin</option>
              <option value="director">Director</option>
              <option value="teacher">Teacher</option>
              <option value="parent">Parent</option>
            </select>
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-gray-600">Name</span>
            <input className="border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-gray-600">Phone (optional)</span>
            <input className="border rounded px-3 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998..." />
          </label>
          {(role === "director" || role === "teacher" || role === "parent") && (
            <label className="grid gap-1">
              <span className="text-sm text-gray-600">Kindergarten</span>
              <select className="border rounded px-3 py-2" value={kindergartenId} onChange={(e) => setKindergartenId(e.target.value)}>
                <option value="">Select...</option>
                {db.kindergartens.map((k) => (
                  <option key={k.id} value={k.id}>{k.name}</option>
                ))}
              </select>
            </label>
          )}
          {role === "teacher" && (
            <label className="grid gap-1">
              <span className="text-sm text-gray-600">Branch (optional)</span>
              <select className="border rounded px-3 py-2" value={branchId} onChange={(e) => setBranchId(e.target.value)}>
                <option value="">Any</option>
                {db.branches
                  .filter((b) => !kindergartenId || b.kindergartenId === kindergartenId)
                  .map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
              </select>
            </label>
          )}
        </div>
        <div className="mt-4 flex gap-2">
          <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={handleLogin}>Continue</button>
          {role === "super_admin" && (
            <Link href="/super-admin" className="px-4 py-2 rounded border">Go to Super Admin</Link>
          )}
          {role === "director" && (
            <Link href="/director" className="px-4 py-2 rounded border">Go to Director</Link>
          )}
          {role === "teacher" && (
            <Link href="/teacher" className="px-4 py-2 rounded border">Go to Teacher</Link>
          )}
        </div>
      </section>

      <section className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="font-medium mb-2">Quick start for Super Admin</h2>
        <p className="text-sm text-gray-600 mb-3">Create a kindergarten to use with Director/Teacher accounts.</p>
        <QuickCreateKindergarten />
      </section>
    </div>
  );
}

function QuickCreateKindergarten() {
  const addKindergarten = useAppStore((s) => s.addKindergarten);
  const [name, setName] = useState("");
  return (
    <div className="flex gap-2">
      <input className="border rounded px-3 py-2 flex-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="Kindergarten name" />
      <button className="px-4 py-2 rounded bg-gray-900 text-white" onClick={() => { if (name.trim()) { addKindergarten(name.trim()); setName(""); } }}>Add</button>
    </div>
  );
}
