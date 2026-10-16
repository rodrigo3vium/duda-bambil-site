import type { Metadata } from "next";
import { bioConfig } from "@/config/bio.config";
import { findProduto } from "@/utils/bioRouting";
import { ProdutoDetail } from "./ProdutoDetail";

/** Pré-gera as páginas de detalhe de cada produto do catálogo. */
export function generateStaticParams() {
  return bioConfig.produtos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const produto = findProduto(slug, bioConfig.produtos);
  if (!produto) return { title: "Produto não encontrado — Duda Bambil" };
  return {
    title: `${produto.nome} — Duda Bambil`,
    description: produto.promessa,
  };
}

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProdutoDetail slug={slug} />;
}
