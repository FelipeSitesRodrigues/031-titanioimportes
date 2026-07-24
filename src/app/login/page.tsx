"use client";

import Image from "next/image";
import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    null,
  );

  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo-titanio.png"
            alt="Titânio Importes"
            width={200}
            height={130}
            className="h-auto w-44"
          />
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-xl">
          <h1 className="mb-1 text-xl font-semibold">Painel administrativo</h1>
          <p className="mb-6 text-sm text-muted">
            Acesso restrito à equipe Titânio.
          </p>

          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm text-muted">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none transition focus:border-brand"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm text-muted"
              >
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none transition focus:border-brand"
              />
            </div>

            {state?.error && (
              <p className="text-sm text-brand" role="alert">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
            >
              {pending ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
