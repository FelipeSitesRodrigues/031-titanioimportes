"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type CategoriaState = { error: string } | null;

async function requireClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");
  return supabase;
}

export async function createCategoria(
  _prev: CategoriaState,
  formData: FormData,
): Promise<CategoriaState> {
  const supabase = await requireClient();

  const nome = String(formData.get("nome") ?? "").trim();
  const ordem = Number(formData.get("ordem") ?? 0) || 0;

  if (!nome) return { error: "Informe o nome da categoria." };

  const { error } = await supabase.from("categorias").insert({ nome, ordem });
  if (error) return { error: "Erro ao salvar: " + error.message };

  revalidatePath("/painel/categorias");
  redirect("/painel/categorias");
}

export async function updateCategoria(
  id: string,
  _prev: CategoriaState,
  formData: FormData,
): Promise<CategoriaState> {
  const supabase = await requireClient();

  const nome = String(formData.get("nome") ?? "").trim();
  const ordem = Number(formData.get("ordem") ?? 0) || 0;

  if (!nome) return { error: "Informe o nome da categoria." };

  const { error } = await supabase
    .from("categorias")
    .update({ nome, ordem })
    .eq("id", id);
  if (error) return { error: "Erro ao salvar: " + error.message };

  revalidatePath("/painel/categorias");
  redirect("/painel/categorias");
}

export async function deleteCategoria(id: string) {
  const supabase = await requireClient();
  await supabase.from("categorias").delete().eq("id", id);
  revalidatePath("/painel/categorias");
}
