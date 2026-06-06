type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  id?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = "left",
  id,
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "mx-auto text-center" : "";

  return (
    <header className={`max-w-prose ${alignClass}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id} className={`section-title ${eyebrow ? "mt-3" : ""}`}>
        {title}
      </h2>
      {lead && <p className={`section-lead ${align === "center" ? "mx-auto" : ""}`}>{lead}</p>}
    </header>
  );
}
