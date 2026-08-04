export function SectionHead({
  index,
  title,
}: {
  index: string;
  title: string;
}) {
  return (
    <div className="mb-12 flex items-baseline gap-4">
      <span className="font-mono text-[13px] text-accent">{index}</span>
      <span className="font-mono text-[13px] tracking-[0.18em] text-muted-foreground uppercase">
        {title}
      </span>
      <span aria-hidden className="h-px flex-1 self-center bg-border" />
    </div>
  );
}
