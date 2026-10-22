"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";
import type { Profile } from "@/types";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?redirect=/profile");
        return;
      }
      setEmail(user.email ?? null);
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(data);
      setLoading(false);
    }
    load();
  }, [supabase, router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setFeedback(null);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
        address: profile.address,
      })
      .eq("id", profile.id);

    setFeedback(
      error
        ? { ok: false, text: error.message }
        : { ok: true, text: "Profil berhasil disimpan." }
    );
    setSaving(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 animate-pulse rounded-full bg-border" />
          <div className="space-y-2">
            <div className="h-5 w-32 animate-pulse rounded bg-border" />
            <div className="h-4 w-48 animate-pulse rounded bg-border" />
          </div>
        </div>
        <div className="mt-8 space-y-4">
          <div className="h-10 w-full animate-pulse rounded-md bg-border" />
          <div className="h-10 w-full animate-pulse rounded-md bg-border" />
          <div className="h-20 w-full animate-pulse rounded-md bg-border" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const initial = profile.full_name?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:px-6">
      {/* Header with avatar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
            {initial}
          </div>
          <div>
            <h1 className="text-xl font-bold">
              {profile.full_name || "Belum ada nama"}
            </h1>
            {email && (
              <p className="text-sm text-muted">{email}</p>
            )}
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm text-muted transition-colors hover:bg-background hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>
      </div>

      <form onSubmit={handleSave} className="mt-8 space-y-4">
        {feedback && (
          <div
            className={`rounded-md p-3 text-sm ${
              feedback.ok
                ? "bg-green-50 text-success"
                : "bg-red-50 text-error"
            }`}
          >
            {feedback.text}
          </div>
        )}

        <div>
          <label htmlFor="fullname" className="mb-1 block text-sm font-medium">
            Nama Lengkap
          </label>
          <input
            id="fullname"
            type="text"
            value={profile.full_name ?? ""}
            onChange={(e) =>
              setProfile({ ...profile, full_name: e.target.value })
            }
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium">
            No. Telepon
          </label>
          <input
            id="phone"
            type="tel"
            value={profile.phone ?? ""}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="08xxxxxxxxxx"
          />
        </div>

        <div>
          <label htmlFor="address" className="mb-1 block text-sm font-medium">
            Alamat Pengiriman
          </label>
          <textarea
            id="address"
            rows={3}
            value={profile.address ?? ""}
            onChange={(e) =>
              setProfile({ ...profile, address: e.target.value })
            }
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Jl. Contoh No. 123, Jakarta Selatan"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}
