import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Produto, ProdutoFoto } from "@/types/database";
import { DeleteButton } from "../../_components/DeleteButton";
import { FotoCorSelect } from "../_components/FotoCorSelect";
import { ProdutoForm } from "../_components/ProdutoForm";
import { deleteFoto, updateProduto } from "../actions";

const GERAL = "__geral__";

export default async function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: produto }, { data: fotos }, { data: marcas }, { data: categorias }] =
    await Promise.all([
      supabase.from("produtos").select("*").eq("id", id).single(),
      supabase
        .from("produto_fotos")
        .select("*")
        .eq("produto_id", id)
        .order("ordem"),
      supabase.from("marcas").select("id, nome").order("nome"),
      supabase.from("categorias").select("id, nome").order("nome"),
    ]);

  if (!produto) notFound();
  const p = produto as Produto;
  const listaFotos = (fotos ?? []) as ProdutoFoto[];

  // Agrupa fotos existentes por cor (para mostrar organizado).
  const grupos = new Map<string, ProdutoFoto[]>();
  for (const foto of listaFotos) {
    const chave = foto.cor ?? GERAL;
    if (!grupos.has(chave)) grupos.set(chave, []);
    grupos.get(chave)!.push(foto);
  }

  const action = updateProduto.bind(null, p.id);

  return (
    <div>
      <Link
        href="/painel/produtos"
        className="text-sm text-muted transition hover:text-fg"
      >
        ← Voltar para produtos
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold">Editar produto</h1>

      {listaFotos.length > 0 && (
        <div className="mb-8 max-w-2xl">
          <h2 className="mb-1 text-sm font-semibold">Fotos atuais</h2>
          <p className="mb-3 text-xs text-muted">
            Organizadas por cor. Use o seletor abaixo de cada foto para
            reclassificar. “Geral” = aparece em qualquer cor.
          </p>

          <div className="space-y-4">
            {[...grupos.entries()].map(([chave, fotosDoGrupo]) => (
              <div key={chave}>
                <div className="mb-2 font-mono text-xs uppercase tracking-widest text-muted">
                  {chave === GERAL ? "Geral" : chave}
                </div>
                <div className="flex flex-wrap gap-3">
                  {fotosDoGrupo.map((foto) => (
                    <div key={foto.id} className="w-24">
                      <div className="group relative h-24 w-24 overflow-hidden rounded-lg border border-border bg-white/5">
                        <Image
                          src={foto.url}
                          alt="Foto do produto"
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 flex justify-center bg-black/60 py-0.5 opacity-0 transition group-hover:opacity-100">
                          <DeleteButton
                            onDelete={deleteFoto.bind(null, foto.id, p.id)}
                            label="Remover"
                            confirmMessage="Remover esta foto?"
                          />
                        </div>
                      </div>
                      <FotoCorSelect
                        fotoId={foto.id}
                        produtoId={p.id}
                        cor={foto.cor}
                        cores={p.cores ?? []}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ProdutoForm
        action={action}
        marcas={marcas ?? []}
        categorias={categorias ?? []}
        defaults={{
          nome: p.nome,
          descricao: p.descricao,
          marca_id: p.marca_id,
          categoria_id: p.categoria_id,
          preco: p.preco,
          preco_promocional: p.preco_promocional,
          destaque: p.destaque,
          status: p.status,
          cores: p.cores ?? [],
          tamanhos: p.tamanhos ?? [],
        }}
        submitLabel="Salvar alterações"
      />
    </div>
  );
}
