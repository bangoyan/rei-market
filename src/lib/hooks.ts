"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Returns true when the logged-in user's ID matches NEXT_PUBLIC_OWNER_ID.
 * Admin pages use this to show write controls only to the real owner,
 * keeping the demo admin account read-only.
 */
export function useIsOwner() {
  const [isOwner, setIsOwner] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const ownerId = process.env.NEXT_PUBLIC_OWNER_ID;
    if (!ownerId) return;

    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsOwner(user?.id === ownerId);
    });
  }, [supabase]);

  return isOwner;
}
