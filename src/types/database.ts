// Tipos das tabelas do Supabase (Titânio Importes).
// Espelham o schema criado no SQL Editor. Mantê-los em sincronia com o banco.

export type Marca = {
  id: string;
  nome: string;
  logo_url: string | null;
  ordem: number;
  criado_em: string;
};

export type Categoria = {
  id: string;
  nome: string;
  imagem_url: string | null;
  ordem: number;
  criado_em: string;
};

export type ProdutoStatus = "ativo" | "rascunho" | "esgotado";

export type Produto = {
  id: string;
  nome: string;
  descricao: string | null;
  marca_id: string | null;
  categoria_id: string | null;
  preco: number;
  preco_promocional: number | null;
  destaque: boolean;
  status: ProdutoStatus;
  cores: string[];
  tamanhos: string[];
  criado_em: string;
};

export type ProdutoFoto = {
  id: string;
  produto_id: string;
  url: string;
  ordem: number;
  /** Cor à qual esta foto pertence. null = vale para todas as cores. */
  cor: string | null;
};

export type Variacao = {
  id: string;
  produto_id: string;
  tamanho: string | null;
  cor: string | null;
  estoque: number;
  sku: string | null;
};
