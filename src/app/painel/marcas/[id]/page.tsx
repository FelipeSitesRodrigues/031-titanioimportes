import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Marca } from "@/types/database";
import { MarcaForm } from "../_components/MarcaForm";
import { updateMarca } from "../actions";

export default async function EditarMarcaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("marcas")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();
  const marca = data as Marca;

  const action = updateMarca.bind(null, marca.id);

  return (
    <div>
      <Link
        href="/painel/marcas"
        className="text-sm text-muted transition hover:text-fg"
      >
        ← Voltar para marcas
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold">Editar marca</h1>
      <MarcaForm
        action={action}
        defaults={marca}
        submitLabel="Salvar alterações"
      />
    </div>
  );
}
