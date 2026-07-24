import Image from "next/image";
import Link from "next/link";
import type { Marca } from "@/types/database";

type BrandItem = Pick<Marca, "id" | "nome" | "logo_url">;

/** Carrossel infinito de marcas (CSS puro, sem JS). Pausa no hover. */
export function BrandMarquee({ marcas }: { marcas: BrandItem[] }) {
  if (!marcas.length) return null;

  // duplica a lista para o loop parecer contínuo
  const items = [...marcas, ...marcas];

  return (
    <div className="marquee-mask marquee-pause overflow-hidden border-y border-border bg-surface py-6">
      <div className="marquee-track gap-12 px-6">
        {items.map((m, i) => (
          <Link
            key={`${m.id}-${i}`}
            href={`/catalogo?marca=${m.id}`}
            className="flex h-10 w-28 shrink-0 items-center justify-center opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
            aria-label={m.nome}
          >
            {m.logo_url ? (
              <Image
                src={m.logo_url}
                alt={m.nome}
                width={112}
                height={40}
                className="max-h-10 w-auto object-contain"
              />
            ) : (
              <span className="font-display text-sm font-bold uppercase tracking-wider text-muted">
                {m.nome}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
