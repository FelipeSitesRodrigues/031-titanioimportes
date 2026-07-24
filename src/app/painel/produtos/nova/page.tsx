import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProdutoForm } from "../_components/ProdutoForm";
import { createProduto } from "../actions";

export default async function NovoProdutoPage() {
  const supabase = await createClient();
  const [{ data: marcas }, { data: categorias }] = await Promise.all([
    supabase.from("marcas").select("id, nome").order("nome"),
    supabase.from("categorias").select("id, nome").order("nome"),
  ]);

  return (
    <div>
      <Link
        href="/painel/produtos"
        className="text-sm text-muted transition hover:text-fg"
      >
        ← Voltar para produtos
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold">Novo produto</h1>
      <ProdutoForm
        action={createProduto}
        marcas={marcas ?? []}
        categorias={categorias ?? []}
        submitLabel="Criar produto"
      />
    </div>
  );
}
