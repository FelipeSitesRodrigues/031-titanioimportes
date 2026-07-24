import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Barreira de segurança no servidor (além do proxy e do RLS).
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-dvh">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-6">
            <Link href="/painel" className="flex items-center gap-3">
              <Image
                src="/logo-titanio.png"
                alt="Titânio"
                width={40}
                height={40}
                className="h-9 w-auto"
              />
              <span className="hidden text-sm font-semibold sm:inline">
                Painel · Titânio
              </span>
            </Link>

            <nav className="flex items-center gap-4 text-sm">
              <Link
                href="/painel"
                className="text-muted transition hover:text-fg"
              >
                Início
              </Link>
              <Link
                href="/painel/produtos"
                className="text-muted transition hover:text-fg"
              >
                Produtos
              </Link>
              <Link
                href="/painel/marcas"
                className="text-muted transition hover:text-fg"
              >
                Marcas
              </Link>
              <Link
                href="/painel/categorias"
                className="text-muted transition hover:text-fg"
              >
                Categorias
              </Link>
            </nav>
          </div>

          <form action={logout}>
            <button className="rounded-md border border-border px-3 py-1.5 text-sm text-muted transition hover:border-brand hover:text-fg">
              Sair
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
