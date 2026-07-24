import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy-session";

/**
 * `proxy.ts` é o substituto do antigo `middleware.ts` no Next 16.
 * Roda em runtime Node.js e renova a sessão do Supabase em cada request.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Roda em todas as rotas, exceto arquivos estáticos e imagens:
     * - _next/static, _next/image
     * - favicon.ico e arquivos de imagem soltos
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
