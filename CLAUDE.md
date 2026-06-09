# CLAUDE.md

Guia para o Claude Code (e humanos) trabalharem neste repositório.

## Visão geral

Site institucional da **Duda Bambil** — esteticista especialista em **gerenciamento de pele**. O site atende dois públicos: **pacientes** (agendamento de avaliação) e **profissionais** (cursos e guias). Posicionamento: _"Onde saúde e beleza se completam em equilíbrio."_

Publicado na **Vercel**.

## Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19
- **Linguagem:** TypeScript
- **Estilização:** CSS puro + **CSS Modules** (sem Tailwind, sem UI lib)
- **Fontes:** `next/font/google` — Playfair Display (serif) e Inter (sans), expostas como variáveis CSS `--font-serif` e `--font-sans` (ver [app/layout.tsx](app/layout.tsx))
- **Deploy:** Vercel ([vercel.json](vercel.json))
- **Pacotes:** npm

## Comandos

```bash
npm install        # instala dependências
npm run dev        # dev server (http://localhost:3000)
npm run build      # build de produção
npm run start      # serve o build de produção
npm run lint       # next lint
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
  guia-skin-care/               # Guia Editável de Skincare
    layout.tsx                  # layout próprio desta rota
    page.tsx
    styles.css                  # CSS co-locado (NÃO é module)
  guia-primeiros-passos/        # Guia + captura de lead
    page.tsx
    LeadForm.tsx                # formulário de lead (componente)
    styles.module.css
next.config.mjs                 # config Next (vazio por enquanto)
vercel.json                     # framework: nextjs
```

### Rotas

| Rota | Página | Público |
|------|--------|---------|
| `/` | Home | Pacientes + profissionais |
| `/gerenciamento-de-pele` | Curso de Gerenciamento de Pele | Profissionais |
| `/guia-skin-care` | Guia Editável de Skincare | Geral |
| `/guia-primeiros-passos` | Guia + captura de lead | Geral |

## Convenções de estilização ⚠️

A estilização hoje é **mista** — fique atento a qual padrão cada página usa:

- **Home (`/`)**: classes globais escritas à mão em `app/globals.css` (ex.: `.header`, `.hero`, `.container`).
- **CSS Modules** (`styles.module.css`): usado em `gerenciamento-de-pele` e `guia-primeiros-passos`. Importe como `import styles from "./styles.module.css"` e use `className={styles.nomeDaClasse}`.
- **CSS co-locado** (`guia-skin-care/styles.css`): CSS comum, não-module.

Ao editar uma página, **siga o padrão que ela já usa**. Reutilize as variáveis de fonte (`var(--font-serif)`, `var(--font-sans)`).

## Convenções gerais

- **Idioma:** conteúdo em **pt-BR**.
- **Server vs Client:** Server Components por padrão. Use `"use client"` só quando precisar de interatividade/estado (ex.: `LeadForm.tsx`).
- **Componentes:** PascalCase em `.tsx`. Hoje componentes ficam co-locados na pasta da rota (ex.: `LeadForm.tsx`); não há `components/` compartilhado ainda.
- **SEO:** defina `metadata` por rota. O `layout.tsx` raiz já configura title/description/OpenGraph.
- **Links/placeholders:** há `// TODO` em [app/page.tsx](app/page.tsx) (`LINKS`) com URLs a preencher — WhatsApp de agendamento, link da Imersão Wonderskin, WhatsApp de contato. Substituir pelos valores reais antes de publicar mudanças relacionadas.

## Notas para o Claude

- Confirme requisitos e design (skill de brainstorming) antes de criar novas páginas ou features.
- Mantenha consistência com o padrão de CSS da página que está editando (ver seção de estilização).
- Rode `npm run build` antes de considerar uma tarefa concluída; valide visualmente no `npm run dev` quando mexer em UI.
- Conteúdo é em português — preserve tom e idioma.
