import Image from "next/image";
import Link from "next/link";
import { brl } from "@/lib/site";

type Props = {
  id: string;
  nome: string;
  preco: number;
  precoPromocional: number | null;
  marca?: string | null;
  capa?: string | null;
  status?: string;
};

export function ProductCard({
  id,
  nome,
  preco,
  precoPromocional,
  marca,
  capa,
  status,
}: Props) {
  const esgotado = status === "esgotado";
  const promo = precoPromocional != null && precoPromocional < preco;
  const desconto = promo
    ? Math.round((1 - precoPromocional! / preco) * 100)
    : 0;

  return (
    <Link
      href={`/produto/${id}`}
      className="group relative block overflow-hidden border border-border bg-surface transition hover:border-brand/60"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
        {capa ? (
          <Image
            src={capa}
            alt={nome}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition duration-500 group-hover:scale-105 ${
              esgotado ? "opacity-40" : ""
            }`}
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-xs text-muted">
            sem foto
          </div>
        )}

        {promo && !esgotado && (
          <span className="absolute left-0 top-3 bg-brand px-2 py-1 font-mono text-[11px] font-bold text-white">
            −{desconto}%
          </span>
        )}

        {esgotado && (
          <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-black/70 py-1 text-center font-mono text-xs uppercase tracking-[0.2em] text-fg">
            Esgotado
          </span>
        )}
      </div>

      <div className="p-3">
        {marca && (
          <div className="truncate font-mono text-[11px] uppercase tracking-wider text-muted">
            {marca}
          </div>
        )}
        <div className="mt-0.5 line-clamp-2 text-sm font-medium leading-snug">
          {nome}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          {promo ? (
            <>
              <span className="font-semibold text-fg">
                {brl(precoPromocional!)}
              </span>
              <span className="text-xs text-muted line-through">
                {brl(preco)}
              </span>
            </>
          ) : (
            <span className="font-semibold">{brl(preco)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
