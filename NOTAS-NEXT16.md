# Notas Next.js 16 — regras deste projeto (Titânio Importes)

> Extraídas dos guias oficiais em `node_modules/next/dist/docs`. Este projeto usa
> **Next 16 + React 19 + Tailwind v4 + Supabase (@supabase/ssr)**. NÃO usar padrões
> de Next 14/15 de memória — eles quebram aqui.

## NÃO usar (padrão antigo que quebra no 16)
- `cookies()`, `headers()`, `params`, `searchParams` **síncronos** → agora TODOS são `await` (Promises).
- `middleware.ts` → renomeado para **`proxy.ts`** (`export function proxy(req)`; runtime nodejs, sem edge).
- `images.domains` → `images.remotePatterns`.
- Tailwind `@tailwind base/components/utilities` → **`@import "tailwindcss"`** (v4, config em CSS via `@theme`).
- `useFormState` → **`useActionState`** (importado de `react`).
- `revalidateTag('x')` sozinho → agora exige perfil: `revalidateTag('x', 'max')`.
- `<Image priority>` deprecado.

## Padrões corretos que seguimos
- **Server Component** busca dados direto do Supabase (async) — catálogo, dashboard.
- Rota dinâmica: `params: Promise<{ slug: string }>` → `const { slug } = await params`.
- **Server Action**: arquivo com `'use server'` no topo; `<form action={fn}>`. SEMPRE
  reautenticar + validar DENTRO da action (é um endpoint POST público).
- **Supabase**: `lib/supabase/client.ts` (browser), `lib/supabase/server.ts` (usa `await cookies()`),
  `src/proxy.ts` renova a sessão a cada request.
- **Segurança em camadas**: RLS no Postgres (camada final) + checagem na action/layout.
  Esconder botão na UI NÃO é segurança.

## Cache
- Cache Components (`cacheComponents: true`) **NÃO** ativado (mantido simples). Páginas
  que usam `cookies()` já são dinâmicas automaticamente. Otimizamos cache depois, se precisar.

## Referência completa
Cheat-sheets detalhados (6 áreas) no output do workflow `estudar-next16` desta sessão.
