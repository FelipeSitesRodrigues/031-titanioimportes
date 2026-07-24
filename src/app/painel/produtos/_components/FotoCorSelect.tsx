"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { updateFotoCor } from "../actions";

/** Seletor para (re)vincular uma foto já enviada a uma cor do produto. */
export function FotoCorSelect({
  fotoId,
  produtoId,
  cor,
  cores,
}: {
  fotoId: string;
  produtoId: string;
  cor: string | null;
  cores: string[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  // Garante que a cor atual apareça na lista mesmo se não estiver nas cores do produto.
  const opcoes = cor && !cores.includes(cor) ? [...cores, cor] : cores;

  return (
    <select
      defaultValue={cor ?? ""}
      disabled={pending}
      aria-label="Cor desta foto"
      onChange={(e) => {
        const valor = e.target.value;
        start(async () => {
          try {
            await updateFotoCor(fotoId, produtoId, valor);
            router.refresh();
          } catch {
            alert("Não foi possível mudar a cor da foto. Tente novamente.");
          }
        });
      }}
      className="mt-1 w-24 rounded border border-border bg-bg px-1.5 py-1 text-xs text-muted outline-none transition focus:border-brand disabled:opacity-50"
    >
      <option value="">Geral</option>
      {opcoes.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}
