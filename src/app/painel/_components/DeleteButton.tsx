"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

/**
 * Botão de exclusão reutilizável (marcas, categorias, produtos, fotos).
 * Recebe uma Server Action já com o id "amarrado" (via .bind) e pede confirmação.
 */
export function DeleteButton({
  onDelete,
  label = "Excluir",
  confirmMessage = "Tem certeza? Essa ação não pode ser desfeita.",
}: {
  onDelete: () => Promise<void>;
  label?: string;
  confirmMessage?: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(confirmMessage)) return;
        start(async () => {
          try {
            await onDelete();
            router.refresh();
          } catch {
            alert("Não foi possível concluir a ação. Tente novamente.");
          }
        });
      }}
      className="rounded-md px-3 py-1.5 text-sm text-brand transition hover:bg-brand/10 disabled:opacity-50"
    >
      {pending ? "..." : label}
    </button>
  );
}
