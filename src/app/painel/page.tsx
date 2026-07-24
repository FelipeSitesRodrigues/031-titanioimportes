import { createClient } from "@/lib/supabase/server";

export default async function PainelHome() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [produtos, marcas, categorias] = await Promise.all([
    supabase.from("produtos").select("*", { count: "exact", head: true }),
    supabase.from("marcas").select("*", { count: "exact", head: true }),
    supabase.from("categorias").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Bem-vindo 👋</h1>
      <p className="mt-1 text-sm text-muted">{user?.email}</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Produtos" value={produtos.count ?? 0} />
        <Stat label="Marcas" value={marcas.count ?? 0} />
        <Stat label="Categorias" value={categorias.count ?? 0} />
      </div>

      <div className="mt-8 rounded-xl border border-border bg-surface p-5 text-sm text-muted">
        Próxima etapa: cadastro de produtos, marcas, categorias e variações.
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="text-3xl font-bold text-brand">{value}</div>
      <div className="mt-1 text-sm text-muted">{label}</div>
    </div>
  );
}
