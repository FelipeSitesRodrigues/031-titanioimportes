import Image from "next/image";
import Link from "next/link";
import { BrandMarquee } from "@/components/BrandMarquee";
import { FlightArc } from "@/components/FlightArc";
import { ManifestLabel } from "@/components/ManifestLabel";
import { ProductCard } from "@/components/ProductCard";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/lib/site";
import { capaDe, PRODUTO_SELECT, type ProdutoComRelacoes } from "@/lib/produtos";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: destaquesData }, { data: marcas }] = await Promise.all([
    supabase
      .from("produtos")
      .select(PRODUTO_SELECT)
      .eq("destaque", true)
      .neq("status", "rascunho")
      .order("criado_em", { ascending: false })
      .limit(8),
    supabase.from("marcas").select("id, nome, logo_url").order("ordem"),
  ]);

  const destaques = (destaquesData ?? []) as unknown as ProdutoComRelacoes[];

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute -right-40 -top-20 h-[500px] w-[500px] rounded-full bg-brand/20 blur-[130px]" />
        <FlightArc className="pointer-events-none absolute right-0 top-16 hidden h-64 w-3/5 opacity-40 md:block" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:py-32">
          <ManifestLabel code="TI—001">
            Importados · Originais · Sob demanda
          </ManifestLabel>

          <h1 className="mt-6 max-w-4xl font-display text-5xl font-black uppercase leading-[0.92] tracking-tight sm:text-7xl lg:text-8xl">
            Streetwear <span className="text-chrome">importado</span>, direto da
            fonte.
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted">
            Roupas, tênis e acessórios originais. E o que você não achar aqui, a
            Titânio importa pra você.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/catalogo"
              className="rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              Ver catálogo
            </Link>
            <WhatsAppButton
              message="Olá! Quero importar um produto com a Titânio."
              variant="outline"
            >
              Importe o que quiser
            </WhatsAppButton>
          </div>
        </div>
      </section>

      {/* ── CARROSSEL DE MARCAS ───────────────────────────── */}
      <BrandMarquee marcas={marcas ?? []} />

      {/* ── PRODUTOS EM DESTAQUE ──────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-8">
          <ManifestLabel code="EM ALTA">Destaques</ManifestLabel>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            Peças em destaque
          </h2>
        </div>

        {destaques.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-surface p-12 text-center text-muted">
            Nenhum produto em destaque ainda. Marque produtos como “destaque” no
            painel.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {destaques.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                nome={p.nome}
                preco={p.preco}
                precoPromocional={p.preco_promocional}
                marca={p.marcas?.nome}
                capa={capaDe(p.produto_fotos)}
                status={p.status}
              />
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href="/catalogo"
            className="pulse-cta rounded-lg bg-brand px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-dark"
          >
            Ver todos os produtos
          </Link>
        </div>
      </section>

      {/* ── IMPORTE O QUE QUISER ──────────────────────────── */}
      <section className="border-y border-border bg-surface">
        <div className="relative mx-auto grid max-w-7xl gap-8 overflow-hidden px-4 py-20 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <ManifestLabel code="SOB DEMANDA">Importação personalizada</ManifestLabel>
            <h2 className="mt-4 font-display text-3xl font-bold uppercase leading-tight tracking-tight sm:text-5xl">
              Não achou aqui?
              <br />A gente <span className="text-brand text-glow">importa</span>{" "}
              pra você.
            </h2>
            <p className="mt-5 max-w-lg text-muted">
              Manda a foto do produto que você quer no WhatsApp. A Titânio
              viabiliza a importação — original, com preço justo e sem
              enrolação. Roupa, tênis, acessório, o que for.
            </p>
            <div className="mt-7">
              <WhatsAppButton message="Olá! Quero importar um produto. Vou te enviar a foto do que estou procurando.">
                Enviar produto no WhatsApp
              </WhatsAppButton>
            </div>
          </div>

          <div className="relative hidden md:block">
            <FlightArc className="h-56 w-full opacity-60" />
            <div className="mt-4 rounded-xl border border-border bg-bg p-5 font-mono text-xs text-muted">
              <div className="text-brand">// MANIFESTO DE IMPORTAÇÃO</div>
              <div className="mt-3 flex justify-between">
                <span>ORIGEM</span>
                <span className="text-fg">DEFINIDA POR VOCÊ</span>
              </div>
              <div className="mt-1 flex justify-between">
                <span>PRODUTO</span>
                <span className="text-fg">SOB DEMANDA</span>
              </div>
              <div className="mt-1 flex justify-between">
                <span>STATUS</span>
                <span className="text-fg">PRONTO PRA COTAR</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── POR QUE A TITÂNIO ─────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <ManifestLabel code="TI—DIFERENCIAIS">Por que a Titânio</ManifestLabel>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
          Importado de verdade não é sorte. É processo.
        </h2>

        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {site.diferenciais.map((d) => (
            <div key={d.titulo} className="bg-surface p-6">
              <div className="mb-3 h-1.5 w-8 bg-brand" />
              <h3 className="font-display text-lg font-bold uppercase tracking-tight">
                {d.titulo}
              </h3>
              <p className="mt-2 text-sm text-muted">{d.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FUNDADOR ──────────────────────────────────────── */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-[280px_1fr] md:items-center">
          <div className="relative mx-auto aspect-square w-56 md:mx-0 md:w-full">
            {site.fundador.foto ? (
              <Image
                src={site.fundador.foto}
                alt={site.fundador.nome}
                fill
                sizes="(max-width: 768px) 224px, 280px"
                className="rounded-2xl border border-border object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-2xl border border-border bg-bg font-display text-6xl font-black text-chrome">
                AS
              </div>
            )}
          </div>

          <div>
            <ManifestLabel code="FUNDADOR">{site.fundador.cargo}</ManifestLabel>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
              {site.fundador.nome}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
              {site.fundador.bio}
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA CATÁLOGO ──────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-brand/10 blur-[100px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 text-center">
          <h2 className="mx-auto max-w-3xl font-display text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl">
            O catálogo completo
            <br />
            <span className="text-chrome">te espera.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-muted">
            Explore tudo que a Titânio já trouxe — e o que ainda vai trazer.
          </p>
          <Link
            href="/catalogo"
            className="mt-8 inline-block rounded-lg bg-brand px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-dark"
          >
            Entrar no catálogo
          </Link>
        </div>
      </section>
    </>
  );
}
