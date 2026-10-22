"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/store/logo";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });

      if (error) {
        let msg = error.message;
        if (msg === "User already registered") {
          msg = "Email sudah terdaftar. Silakan masuk.";
        } else if (msg === "Failed to fetch") {
          msg = "Gagal terhubung ke server Supabase. Periksa koneksi internet atau gunakan DNS 1.1.1.1 / 8.8.8.8.";
        }
        setError(msg);
        setLoading(false);
        return;
      }

      // Ensure profile exists if session exists (handles missing/failed trigger)
      if (data.user && data.session) {
        await supabase.from("profiles").upsert(
          { id: data.user.id, email, full_name: fullName },
          { onConflict: "id" }
        );
      }

      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(
        err?.message === "Failed to fetch"
          ? "Gagal terhubung ke server Supabase (masalah DNS/koneksi). Gunakan DNS 1.1.1.1 atau 8.8.8.8."
          : (err?.message || "Terjadi kesalahan saat mendaftar.")
      );
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="rei-topbar" />
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-block">
              <Logo size="md" />
            </Link>
            <p className="mt-2 text-sm text-muted">Buat akun baru</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-error">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium">
                Nama Lengkap
              </label>
              <input
                id="name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Nama lengkap Anda"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="nama@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium"
              >
                Kata Sandi
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Minimal 6 karakter"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Daftar Sekarang"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary-dark"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
