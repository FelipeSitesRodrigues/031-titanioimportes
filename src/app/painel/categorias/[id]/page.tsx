import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Categoria } from "@/types/database";
import { CategoriaForm } from "../_components/CategoriaForm";
import { updateCategoria } from "../actions";

export default async function EditarCategoriaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("categorias")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();
  const categoria = data as Categoria;

  const action = updateCategoria.bind(null, categoria.id);

  return (
    <div>
      <Link
        href="/painel/categorias"
        className="text-sm text-muted transition hover:text-fg"
      >
        ← Voltar para categorias
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold">Editar categoria</h1>
      <CategoriaForm
        action={action}
        defaults={categoria}
        submitLabel="Salvar alterações"
      />
    </div>
  );
}
