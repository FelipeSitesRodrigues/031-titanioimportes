"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type MarcaState = { error: string } | null;

type SupabaseServer = Awaited<ReturnType<typeof createClient>>;

/** Garante que há um usuário logado (defesa em profundidade, além do proxy/RLS). */
async function requireClient(): Promise<SupabaseServer> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");
  return supabase;
}

/** Sobe a logo pro bucket "marcas" e devolve a URL pública. */
async function uploadLogo(
  supabase: SupabaseServer,
  file: File,
): Promise<string> {
  const ext = (file.name.split(".").pop() || "png").toLowerCase();
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("marcas").upload(path, file, {
    contentType: file.type || "image/png",
    upsert: false,
  });
  if (error) throw new Error("Falha no upload da logo: " + error.message);

  const { data } = supabase.storage.from("marcas").getPublicUrl(path);
  return data.publicUrl;
}

export async function createMarca(
  _prev: MarcaState,
  formData: FormData,
): Promise<MarcaState> {
  const supabase = await requireClient();

  const nome = String(formData.get("nome") ?? "").trim();
  const ordem = Number(formData.get("ordem") ?? 0) || 0;
  const file = formData.get("logo") as File | null;

  if (!nome) return { error: "Informe o nome da marca." };

  let logo_url: string | null = null;
  if (file && file.size > 0) {
    try {
      logo_url = await uploadLogo(supabase, file);
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Erro no upload." };
    }
  }

  const { error } = await supabase
    .from("marcas")
    .insert({ nome, ordem, logo_url });
  if (error) return { error: "Erro ao salvar: " + error.message };

  revalidatePath("/painel/marcas");
  redirect("/painel/marcas");
}

export async function updateMarca(
  id: string,
  _prev: MarcaState,
  formData: FormData,
): Promise<MarcaState> {
  const supabase = await requireClient();

  const nome = String(formData.get("nome") ?? "").trim();
  const ordem = Number(formData.get("ordem") ?? 0) || 0;
  const file = formData.get("logo") as File | null;

  if (!nome) return { error: "Informe o nome da marca." };

  const patch: { nome: string; ordem: number; logo_url?: string } = {
    nome,
    ordem,
  };
  if (file && file.size > 0) {
    try {
      patch.logo_url = await uploadLogo(supabase, file);
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Erro no upload." };
    }
  }

  const { error } = await supabase.from("marcas").update(patch).eq("id", id);
  if (error) return { error: "Erro ao salvar: " + error.message };

  revalidatePath("/painel/marcas");
  redirect("/painel/marcas");
}

export async function deleteMarca(id: string) {
  const supabase = await requireClient();
  await supabase.from("marcas").delete().eq("id", id);
  revalidatePath("/painel/marcas");
}
