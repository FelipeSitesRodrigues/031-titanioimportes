import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductView } from "@/components/ProductView";
import { createClient } from "@/lib/supabase/server";
import type { Produto } from "@/types/database";

type ProdutoDetalhe = Produto & {
  marcas: { nome: string } | null;
  categorias: { nome: string } | null;
};

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: produto } = await supabase
    .from("produtos")
    .select("*, marcas(nome), categorias(nome)")
    .eq("id", id)
    .neq("status", "rascunho")
    .single();

  if (!produto) notFound();
  const p = produto as unknown as ProdutoDetalhe;

  const { data: fotos } = await supabase
    .from("produto_fotos")
    .select("url, ordem, cor")
    .eq("produto_id", id)
    .order("ordem");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="mb-6 font-mono text-xs uppercase tracking-widest text-muted">
        <Link href="/catalogo" className="hover:text-fg">
          Catálogo
        </Link>
        <span className="mx-2">/</span>
        <span className="text-fg">{p.nome}</span>
      </nav>

      <ProductView
        nome={p.nome}
        preco={p.preco}
        precoPromocional={p.preco_promocional}
        descricao={p.descricao}
        marca={p.marcas?.nome ?? null}
        categoria={p.categorias?.nome ?? null}
        esgotado={p.status === "esgotado"}
        fotos={(fotos ?? []).map((f) => ({ url: f.url, cor: f.cor ?? null }))}
        cores={p.cores ?? []}
        tamanhos={p.tamanhos ?? []}
      />
    </div>
  );
}
