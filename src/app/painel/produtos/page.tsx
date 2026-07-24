import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Produto } from "@/types/database";
import { DeleteButton } from "../_components/DeleteButton";
import { deleteProduto } from "./actions";

type ProdutoRow = Produto & {
  marcas: { nome: string } | null;
  produto_fotos: { url: string; ordem: number }[];
};

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const statusInfo: Record<string, { label: string; className: string }> = {
  ativo: { label: "Ativo", className: "bg-green-500/15 text-green-400" },
  rascunho: { label: "Rascunho", className: "bg-white/10 text-muted" },
  esgotado: { label: "Esgotado", className: "bg-brand/15 text-brand" },
};

export default async function ProdutosPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("produtos")
    .select("*, marcas(nome), produto_fotos(url, ordem)")
    .order("criado_em", { ascending: false });

  const produtos = (data ?? []) as unknown as ProdutoRow[];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Produtos</h1>
          <p className="text-sm text-muted">{produtos.length} cadastrado(s).</p>
        </div>
        <Link
          href="/painel/produtos/nova"
          className="shrink-0 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          + Novo produto
        </Link>
      </div>

      {produtos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center">
          <p className="text-muted">Nenhum produto cadastrado ainda.</p>
          <Link
            href="/painel/produtos/nova"
            className="mt-3 inline-block text-sm font-medium text-brand hover:underline"
          >
            Cadastrar o primeiro produto
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {produtos.map((p) => {
            const capa = [...(p.produto_fotos ?? [])].sort(
              (a, b) => a.ordem - b.ordem,
            )[0];
            const status = statusInfo[p.status] ?? statusInfo.rascunho;
            return (
              <li
                key={p.id}
                className="flex gap-4 rounded-xl border border-border bg-surface p-4"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-white/5">
                  {capa ? (
                    <Image
                      src={capa.url}
                      alt={p.nome}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-muted">
                      sem foto
                    </div>
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate font-medium">{p.nome}</div>
                      <div className="truncate text-xs text-muted">
                        {p.marcas?.nome ?? "Sem marca"}
                      </div>
                    </div>
                    {p.destaque && (
                      <span className="shrink-0 text-xs text-brand" title="Destaque">
                        ★
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex items-baseline gap-2">
                    {p.preco_promocional != null ? (
                      <>
                        <span className="font-semibold text-brand">
                          {brl(p.preco_promocional)}
                        </span>
                        <span className="text-xs text-muted line-through">
                          {brl(p.preco)}
                        </span>
                      </>
                    ) : (
                      <span className="font-semibold">{brl(p.preco)}</span>
                    )}
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <span
                      className={`rounded px-2 py-0.5 text-[11px] font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/painel/produtos/${p.id}`}
                        className="rounded-md px-2.5 py-1 text-sm text-muted transition hover:text-fg"
                      >
                        Editar
                      </Link>
                      <DeleteButton onDelete={deleteProduto.bind(null, p.id)} />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
