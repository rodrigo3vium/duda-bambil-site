import type { Metadata } from "next";
import "./comece.css";

export const metadata: Metadata = {
  title: "Comece por aqui — Duda Bambil",
  description:
    "Descubra o próximo passo — pra cuidar da sua pele ou pra evoluir no seu atendimento. Bate um papo com a assistente da Duda.",
  openGraph: {
    title: "Comece por aqui — Duda Bambil",
    description:
      "Descubra o próximo passo — pra cuidar da sua pele ou pra evoluir no seu atendimento.",
    type: "website",
  },
};

export default function ComeceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
