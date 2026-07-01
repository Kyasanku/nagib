"use client";

import { useAdmin } from "@/lib/adminStore";
import { Info } from "lucide-react";

export default function DemoBanner() {
  const { configured } = useAdmin();
  if (configured) return null;
  return (
    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-gold/25 bg-gold/5 px-4 py-3 text-sm text-ivory-muted">
      <Info size={18} className="mt-0.5 flex-none text-gold" />
      <p>
        <span className="font-medium text-ivory">Demo mode.</span> Supabase isn&apos;t
        configured yet, so this dashboard is running on sample data. Edits work and
        update the screen, but won&apos;t persist across refreshes. Add your Supabase
        keys to <code className="rounded bg-black/10 px-1">.env.local</code> to go live.
      </p>
    </div>
  );
}
