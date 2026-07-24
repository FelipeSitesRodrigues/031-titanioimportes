import Image from "next/image";
import Link from "next/link";
import { ManifestLabel } from "@/components/ManifestLabel";
import { createClient } from "@/lib/supabase/server";

export default async function MarcasPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("marcas")
    .select("id, nome, logo_url")
    .order("ordem")
    .order("nome");

  const marcas = data ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <ManifestLabel code="TI—MARCAS">Marcas que a Titânio trabalha</ManifestLabel>
      <h1 className="mt-3 font-display text-4xl font-black uppercase tracking-tight sm:text-6xl">
        Marcas
      </h1>

      {marcas.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border bg-surface p-16 text-center text-muted">
          Nenhuma marca cadastrada ainda.
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {marcas.map((m) => (
            <Link
              key={m.id}
              href={`/catalogo?marca=${m.id}`}
              className="group flex aspect-[4/3] flex-col items-center justify-center gap-3 rounded-xl border border-border bg-surface p-6 transition hover:border-brand/60"
            >
              <div className="flex h-16 w-full items-center justify-center">
                {m.logo_url ? (
                  <Image
                    src={m.logo_url}
                    alt={m.nome}
                    width={140}
                    height={64}
                    className="max-h-16 w-auto object-contain opacity-80 grayscale transition group-hover:opacity-100 group-hover:grayscale-0"
                  />
                ) : (
                  <span className="font-display text-xl font-bold uppercase text-muted">
                    {m.nome}
                  </span>
                )}
              </div>
              <span className="font-mono text-xs uppercase tracking-wider text-muted">
                {m.nome}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
