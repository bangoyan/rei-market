"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useIsOwner } from "@/lib/hooks";
import { ShieldAlert } from "lucide-react";
import type { Profile } from "@/types";

export default function AdminUsersPage() {
  const isOwner = useIsOwner();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    setUsers(data ?? []);
    setLoading(false);
  }

  async function toggleRole(user: Profile) {
    if (!isOwner) {
      alert("Mode demo: perubahan role dinonaktifkan.");
      return;
    }
    const newRole = user.role === "admin" ? "customer" : "admin";
    const label =
      newRole === "admin" ? "jadikan Admin" : "kembalikan ke Customer";
    if (!confirm(`${label} untuk ${user.full_name ?? user.email ?? "user ini"}?`))
      return;
    await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", user.id);
    loadUsers();
  }

  if (loading) {
    return <div className="animate-pulse h-8 w-48 rounded bg-border" />;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Pengguna</h1>
          <span className="rounded-full bg-background px-3 py-1 text-xs font-medium text-muted">
            {users.length} pengguna
          </span>
        </div>
        {!isOwner && (
          <span className="flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800">
            <ShieldAlert className="h-3.5 w-3.5" /> Demo Mode: Read-Only
          </span>
        )}
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-4 py-3 font-medium text-muted">Nama</th>
              <th className="px-4 py-3 font-medium text-muted">Email</th>
              <th className="px-4 py-3 font-medium text-muted">Telepon</th>
              <th className="px-4 py-3 font-medium text-muted">Role</th>
              <th className="px-4 py-3 font-medium text-muted">Bergabung</th>
              {isOwner && (
                <th className="px-4 py-3 font-medium text-muted">Aksi</th>
              )}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-border last:border-0"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {user.full_name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <span className="font-medium">
                      {user.full_name ?? "Belum ada nama"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">{user.email ?? "—"}</td>
                <td className="px-4 py-3 text-muted">{user.phone ?? "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-stone-100 text-stone-700"
                    }`}
                  >
                    {user.role === "admin" ? "Admin" : "Customer"}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">
                  {new Date(user.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                {isOwner && (
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleRole(user)}
                      className="text-xs text-primary hover:text-primary-dark"
                    >
                      {user.role === "admin"
                        ? "Jadikan Customer"
                        : "Jadikan Admin"}
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={isOwner ? 6 : 5}
                  className="px-4 py-8 text-center text-muted"
                >
                  Belum ada pengguna.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
