import Image from "next/image";
import Link from "next/link";
import { BrandMarquee } from "@/components/BrandMarquee";
import { ManifestLabel } from "@/components/ManifestLabel";
import { ProductCard } from "@/components/ProductCard";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/lib/site";
import { capaDe, PRODUTO_SELECT, type ProdutoComRelacoes } from "@/lib/produtos";

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; marca?: string }>;
}) {
  const { categoria, marca } = await searchParams;
  const supabase = await createClient();

  const [{ data: categorias }, { data: marcas }] = await Promise.all([
    supabase
      .from("categorias")
      .select("id, nome")
      .order("ordem")
      .order("nome"),
    supabase.from("marcas").select("id, nome, logo_url").order("ordem"),
  ]);

  let query = supabase
    .from("produtos")
    .select(PRODUTO_SELECT)
    .neq("status", "rascunho");

  if (categoria) query = query.eq("categoria_id", categoria);
  if (marca) query = query.eq("marca_id", marca);

  const { data: produtosData } = await query.order("criado_em", {
    ascending: false,
  });
  const produtos = (produtosData ?? []) as unknown as ProdutoComRelacoes[];
  const marcaAtiva = marcas?.find((m) => m.id === marca) ?? null;

  return (
    <>
      {/* Banner */}
      {site.bannerCatalogo ? (
        <section className="border-b border-border">
          {/* Mobile (retrato) */}
          {site.bannerCatalogoMobile && (
            <div className="relative aspect-[4/5] w-full bg-surface sm:hidden">
              <Image
                src={site.bannerCatalogoMobile}
                alt="Catálogo Titânio Importes"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          )}
          {/* Desktop (e fallback quando não há banner mobile) */}
          <div
            className={`relative aspect-[16/5] w-full bg-surface ${
              site.bannerCatalogoMobile ? "hidden sm:block" : "block"
            }`}
          >
            <Image
              src={site.bannerCatalogo}
              alt="Catálogo Titânio Importes"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </section>
      ) : (
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-brand/15 blur-[110px]" />
          <div className="relative mx-auto max-w-7xl px-4 py-16">
            <ManifestLabel code="TI—CATÁLOGO">Todos os produtos</ManifestLabel>
            <h1 className="mt-3 font-display text-4xl font-black uppercase tracking-tight sm:text-6xl">
              Catálogo
            </h1>
            <p className="mt-3 font-mono text-xs uppercase tracking-widest text-muted">
              {produtos.length} produto(s)
              {marcaAtiva ? ` · marca: ${marcaAtiva.nome}` : ""}
            </p>
          </div>
        </section>
      )}

      <BrandMarquee marcas={marcas ?? []} />

      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Filtros de categoria */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/catalogo"
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              !categoria && !marca
                ? "border-brand bg-brand/10 text-fg"
                : "border-border text-muted hover:text-fg"
            }`}
          >
            Todos
          </Link>
          {(categorias ?? []).map((c) => (
            <Link
              key={c.id}
              href={`/catalogo?categoria=${c.id}`}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                categoria === c.id
                  ? "border-brand bg-brand/10 text-fg"
                  : "border-border text-muted hover:text-fg"
              }`}
            >
              {c.nome}
            </Link>
          ))}
          {marca && (
            <Link
              href="/catalogo"
              className="rounded-full border border-brand/60 px-4 py-1.5 text-sm text-brand"
            >
              Limpar marca ✕
            </Link>
          )}
        </div>

        {/* Grade */}
        {produtos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-surface p-16 text-center text-muted">
            Nenhum produto encontrado com esse filtro.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {produtos.map((p) => (
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
      </div>
    </>
  );
}
