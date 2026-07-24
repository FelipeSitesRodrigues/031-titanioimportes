// Configuração central da loja. Placeholders marcados com TODO — trocar pelos dados reais.

export const site = {
  nome: "Titânio Importes",
  tagline: "O mundo, importado pra você.",

  // Banner do topo do catálogo — DESKTOP (faixa larga). Recomendado: 1920×600.
  bannerCatalogo: "/banner-catalogo.jpg" as string | null,
  // Banner do catálogo no MOBILE (retrato). Recomendado: 1080×1350 (4:5).
  bannerCatalogoMobile: null as string | null,

  // WhatsApp da Titânio (só dígitos: 55 + DDD + número)
  whatsapp: "5521988739397",

  instagram: "https://instagram.com/titanioimportes",

  fundador: {
    nome: "Alex Sander",
    cargo: "Fundador",
    // TODO: bio real do Alex (2–3 linhas)
    bio: "Comecei a Titânio pra resolver um problema que eu mesmo tinha: achar importado original, sem cair em réplica nem pagar o dobro no intermediário. Hoje trago as peças mais procuradas direto da fonte — e importo sob demanda o que o cliente pedir.",
    foto: "/alex.jpg" as string | null,
  },

  diferenciais: [
    {
      titulo: "100% originais",
      texto:
        "Cada peça é autêntica e conferida. Nada de réplica — o que chega até você é o produto de verdade.",
    },
    {
      titulo: "Curadoria de verdade",
      texto:
        "Selecionamos só o que tem procura e qualidade. Streetwear, tênis e acessórios que valem a pena.",
    },
    {
      titulo: "Importação sob demanda",
      texto:
        "Achou algo que não está na loja? A gente busca lá fora e traz pra você.",
    },
    {
      titulo: "Direto da fonte",
      texto:
        "Sem intermediário inflando o preço. Você paga pelo produto, não pela cadeia de revenda.",
    },
  ],
};

/** Monta o link do WhatsApp com mensagem pré-preenchida. */
export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Formata número como moeda brasileira. */
export const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
