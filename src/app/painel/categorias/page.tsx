import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Categoria } from "@/types/database";
import { DeleteButton } from "../_components/DeleteButton";
import { deleteCategoria } from "./actions";

export default async function CategoriasPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categorias")
    .select("*")
    .order("ordem", { ascending: true })
    .order("nome", { ascending: true });

  const categorias = (data ?? []) as Categoria[];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Categorias</h1>
          <p className="text-sm text-muted">
            Viram os filtros clicáveis do catálogo.
          </p>
        </div>
        <Link
          href="/painel/categorias/nova"
          className="shrink-0 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          + Nova categoria
        </Link>
      </div>

      {categorias.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center">
          <p className="text-muted">Nenhuma categoria cadastrada ainda.</p>
          <Link
            href="/painel/categorias/nova"
            className="mt-3 inline-block text-sm font-medium text-brand hover:underline"
          >
            Cadastrar a primeira categoria
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
          {categorias.map((c) => (
            <li key={c.id} className="flex items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{c.nome}</div>
                <div className="text-xs text-muted">ordem: {c.ordem}</div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Link
                  href={`/painel/categorias/${c.id}`}
                  className="rounded-md px-3 py-1.5 text-sm text-muted transition hover:text-fg"
                >
                  Editar
                </Link>
                <DeleteButton onDelete={deleteCategoria.bind(null, c.id)} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
