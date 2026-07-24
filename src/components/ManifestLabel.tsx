/** Etiqueta "manifesto de importação" — eyebrow em fonte mono com traço vermelho. */
export function ManifestLabel({
  code,
  children,
}: {
  code?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-brand">
      <span className="h-px w-8 bg-brand" />
      {code && <span className="text-muted">{code}</span>}
      <span>{children}</span>
    </div>
  );
}
