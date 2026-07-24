import type { Produto } from "@/types/database";

/** Produto com marca e fotos embutidas (join do Supabase). */
export type ProdutoComRelacoes = Produto & {
  marcas: { nome: string } | null;
  produto_fotos: { url: string; ordem: number }[];
};

/** Select padrão para trazer produto + marca + fotos numa query só. */
export const PRODUTO_SELECT = "*, marcas(nome), produto_fotos(url, ordem)";

/** Foto de capa = a de menor `ordem`. */
export function capaDe(
  fotos: { url: string; ordem: number }[] | null | undefined,
): string | null {
  if (!fotos?.length) return null;
  return [...fotos].sort((a, b) => a.ordem - b.ordem)[0].url;
}
