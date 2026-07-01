import { cn, statusMeta } from "@/lib/utils";

export default function StatusBadge({ status }: { status: string }) {
  const meta = statusMeta[status] ?? {
    label: status,
    className: "text-ivory-dim border-black/10 bg-black/[0.05]",
  };
  return <span className={cn("chip", meta.className)}>{meta.label}</span>;
}
