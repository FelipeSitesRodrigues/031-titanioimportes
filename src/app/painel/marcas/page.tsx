import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Marca } from "@/types/database";
import { DeleteButton } from "../_components/DeleteButton";
import { deleteMarca } from "./actions";

export default async function MarcasPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("marcas")
    .select("*")
    .order("ordem", { ascending: true })
    .order("nome", { ascending: true });

  const marcas = (data ?? []) as Marca[];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Marcas</h1>
          <p className="text-sm text-muted">
            Aparecem no carrossel e no menu do catálogo.
          </p>
        </div>
        <Link
          href="/painel/marcas/nova"
          className="shrink-0 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          + Nova marca
        </Link>
      </div>

      {marcas.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center">
          <p className="text-muted">Nenhuma marca cadastrada ainda.</p>
          <Link
            href="/painel/marcas/nova"
            className="mt-3 inline-block text-sm font-medium text-brand hover:underline"
          >
            Cadastrar a primeira marca
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {marcas.map((m) => (
            <li
              key={m.id}
              className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/5">
                {m.logo_url ? (
                  <Image
                    src={m.logo_url}
                    alt={m.nome}
                    width={56}
                    height={56}
                    className="h-14 w-14 object-contain p-1"
                  />
                ) : (
                  <span className="text-[10px] text-muted">sem logo</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{m.nome}</div>
                <div className="text-xs text-muted">ordem: {m.ordem}</div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <Link
                  href={`/painel/marcas/${m.id}`}
                  className="rounded-md px-3 py-1.5 text-sm text-muted transition hover:text-fg"
                >
                  Editar
                </Link>
                <DeleteButton onDelete={deleteMarca.bind(null, m.id)} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
