/**
 * The small numbered label that opens each section. On the home page it is the
 * section's `<h2>`, so the outline reads About / Skills / Projects / Contact.
 * Pages whose `<h1>` comes after the label pass `as="p"` to keep the heading
 * order valid.
 */
export function SectionHead({
  index,
  title,
  as: Tag = "h2",
}: {
  index: string;
  title: string;
  as?: "h2" | "p";
}) {
  return (
    <div className="mb-12 flex items-baseline gap-4">
      <span className="font-mono text-[13px] text-accent">{index}</span>
      <Tag className="font-mono text-[13px] font-normal tracking-[0.18em] text-muted-foreground uppercase">
        {title}
      </Tag>
      <span aria-hidden className="h-px flex-1 self-center bg-border" />
    </div>
  );
}
