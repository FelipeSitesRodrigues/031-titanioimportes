"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProdutoStatus } from "@/types/database";

export type ProdutoState = { error: string } | null;

type SupabaseServer = Awaited<ReturnType<typeof createClient>>;
type CorInput = { id: string; nome: string };

async function requireClient(): Promise<SupabaseServer> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");
  return supabase;
}

async function uploadFoto(supabase: SupabaseServer, file: File): Promise<string> {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("produtos").upload(path, file, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (error) throw new Error("Falha no upload da foto: " + error.message);
  const { data } = supabase.storage.from("produtos").getPublicUrl(path);
  return data.publicUrl;
}

function filesOf(formData: FormData, name: string): File[] {
  return formData
    .getAll(name)
    .filter((x): x is File => x instanceof File && x.size > 0);
}

function parseCores(raw: FormDataEntryValue | null): CorInput[] {
  if (typeof raw !== "string" || !raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .map((c) => ({
        id: String(c.id ?? ""),
        nome: String(c.nome ?? "").trim(),
      }))
      .filter((c) => c.id && c.nome);
  } catch {
    return [];
  }
}

function parseTamanhos(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== "string" || !raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return Array.from(
      new Set(arr.map((t) => String(t).trim()).filter(Boolean)),
    );
  } catch {
    return [];
  }
}

function parseFields(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim() || null;
  const marca_id = String(formData.get("marca_id") ?? "") || null;
  const categoria_id = String(formData.get("categoria_id") ?? "") || null;
  const preco = Number(String(formData.get("preco") ?? "").replace(",", "."));
  const promoRaw = String(formData.get("preco_promocional") ?? "")
    .replace(",", ".")
    .trim();
  const preco_promocional = promoRaw ? Number(promoRaw) : null;
  const destaque = formData.get("destaque") === "on";
  const statusRaw = String(formData.get("status") ?? "ativo");
  const status = (
    ["ativo", "rascunho", "esgotado"].includes(statusRaw) ? statusRaw : "ativo"
  ) as ProdutoStatus;

  return {
    nome,
    descricao,
    marca_id,
    categoria_id,
    preco,
    preco_promocional,
    destaque,
    status,
  };
}

function validate(f: ReturnType<typeof parseFields>): string | null {
  if (!f.nome) return "Informe o nome do produto.";
  if (!f.preco || f.preco <= 0) return "Informe um preço válido.";
  if (f.preco_promocional != null && f.preco_promocional >= f.preco)
    return "O preço promocional deve ser menor que o preço normal.";
  return null;
}

/** Sobe as fotos: as de cada cor (name `fotos_cor_<id>`) e as gerais (`fotos_geral`). */
async function salvarFotos(
  supabase: SupabaseServer,
  produtoId: string,
  cores: CorInput[],
  formData: FormData,
  ordemInicial: number,
): Promise<void> {
  let ordem = ordemInicial;
  for (const c of cores) {
    for (const file of filesOf(formData, `fotos_cor_${c.id}`)) {
      const url = await uploadFoto(supabase, file);
      const { error } = await supabase
        .from("produto_fotos")
        .insert({ produto_id: produtoId, url, ordem: ordem++, cor: c.nome });
      if (error) throw new Error("Erro ao salvar foto: " + error.message);
    }
  }
  for (const file of filesOf(formData, "fotos_geral")) {
    const url = await uploadFoto(supabase, file);
    const { error } = await supabase
      .from("produto_fotos")
      .insert({ produto_id: produtoId, url, ordem: ordem++, cor: null });
    if (error) throw new Error("Erro ao salvar foto: " + error.message);
  }
}

export async function createProduto(
  _prev: ProdutoState,
  formData: FormData,
): Promise<ProdutoState> {
  const supabase = await requireClient();
  const f = parseFields(formData);
  const err = validate(f);
  if (err) return { error: err };

  const cores = parseCores(formData.get("cores"));
  const tamanhos = parseTamanhos(formData.get("tamanhos"));

  const { data: produto, error } = await supabase
    .from("produtos")
    .insert({ ...f, cores: cores.map((c) => c.nome), tamanhos })
    .select("id")
    .single();
  if (error || !produto) {
    return { error: "Erro ao salvar: " + (error?.message ?? "") };
  }

  try {
    await salvarFotos(supabase, produto.id, cores, formData, 0);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro no upload de foto." };
  }

  revalidatePath("/painel/produtos");
  redirect("/painel/produtos");
}

export async function updateProduto(
  id: string,
  _prev: ProdutoState,
  formData: FormData,
): Promise<ProdutoState> {
  const supabase = await requireClient();
  const f = parseFields(formData);
  const err = validate(f);
  if (err) return { error: err };

  const cores = parseCores(formData.get("cores"));
  const tamanhos = parseTamanhos(formData.get("tamanhos"));

  const { error } = await supabase
    .from("produtos")
    .update({ ...f, cores: cores.map((c) => c.nome), tamanhos })
    .eq("id", id);
  if (error) return { error: "Erro ao salvar: " + error.message };

  try {
    const { data: ultimas } = await supabase
      .from("produto_fotos")
      .select("ordem")
      .eq("produto_id", id)
      .order("ordem", { ascending: false })
      .limit(1);
    const inicio = ultimas && ultimas.length ? ultimas[0].ordem + 1 : 0;
    await salvarFotos(supabase, id, cores, formData, inicio);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro no upload de foto." };
  }

  revalidatePath("/painel/produtos");
  redirect("/painel/produtos");
}

export async function deleteProduto(id: string) {
  const supabase = await requireClient();
  // variacoes e produto_fotos somem por ON DELETE CASCADE
  await supabase.from("produtos").delete().eq("id", id);
  revalidatePath("/painel/produtos");
}

export async function deleteFoto(fotoId: string, produtoId: string) {
  const supabase = await requireClient();
  const { error } = await supabase
    .from("produto_fotos")
    .delete()
    .eq("id", fotoId);
  if (error) throw new Error(error.message);
  revalidatePath("/painel/produtos/" + produtoId);
}

/** Muda a cor à qual uma foto existente pertence ("" = geral). */
export async function updateFotoCor(
  fotoId: string,
  produtoId: string,
  cor: string,
) {
  const supabase = await requireClient();
  const { error } = await supabase
    .from("produto_fotos")
    .update({ cor: cor.trim() || null })
    .eq("id", fotoId);
  if (error) throw new Error(error.message);
  revalidatePath("/painel/produtos/" + produtoId);
}
