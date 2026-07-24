"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import type { MarcaState } from "../actions";

type Props = {
  action: (prev: MarcaState, formData: FormData) => Promise<MarcaState>;
  defaults?: { nome?: string; ordem?: number; logo_url?: string | null };
  submitLabel?: string;
};

const inputClass =
  "w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none transition focus:border-brand";

export function MarcaForm({ action, defaults, submitLabel = "Salvar" }: Props) {
  const [state, formAction, pending] = useActionState<MarcaState, FormData>(
    action,
    null,
  );

  return (
    <form action={formAction} className="max-w-lg space-y-5">
      <div>
        <label htmlFor="nome" className="mb-1 block text-sm text-muted">
          Nome da marca
        </label>
        <input
          id="nome"
          name="nome"
          defaultValue={defaults?.nome ?? ""}
          required
          placeholder="Ex: Nike"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="logo" className="mb-1 block text-sm text-muted">
          Logo da marca
        </label>
        {defaults?.logo_url && (
          <div className="mb-2 inline-flex items-center justify-center rounded-lg bg-white/5 p-2">
            <Image
              src={defaults.logo_url}
              alt="Logo atual"
              width={64}
              height={64}
              className="h-16 w-16 object-contain"
            />
          </div>
        )}
        <input
          id="logo"
          name="logo"
          type="file"
          accept="image/*"
          className="block w-full text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-surface-2 file:px-3 file:py-2 file:text-sm file:text-fg hover:file:bg-border"
        />
        <p className="mt-1 text-xs text-muted">
          PNG com fundo transparente fica melhor no carrossel.
          {defaults?.logo_url && " Deixe em branco para manter a atual."}
        </p>
      </div>

      <div>
        <label htmlFor="ordem" className="mb-1 block text-sm text-muted">
          Ordem no carrossel
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
          href="/painel/marcas"
          className="rounded-lg border border-border px-4 py-2.5 text-sm text-muted transition hover:text-fg"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
