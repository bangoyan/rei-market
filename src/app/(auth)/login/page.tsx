"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/store/logo";
import { ShieldCheck } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const supabase = createClient();

  const demoEmail =
    process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL || "admin.demo@reimarket.com";
  const demoPassword =
    process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD || "AdminDemo123!";

  function fillDemo() {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let msg = error.message;
        if (msg === "Invalid login credentials") {
          msg = "Email atau kata sandi salah.";
        } else if (msg === "Email not confirmed") {
          msg = "Email belum dikonfirmasi di Supabase. Buka Supabase Dashboard > Authentication > Users > Konfirmasi email akun ini.";
        } else if (msg === "Failed to fetch") {
          msg = "Gagal terhubung ke server Supabase. Periksa koneksi internet atau gunakan DNS 1.1.1.1 / 8.8.8.8.";
        }
        setError(msg);
        setLoading(false);
        return;
      }

      // Ensure profile exists (handles users created before trigger fix)
      if (data.user) {
        const fullName = data.user.user_metadata?.full_name ?? "";
        await supabase.from("profiles").upsert(
          { id: data.user.id, email, full_name: fullName },
          { onConflict: "id" }
        );
      }

      // Hard redirect ensures cookies are fully flushed to headers for middleware
      const target =
        redirectTo !== "/"
          ? redirectTo
          : email === demoEmail
            ? "/admin"
            : "/";
      window.location.href = target;
    } catch (err: any) {
      setError(
        err?.message === "Failed to fetch"
          ? "Gagal terhubung ke server Supabase (masalah DNS/koneksi). Gunakan DNS 1.1.1.1 atau 8.8.8.8."
          : (err?.message || "Terjadi kesalahan saat masuk.")
      );
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 text-center">
        <Link href="/" className="inline-block">
          <Logo size="md" />
        </Link>
        <p className="mt-2 text-sm text-muted">Masuk ke akun Anda</p>
      </div>

      {/* Demo Admin Info Box */}
      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900">
        <div className="flex items-center gap-1.5 font-semibold text-amber-800">
          <ShieldCheck className="h-4 w-4 text-accent" />
          <span>Akses Demo Admin Portfolio</span>
        </div>
        <p className="mt-1 text-amber-800/90 leading-relaxed">
          Ingin coba panel admin? Klik tombol di bawah untuk mengisi kredensial demo (mode read-only).
        </p>
        <div className="mt-2 space-y-0.5 font-mono text-[11px] text-amber-950">
          <p>Email: <span className="font-semibold">{demoEmail}</span></p>
          <p>Sandi: <span className="font-semibold">{demoPassword}</span></p>
        </div>
        <button
          type="button"
          onClick={fillDemo}
          className="mt-2.5 w-full rounded border border-amber-300 bg-white px-2.5 py-1.5 font-sans font-medium text-amber-900 transition-colors hover:bg-amber-100"
        >
          Gunakan Akun Demo Admin
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-error">
            {error}
          </div>
        )}

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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Kata sandi Anda"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Belum punya akun?{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:text-primary-dark"
        >
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="rei-topbar" />
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <Suspense fallback={<div className="h-48 w-full max-w-sm animate-pulse rounded-lg bg-surface" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
