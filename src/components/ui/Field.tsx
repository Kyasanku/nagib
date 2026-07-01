import { cn } from "@/lib/utils";

const base =
  "w-full rounded-xl border border-black/10 bg-ink-800/60 px-4 py-3 text-sm text-ivory placeholder:text-ivory-dim outline-none transition-colors focus:border-gold/50 focus:bg-ink-800";

export function Label({ children, htmlFor, required }: { children: React.ReactNode; htmlFor?: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ivory-muted">
      {children} {required && <span className="text-gold">*</span>}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(base, props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(base, "min-h-[120px] resize-y", props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(base, "appearance-none", props.className)} />;
}
