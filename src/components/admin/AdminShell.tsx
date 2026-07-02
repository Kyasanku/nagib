"use client";

import { usePathname } from "next/navigation";
import { AdminStoreProvider } from "@/lib/adminStore";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // The login screen stands alone — no store, no chrome.
  if (pathname === "/studio/login") {
    return <>{children}</>;
  }

  return (
    <AdminStoreProvider>
      <div className="flex min-h-screen bg-ink">
        <AdminSidebar />
        <div className="flex-1 overflow-x-hidden">
          <div className="mx-auto max-w-6xl px-5 py-8 md:px-10">{children}</div>
        </div>
      </div>
    </AdminStoreProvider>
  );
}
