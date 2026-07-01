export default function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow && (
        <p className="eyebrow animate-fade-up">{eyebrow}</p>
      )}
      <h1 className="mt-4 animate-fade-up font-display text-4xl leading-tight text-ivory [animation-delay:100ms] md:text-6xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mx-auto mt-5 max-w-xl animate-fade-up text-base leading-relaxed text-ivory-muted [animation-delay:200ms]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
