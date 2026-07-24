"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { ProdutoState } from "../actions";

type Option = { id: string; nome: string };
type CorBloco = { id: string; nome: string };

type Props = {
  action: (prev: ProdutoState, formData: FormData) => Promise<ProdutoState>;
  marcas: Option[];
  categorias: Option[];
  defaults?: {
    nome?: string;
    descricao?: string | null;
    marca_id?: string | null;
    categoria_id?: string | null;
    preco?: number;
    preco_promocional?: number | null;
    destaque?: boolean;
    status?: string;
    cores?: string[];
    tamanhos?: string[];
  };
  submitLabel?: string;
};

const inputClass =
  "w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none transition focus:border-brand";

const fileClass =
  "block w-full text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-surface-2 file:px-3 file:py-2 file:text-sm file:text-fg hover:file:bg-border";

const TAMANHOS_ROUPA = ["PP", "P", "M", "G", "GG"];
const TAMANHOS_TENIS = ["35", "36", "37", "38", "39", "40", "41", "42", "43"];

function novoId() {
  return crypto.randomUUID();
}

export function ProdutoForm({
  action,
  marcas,
  categorias,
  defaults,
  submitLabel = "Salvar",
}: Props) {
  const [state, formAction, pending] = useActionState<ProdutoState, FormData>(
    action,
    null,
  );

  const [cores, setCores] = useState<CorBloco[]>(
    (defaults?.cores ?? []).map((nome) => ({ id: novoId(), nome })),
  );
  const [tamanhos, setTamanhos] = useState<string[]>(defaults?.tamanhos ?? []);
  const [tamCustom, setTamCustom] = useState("");
  // Previews por chave (id da cor, ou "geral")
  const [previews, setPreviews] = useState<Record<string, string[]>>({});

  function addCor() {
    setCores((c) => [...c, { id: novoId(), nome: "" }]);
  }
  function removeCor(id: string) {
    setCores((c) => c.filter((x) => x.id !== id));
    setPreviews((p) => {
      const { [id]: _drop, ...rest } = p;
      return rest;
    });
  }
  function setCorNome(id: string, nome: string) {
    setCores((c) => c.map((x) => (x.id === id ? { ...x, nome } : x)));
  }

  function onFiles(key: string, e: React.ChangeEvent<HTMLInputElement>) {
    setPreviews((prev) => {
      prev[key]?.forEach(URL.revokeObjectURL);
      const urls = Array.from(e.target.files ?? []).map((f) =>
        URL.createObjectURL(f),
      );
      return { ...prev, [key]: urls };
    });
  }

  function toggleTamanho(t: string) {
    setTamanhos((arr) =>
      arr.includes(t) ? arr.filter((x) => x !== t) : [...arr, t],
    );
  }
  function addTamCustom() {
    const t = tamCustom.trim();
    if (t && !tamanhos.includes(t)) setTamanhos((arr) => [...arr, t]);
    setTamCustom("");
  }

  const coresValidas = cores
    .filter((c) => c.nome.trim())
    .map((c) => ({ id: c.id, nome: c.nome.trim() }));

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <input type="hidden" name="cores" value={JSON.stringify(coresValidas)} />
      <input type="hidden" name="tamanhos" value={JSON.stringify(tamanhos)} />

      {/* Nome / descrição */}
      <div>
        <label htmlFor="nome" className="mb-1 block text-sm text-muted">
          Nome do produto
        </label>
        <input
          id="nome"
          name="nome"
          defaultValue={defaults?.nome ?? ""}
          required
          placeholder="Ex: Tênis Nike Air Max"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="descricao" className="mb-1 block text-sm text-muted">
          Descrição
        </label>
        <textarea
          id="descricao"
          name="descricao"
          defaultValue={defaults?.descricao ?? ""}
          rows={4}
          placeholder="Detalhes, material, procedência..."
          className={inputClass}
        />
      </div>

      {/* Preços */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="preco" className="mb-1 block text-sm text-muted">
            Preço (R$)
          </label>
          <input
            id="preco"
            name="preco"
            type="number"
            step="0.01"
            min="0"
            defaultValue={defaults?.preco ?? ""}
            required
            placeholder="299.90"
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="preco_promocional"
            className="mb-1 block text-sm text-muted"
          >
            Preço promocional (opcional)
          </label>
          <input
            id="preco_promocional"
            name="preco_promocional"
            type="number"
            step="0.01"
            min="0"
            defaultValue={defaults?.preco_promocional ?? ""}
            placeholder="199.90"
            className={inputClass}
          />
        </div>
      </div>

      {/* Marca / categoria */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="marca_id" className="mb-1 block text-sm text-muted">
            Marca
          </label>
          <select
            id="marca_id"
            name="marca_id"
            defaultValue={defaults?.marca_id ?? ""}
            className={inputClass}
          >
            <option value="">Sem marca</option>
            {marcas.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="categoria_id"
            className="mb-1 block text-sm text-muted"
          >
            Categoria
          </label>
          <select
            id="categoria_id"
            name="categoria_id"
            defaultValue={defaults?.categoria_id ?? ""}
            className={inputClass}
          >
            <option value="">Sem categoria</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status / destaque */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="status" className="mb-1 block text-sm text-muted">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={defaults?.status ?? "ativo"}
            className={inputClass}
          >
            <option value="ativo">Ativo (aparece na loja)</option>
            <option value="rascunho">Rascunho (escondido)</option>
            <option value="esgotado">Esgotado</option>
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="destaque"
              defaultChecked={defaults?.destaque ?? false}
              className="h-4 w-4 accent-brand"
            />
            Destacar na página inicial
          </label>
        </div>
      </div>

      {/* ── CORES (com fotos por cor) ─────────────────────── */}
      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Cores</h3>
          <button
            type="button"
            onClick={addCor}
            className="rounded-md border border-border px-3 py-1.5 text-sm text-brand transition hover:bg-brand/10"
          >
            + Adicionar cor
          </button>
        </div>
        <p className="mb-3 text-xs text-muted">
          Crie um bloco por cor e suba as fotos de cada uma. No site, o cliente
          clica na cor e vê as fotos dela.
        </p>

        {cores.length === 0 ? (
          <p className="text-xs text-muted">
            Nenhuma cor. Se o produto não tem variação de cor, pule e use as
            “fotos gerais” abaixo.
          </p>
        ) : (
          <div className="space-y-3">
            {cores.map((c) => (
              <div key={c.id} className="rounded-lg border border-border bg-bg p-3">
                <div className="flex items-center gap-2">
                  <input
                    value={c.nome}
                    onChange={(e) => setCorNome(c.id, e.target.value)}
                    placeholder="Nome da cor (ex: Azul claro)"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => removeCor(c.id)}
                    aria-label="Remover cor"
                    className="shrink-0 px-2 text-muted transition hover:text-brand"
                  >
                    ✕
                  </button>
                </div>
                <div className="mt-3">
                  <label className="mb-1 block text-xs text-muted">
                    Fotos desta cor {defaults ? "(adicionar novas)" : ""}
                  </label>
                  <input
                    type="file"
                    name={`fotos_cor_${c.id}`}
                    accept="image/*"
                    multiple
                    onChange={(e) => onFiles(c.id, e)}
                    className={fileClass}
                  />
                  {previews[c.id]?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {previews[c.id].map((src, i) => (
                        <div
                          key={i}
                          className="h-16 w-16 overflow-hidden rounded-lg border border-border"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src}
                            alt={`Foto ${i + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── TAMANHOS ──────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-surface p-4">
        <h3 className="text-sm font-semibold">Tamanhos disponíveis</h3>
        <p className="mb-3 text-xs text-muted">
          Marque os tamanhos que o produto tem.
        </p>

        <div className="space-y-4">
          <div>
            <div className="mb-2 font-mono text-xs uppercase tracking-widest text-muted">
              Roupas
            </div>
            <div className="flex flex-wrap gap-2">
              {TAMANHOS_ROUPA.map((t) => (
                <TamanhoChip
                  key={t}
                  t={t}
                  on={tamanhos.includes(t)}
                  toggle={toggleTamanho}
                />
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 font-mono text-xs uppercase tracking-widest text-muted">
              Tênis
            </div>
            <div className="flex flex-wrap gap-2">
              {TAMANHOS_TENIS.map((t) => (
                <TamanhoChip
                  key={t}
                  t={t}
                  on={tamanhos.includes(t)}
                  toggle={toggleTamanho}
                />
              ))}
            </div>
          </div>

          {/* Customizado */}
          <div>
            <div className="mb-2 font-mono text-xs uppercase tracking-widest text-muted">
              Outro
            </div>
            <div className="flex gap-2">
              <input
                value={tamCustom}
                onChange={(e) => setTamCustom(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTamCustom();
                  }
                }}
                placeholder="Ex: Único, 44, 46..."
                className={inputClass}
              />
              <button
                type="button"
                onClick={addTamCustom}
                className="shrink-0 rounded-lg border border-border px-4 text-sm text-brand transition hover:bg-brand/10"
              >
                Adicionar
              </button>
            </div>
            {tamanhos.some(
              (t) => !TAMANHOS_ROUPA.includes(t) && !TAMANHOS_TENIS.includes(t),
            ) && (
              <div className="mt-2 flex flex-wrap gap-2">
                {tamanhos
                  .filter(
                    (t) =>
                      !TAMANHOS_ROUPA.includes(t) &&
                      !TAMANHOS_TENIS.includes(t),
                  )
                  .map((t) => (
                    <TamanhoChip key={t} t={t} on toggle={toggleTamanho} />
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── FOTOS GERAIS ──────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-surface p-4">
        <h3 className="text-sm font-semibold">
          Fotos gerais {defaults ? "(adicionar novas)" : ""}
        </h3>
        <p className="mb-3 text-xs text-muted">
          Fotos que aparecem em qualquer cor (etiqueta, detalhe, produto sem
          variação de cor). A primeira foto do produto vira a capa.
        </p>
        <input
          type="file"
          name="fotos_geral"
          accept="image/*"
          multiple
          onChange={(e) => onFiles("geral", e)}
          className={fileClass}
        />
        {previews["geral"]?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {previews["geral"].map((src, i) => (
              <div
                key={i}
                className="h-16 w-16 overflow-hidden rounded-lg border border-border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Foto ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
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
          href="/painel/produtos"
          className="rounded-lg border border-border px-4 py-2.5 text-sm text-muted transition hover:text-fg"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}

function TamanhoChip({
  t,
  on,
  toggle,
}: {
  t: string;
  on: boolean;
  toggle: (t: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => toggle(t)}
      className={`min-w-11 rounded-lg border px-3 py-2 text-sm transition ${
        on
          ? "border-brand bg-brand/10 text-fg"
          : "border-border text-muted hover:border-fg hover:text-fg"
      }`}
    >
      {t}
    </button>
  );
}
