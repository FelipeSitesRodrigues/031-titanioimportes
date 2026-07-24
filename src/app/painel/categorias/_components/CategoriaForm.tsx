"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { CategoriaState } from "../actions";

type Props = {
  action: (prev: CategoriaState, formData: FormData) => Promise<CategoriaState>;
  defaults?: { nome?: string; ordem?: number };
  submitLabel?: string;
};

const inputClass =
  "w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none transition focus:border-brand";

export function CategoriaForm({
  action,
  defaults,
  submitLabel = "Salvar",
}: Props) {
  const [state, formAction, pending] = useActionState<CategoriaState, FormData>(
    action,
    null,
  );

  return (
    <form action={formAction} className="max-w-lg space-y-5">
      <div>
        <label htmlFor="nome" className="mb-1 block text-sm text-muted">
          Nome da categoria
        </label>
        <input
          id="nome"
          name="nome"
          defaultValue={defaults?.nome ?? ""}
          required
          placeholder="Ex: Camisetas"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="ordem" className="mb-1 block text-sm text-muted">
          Ordem no catálogo
        </label>
        <input
          id="ordem"
          name="ordem"
          type="number"
          defaultValue={defaults?.ordem ?? 0}
          className={inputClass}
        />
        <p className="mt-1 text-xs text-muted">Menor número aparece primeiro.</p>
      </div>

      {state?.error && (
        <p className="text-sm text-brand" role="alert">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
        >
          {pending ? "Salvando..." : submitLabel}
        </button>
        <Link
          href="/painel/categorias"
          className="rounded-lg border border-border px-4 py-2.5 text-sm text-muted transition hover:text-fg"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
