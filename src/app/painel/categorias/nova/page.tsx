import Link from "next/link";
import { CategoriaForm } from "../_components/CategoriaForm";
import { createCategoria } from "../actions";

export default function NovaCategoriaPage() {
  return (
    <div>
      <Link
        href="/painel/categorias"
        className="text-sm text-muted transition hover:text-fg"
      >
        ← Voltar para categorias
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold">Nova categoria</h1>
      <CategoriaForm action={createCategoria} submitLabel="Criar categoria" />
    </div>
  );
}
