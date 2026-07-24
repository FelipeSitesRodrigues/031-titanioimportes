"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { brl, whatsappLink } from "@/lib/site";

type Foto = { url: string; cor: string | null };

function WhatsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.15c-1.52 0-3.01-.41-4.3-1.18l-.31-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.36c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 012.41 5.82c0 4.54-3.69 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z" />
    </svg>
  );
}

export function ProductView({
  nome,
  preco,
  precoPromocional,
  descricao,
  marca,
  categoria,
  esgotado,
  fotos,
  cores,
  tamanhos,
}: {
  nome: string;
  preco: number;
  precoPromocional: number | null;
  descricao: string | null;
  marca: string | null;
  categoria: string | null;
  esgotado: boolean;
  fotos: Foto[];
  cores: string[];
  tamanhos: string[];
}) {
  const [cor, setCor] = useState<string | null>(null);
  const [tamanho, setTamanho] = useState<string | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [productUrl, setProductUrl] = useState("");

  useEffect(() => {
    setProductUrl(window.location.origin + window.location.pathname);
  }, []);

  const fotosVisiveis = useMemo(() => {
    if (!cor) return fotos;
    const daCor = fotos.filter(
      (f) => f.cor && f.cor.toLowerCase() === cor.toLowerCase(),
    );
    return daCor.length ? daCor : fotos;
  }, [fotos, cor]);

  const idx = Math.min(imgIdx, Math.max(fotosVisiveis.length - 1, 0));

  const promo = precoPromocional != null && precoPromocional < preco;
  const precoFinal = promo ? precoPromocional! : preco;

  const podeComprar =
    (cores.length === 0 || cor !== null) &&
    (tamanhos.length === 0 || tamanho !== null);

  function selecionarCor(c: string) {
    setCor(c);
    setImgIdx(0);
  }

  function mensagem() {
    let m = `Olá! Tenho interesse neste produto da Titânio:\n\n*${nome}*`;
    if (cor) m += `\nCor: ${cor}`;
    if (tamanho) m += `\nTamanho: ${tamanho}`;
    m += `\nValor: ${brl(precoFinal)}`;
    if (productUrl) m += `\n\n${productUrl}`;
    return m;
  }

  return (
    <div className="grid gap-10 md:grid-cols-2">
      {/* Galeria */}
      <div>
        {fotosVisiveis.length > 0 ? (
          <>
            <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-white/5">
              <Image
                src={fotosVisiveis[idx].url}
                alt={nome}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {fotosVisiveis.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {fotosVisiveis.map((f, i) => (
                  <button
                    key={`${f.url}-${i}`}
                    type="button"
                    onClick={() => setImgIdx(i)}
                    aria-label={`Foto ${i + 1}`}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border transition ${
                      i === idx
                        ? "border-brand"
                        : "border-border opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={f.url} alt="" fill sizes="64px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex aspect-square items-center justify-center rounded-xl border border-border bg-surface font-mono text-sm text-muted">
            sem foto
          </div>
        )}
      </div>

      {/* Info + compra */}
      <div>
        {marca && (
          <div className="font-mono text-xs uppercase tracking-widest text-muted">
            {marca}
          </div>
        )}
        <h1 className="mt-1 font-display text-3xl font-bold uppercase leading-tight tracking-tight sm:text-4xl">
          {nome}
        </h1>
        {categoria && (
          <div className="mt-2">
            <span className="rounded border border-border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-muted">
              {categoria}
            </span>
          </div>
        )}

        <div className="mt-6">
          {esgotado ? (
            <div className="rounded-lg border border-border bg-surface p-6 text-center font-mono text-sm uppercase tracking-widest text-muted">
              Produto esgotado
            </div>
          ) : (
            <>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl font-bold">
                  {brl(precoFinal)}
                </span>
                {promo && (
                  <span className="text-lg text-muted line-through">
                    {brl(preco)}
                  </span>
                )}
              </div>

              {/* Cores */}
              {cores.length > 0 && (
                <div className="mt-6">
                  <div className="mb-2 font-mono text-xs uppercase tracking-widest text-muted">
                    Cor{cor ? `: ${cor}` : ""}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cores.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => selecionarCor(c)}
                        className={`rounded-lg border px-3 py-2 text-sm transition ${
                          cor === c
                            ? "border-brand bg-brand/10 text-fg"
                            : "border-border text-muted hover:border-fg hover:text-fg"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tamanhos */}
              {tamanhos.length > 0 && (
                <div className="mt-6">
                  <div className="mb-2 font-mono text-xs uppercase tracking-widest text-muted">
                    Tamanho{tamanho ? `: ${tamanho}` : ""}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tamanhos.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTamanho(t)}
                        className={`min-w-11 rounded-lg border px-3 py-2 text-sm transition ${
                          tamanho === t
                            ? "border-brand bg-brand/10 text-fg"
                            : "border-border text-muted hover:border-fg hover:text-fg"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-7">
                {podeComprar ? (
                  <a
                    href={whatsappLink(mensagem())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 py-4 text-sm font-semibold text-black transition hover:brightness-95 sm:w-auto"
                  >
                    <WhatsIcon />
                    Comprar pelo WhatsApp
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-border px-6 py-4 text-sm font-semibold text-muted sm:w-auto"
                  >
                    {cores.length > 0 && !cor
                      ? "Escolha uma cor"
                      : "Escolha um tamanho"}
                  </button>
                )}
              </div>
              <p className="mt-3 font-mono text-xs text-muted">
                Fechamento e pagamento combinados direto no WhatsApp.
              </p>
            </>
          )}
        </div>

        {descricao && (
          <div className="mt-8 border-t border-border pt-6">
            <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-muted">
              Descrição
            </h2>
            <p className="whitespace-pre-line leading-relaxed text-muted">
              {descricao}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
