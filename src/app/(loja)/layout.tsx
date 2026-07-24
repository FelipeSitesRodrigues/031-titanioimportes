import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { site } from "@/lib/site";

export default function LojaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2" aria-label={site.nome}>
            <Image
              src="/logo-titanio.png"
              alt={site.nome}
              width={48}
              height={48}
              className="h-10 w-auto"
            />
          </Link>

          <nav className="flex items-center gap-5 font-mono text-xs uppercase tracking-widest text-muted sm:gap-7">
            <Link href="/" className="transition hover:text-fg">
              Início
            </Link>
            <Link href="/catalogo" className="transition hover:text-fg">
              Catálogo
            </Link>
            <Link href="/marcas" className="transition hover:text-fg">
              Marcas
            </Link>
          </nav>

          <WhatsAppButton
            message="Olá! Vim pelo site da Titânio."
            className="hidden !px-4 !py-2 !text-xs sm:inline-flex"
          >
            WhatsApp
          </WhatsAppButton>
        </div>
      </header>

      <main className="flex-1">
        <ViewTransition enter="page-enter" exit="page-exit">
          {children}
        </ViewTransition>
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <Image
              src="/logo-titanio.png"
              alt={site.nome}
              width={120}
              height={80}
              className="h-14 w-auto"
            />
            <p className="mt-4 text-sm text-muted">{site.tagline}</p>
          </div>

          <div className="flex gap-12">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-muted">
                Navegar
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href="/catalogo" className="text-muted hover:text-fg">
                    Catálogo
                  </Link>
                </li>
                <li>
                  <Link href="/marcas" className="text-muted hover:text-fg">
                    Marcas
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-muted">
                Contato
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a
                    href={site.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-fg"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="/painel"
                    className="text-muted hover:text-fg"
                  >
                    Painel
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-border py-5 text-center font-mono text-[11px] uppercase tracking-widest text-muted">
          © {site.nome} · Importados originais
        </div>
      </footer>
    </div>
  );
}
