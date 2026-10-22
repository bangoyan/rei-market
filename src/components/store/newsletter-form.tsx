"use client";

import { useState } from "react";
import { useToastStore } from "@/lib/store/toast";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const toast = useToastStore((s) => s.show);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    // shortcut: no backend, visual-only for portfolio demo
    toast("Siap! Kamu akan dapat info promo terbaru.");
    setEmail("");
  }

  return (
    <form className="mx-auto mt-6 flex max-w-sm gap-2" onSubmit={handleSubmit}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="emailkamu@contoh.com"
        className="flex-1 rounded-md border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-stone-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />
      <button
        type="submit"
        className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
      >
        Langganan
      </button>
    </form>
  );
}
