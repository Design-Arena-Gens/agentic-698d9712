"use client";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import type { User } from "@/lib/types";

export default function SuperAdminPage() {
  const { db, addKindergarten, removeKindergarten, setSettings, currentUser } = useAppStore();
  if (!currentUser || currentUser.role !== 'super_admin') {
    return <div className="text-sm text-red-600">Please login as Super Admin.</div>;
  }
  const [kgName, setKgName] = useState("");
  const [primaryColor, setPrimaryColor] = useState(db.settings.primaryColor || "#2563eb");
  const [language, setLanguage] = useState(db.settings.language || "en");
  const [logoUrl, setLogoUrl] = useState(db.settings.logoUrl || "");
  const [tgToken, setTgToken] = useState(db.settings.telegramBotToken || "");
  const [tgChatId, setTgChatId] = useState(db.settings.telegramChatId || "");

  const stats = {
    kindergartens: db.kindergartens.length,
    users: db.users.length,
    students: db.students.length,
    branches: db.branches.length,
  };

  return (
    <div className="grid gap-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(stats).map(([k, v]) => (
          <div key={k} className="rounded-lg border bg-white p-4"><div className="text-xs uppercase text-gray-500">{k}</div><div className="text-2xl font-semibold">{v}</div></div>
        ))}
      </div>

      <section className="rounded-lg border bg-white p-6">
        <h2 className="font-semibold mb-3">Create Kindergarten</h2>
        <div className="flex gap-2">
          <input className="border rounded px-3 py-2 flex-1" value={kgName} onChange={(e) => setKgName(e.target.value)} placeholder="Kindergarten name" />
          <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={() => { if (kgName.trim()) { addKindergarten(kgName.trim()); setKgName(""); } }}>Add</button>
        </div>
        <ul className="mt-4 divide-y">
          {db.kindergartens.map((k) => (
            <li key={k.id} className="py-2 flex items-center justify-between">
              <span>{k.name}</span>
              <button className="text-red-600 text-sm" onClick={() => removeKindergarten(k.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

      <UsersSection users={db.users} />

      <section className="rounded-lg border bg-white p-6">
        <h2 className="font-semibold mb-3">System Settings</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-sm text-gray-600">Logo URL</span>
            <input className="border rounded px-3 py-2" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-gray-600">Primary Color</span>
            <input type="color" className="border rounded h-10" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-gray-600">Language</span>
            <select className="border rounded px-3 py-2" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="en">English</option>
              <option value="ru">???????</option>
              <option value="uz">O'zbekcha</option>
            </select>
          </label>
          <div />
          <label className="grid gap-1">
            <span className="text-sm text-gray-600">Telegram Bot Token</span>
            <input className="border rounded px-3 py-2" value={tgToken} onChange={(e) => setTgToken(e.target.value)} />
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-gray-600">Telegram Chat ID</span>
            <input className="border rounded px-3 py-2" value={tgChatId} onChange={(e) => setTgChatId(e.target.value)} />
          </label>
        </div>
        <button className="mt-3 px-4 py-2 rounded border" onClick={() => setSettings({ primaryColor, language, logoUrl, telegramBotToken: tgToken, telegramChatId: tgChatId })}>Save Settings</button>
      </section>
    </div>
  );
}

function UsersSection({ users }: { users: User[] }) {
  return (
    <section className="rounded-lg border bg-white p-6">
      <h2 className="font-semibold mb-3">All Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead><tr className="text-left text-gray-500"><th className="py-2 pr-3">Name</th><th className="py-2 pr-3">Role</th><th className="py-2 pr-3">Phone</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t"><td className="py-2 pr-3">{u.name}</td><td className="py-2 pr-3">{u.role}</td><td className="py-2 pr-3">{u.phone || '-'}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
