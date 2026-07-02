"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Input, Label } from "@/components/ui/Field";

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    const password = String(f.get("password"));

    const supabase = createClient();
    if (!supabase) {
      // Demo mode — walk straight into the dashboard.
      router.push("/studio");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/studio");
    router.refresh();
  }

  return (
    <div className="grid min-h-screen place-items-center bg-ink px-5">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-gold/40 bg-gold/10 font-display text-lg text-gold">
            N
          </span>
          <span className="font-display text-xl text-ivory">Nagibu Semwanga · Studio</span>
        </Link>

        <div className="rounded-3xl border border-black/[0.05] bg-ink-800/60 p-8">
          <h1 className="font-display text-2xl text-ivory">Sign in</h1>
          <p className="mb-6 mt-1 text-sm text-ivory-dim">
            {isSupabaseConfigured
              ? "Enter your studio credentials."
              : "Demo mode — press continue to explore the dashboard."}
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required={isSupabaseConfigured}
                placeholder="artist@studio.com"
                defaultValue={isSupabaseConfigured ? "" : "demo@studio.com"}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required={isSupabaseConfigured}
                placeholder="••••••••"
                defaultValue={isSupabaseConfigured ? "" : "demo"}
              />
            </div>
            {error && <p className="text-sm text-rose-300">{error}</p>}
            <button type="submit" disabled={loading} className="btn-gold w-full">
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Signing in…</>
              ) : (
                <>{isSupabaseConfigured ? "Sign in" : "Continue to dashboard"} <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        </div>

        <Link href="/" className="mt-6 block text-center text-sm text-ivory-dim hover:text-ivory">
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
