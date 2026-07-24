import Link from "next/link";
import { MarcaForm } from "../_components/MarcaForm";
import { createMarca } from "../actions";

export default function NovaMarcaPage() {
  return (
    <div>
      <Link
        href="/painel/marcas"
        className="text-sm text-muted transition hover:text-fg"
      >
        ← Voltar para marcas
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold">Nova marca</h1>
      <MarcaForm action={createMarca} submitLabel="Criar marca" />
    </div>
  );
}
