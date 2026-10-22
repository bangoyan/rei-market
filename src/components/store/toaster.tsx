"use client";

import { useToastStore } from "@/lib/store/toast";
import { CheckCircle, X } from "lucide-react";

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="toast-enter flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-3 text-sm shadow-lg"
        >
          <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
          <span>{t.message}</span>
          <button
            onClick={() => dismiss(t.id)}
            className="ml-2 shrink-0 text-muted hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
