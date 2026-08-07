# CLAUDE.md

Guia para o Claude Code (e humanos) trabalharem neste repositório.

## Visão geral

Site institucional da **Duda Bambil** — esteticista especialista em **gerenciamento de pele**. O site atende dois públicos: **pacientes** (agendamento de avaliação) e **profissionais** (cursos e guias). Posicionamento: _"Onde saúde e beleza se completam em equilíbrio."_

Publicado na **Vercel**.

## Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19
- **Linguagem:** TypeScript
- **Estilização:** CSS puro + **CSS Modules** no site principal. A rota `/comece` (Direcionador) usa **Tailwind + shadcn**, escopado só a ela (ver Convenções de estilização)
- **Fontes:** `next/font/google` — Playfair Display (serif) e Inter (sans), expostas como variáveis CSS `--font-serif` e `--font-sans` (ver [app/layout.tsx](app/layout.tsx))
- **Deploy:** Vercel ([vercel.json](vercel.json))
- **Pacotes:** npm

## Comandos

```bash
npm install        # instala dependências
npm run dev        # dev server (http://localhost:3000)
npm run build      # build de produção
npm run start      # serve o build de produção
npm run lint       # eslint (flat config em eslint.config.mjs — next/core-web-vitals)
npm run typecheck  # tsc --noEmit
npm test           # vitest run (suíte em tests/)
npm run test:watch # vitest em watch
```

## Estrutura

```
app/
  layout.tsx                    # layout raiz: fontes, <html lang="pt-BR">, metadata/OpenGraph
  page.tsx                      # Home — usa classes globais (.header, .hero, ...) de globals.css
  globals.css                   # estilos globais + estilos da Home
  gerenciamento-de-pele/        # Curso de Gerenciamento de Pele (público: profissionais)
    page.tsx
    styles.module.css
  limpeza-de-pele/              # Curso de Limpeza de Pele — LP de venda (público: profissionais)
    page.tsx
    styles.module.css
  mentoria/                     # Mentoria R$4.000 — página de APLICAÇÃO (público: profissionais)
    page.tsx                    # LP; form sempre no fim. Cabeçalho lista os placeholders
    AplicacaoForm.tsx           # form multi-step (3 telas), client component
    aplicacao.ts                # campos + validação + normalização (client E server)
    config.ts                   # MENTORIA_VIDEO_URL
    styles.module.css
  guia-skin-care/               # Guia Editável de Skincare
    layout.tsx                  # layout próprio desta rota
    page.tsx
    styles.css                  # CSS co-locado (NÃO é module)
  guia-primeiros-passos/        # Guia + captura de lead
    page.tsx
    LeadForm.tsx                # formulário de lead (componente)
    styles.module.css
  comece/                       # Direcionador (link-na-bio + agente de IA) — Tailwind ESCOPADO
    layout.tsx                  # importa comece.css (só aqui) + metadata
    comece.css                  # @tailwind + tokens dark/dourado (não vaza pro resto do site)
    page.tsx                    # renderiza <BioPage/>
    produto/[slug]/             # detalhe de cada produto (SSG)
  api/
    chat/route.ts               # agente de IA (Edge, streaming SSE, OpenAI) — key PENDENTE
    lead/route.ts               # captura de lead → webhook (planilha) OU log
    mentoria/route.ts           # aplicação da mentoria: revalida e encaminha (retry). NÃO classifica
components/                     # compartilhado do /comece: bio/* + ui/{button,input}
config/bio.config.ts            # TODO o conteúdo do /comece (marca, produtos, prompt do agente)
utils/  hooks/  lib/            # helpers do /comece (bioChat, bioLead, useUTMParams, cn, ...)
tailwind.config.ts              # Tailwind escopado (content: só app/comece + components)
postcss.config.mjs              # tailwind + autoprefixer
next.config.mjs                 # config Next (vazio por enquanto)
vercel.json                     # framework: nextjs
```

> Detalhes do Direcionador `/comece` (arquitetura, env vars, pendências): ver [docs/comece-direcionador.md](docs/comece-direcionador.md).

### Rotas

| Rota | Página | Público |
|------|--------|---------|
| `/` | Home | Pacientes + profissionais |
| `/gerenciamento-de-pele` | Curso de Gerenciamento de Pele | Profissionais |
| `/limpeza-de-pele` | Curso de Limpeza de Pele (LP de venda) | Profissionais |
| `/guia-skin-care` | Guia Editável de Skincare | Geral |
| `/guia-primeiros-passos` | Guia + captura de lead | Geral |
| `/mentoria` | Aplicação da Mentoria (R$4.000) — coleta a aplicação; **triagem é manual, feita pela equipe** | Profissionais |
| `/comece` | Direcionador — link-na-bio + agente de IA (captura de lead) | Pacientes + profissionais |
| `/comece/produto/[slug]` | Detalhe de um produto/caminho do catálogo | Geral |

## Convenções de estilização ⚠️

A estilização hoje é **mista** — fique atento a qual padrão cada página usa:

- **Home (`/`)**: classes globais escritas à mão em `app/globals.css` (ex.: `.header`, `.hero`, `.container`).
- **CSS Modules** (`styles.module.css`): usado em `gerenciamento-de-pele` e `guia-primeiros-passos`. Importe como `import styles from "./styles.module.css"` e use `className={styles.nomeDaClasse}`.
- **CSS co-locado** (`guia-skin-care/styles.css`): CSS comum, não-module.
- **Tailwind + shadcn** (`/comece` e `components/`): SÓ no Direcionador. O Tailwind é **escopado** — `content` no `tailwind.config.ts` varre só `app/comece/**` e `components/**`, e o CSS (com preflight) é importado apenas em `app/comece/layout.tsx`. Por isso **não afeta** as páginas em CSS puro/Modules. Ao mexer no `/comece`, use classes Tailwind + os tokens de `comece.css`; **não** traga Tailwind pro resto do site sem falar com o Rodrigo.

Ao editar uma página, **siga o padrão que ela já usa**. Reutilize as variáveis de fonte (`var(--font-serif)`, `var(--font-sans)`).

## Convenções gerais

- **Idioma:** conteúdo em **pt-BR**.
- **Server vs Client:** Server Components por padrão. Use `"use client"` só quando precisar de interatividade/estado (ex.: `LeadForm.tsx`).
- **Componentes:** PascalCase em `.tsx`. Hoje componentes ficam co-locados na pasta da rota (ex.: `LeadForm.tsx`); não há `components/` compartilhado ainda.
- **SEO:** defina `metadata` por rota. O `layout.tsx` raiz já configura title/description/OpenGraph.
- **Links/placeholders:** o WhatsApp comercial da Duda (**+55 67 99856-8757** → `WHATSAPP_NUMERO` em [app/page.tsx](app/page.tsx)) já está preenchido. Ainda falta o link da **Imersão Wonderskin** (`LINKS.wonderskin` = `"#"`) e o vídeo da mentoria (`MENTORIA_VIDEO_URL` em [app/mentoria/config.ts](app/mentoria/config.ts)). Substituir pelo valor real antes de publicar mudanças relacionadas.
- **Testes:** suíte em [tests/](tests/) rodando no **Vitest** (jsdom + Testing Library). Lógica de negócio nova (validação, route handler) entra com teste. Config em [vitest.config.ts](vitest.config.ts).
- **Triagem da mentoria é humana:** a `/mentoria` **não** pontua, não classifica e não bifurca o desfecho — toda aplicação válida vai igual pra planilha e a equipe decide. Decisão do Rodrigo em 06/08/2026, que substituiu uma régua de score automática. Se pedirem "qualificar o lead", isso é trabalho da equipe, não do código.

## Notas para o Claude

- Confirme requisitos e design (skill de brainstorming) antes de criar novas páginas ou features.
- Mantenha consistência com o padrão de CSS da página que está editando (ver seção de estilização).
- Rode `npm run build` antes de considerar uma tarefa concluída; valide visualmente no `npm run dev` quando mexer em UI.
- Conteúdo é em português — preserve tom e idioma.
