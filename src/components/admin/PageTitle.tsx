export default function PageTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl text-ivory">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ivory-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
