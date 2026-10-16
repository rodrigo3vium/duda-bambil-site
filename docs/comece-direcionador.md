# Direcionador (`/comece`) — link-na-bio inteligente da Duda

> Minisite page-first que substitui o link-na-bio tradicional por uma página de marca
> (perfil, redes, vitrine, agendamento) **+ um agente de IA conversacional**: a visitante
> bate papo com a "assistente da Duda", que entende o momento dela e a **encaminha pro
> caminho certo**, capturando o contato (lead). Replica do minisite da Giulia Salvatore
> (`giulia-salvatore-site`, rota `/comece`), adaptado pra Duda.

**Função única da IA: captura de lead.** A IA não fecha venda nem dá diagnóstico de pele —
ela acolhe, identifica o perfil e captura o contato pro caminho certo:

- **PACIENTE** (quer cuidar da própria pele) → **avaliação de pele com a Duda** (tool `encaminhar_reuniao`).
- **PROFISSIONAL** (esteticista/etc. querendo evoluir) → curso, guia, imersão ou guia gratuito (tool `recomendar_entrada`).

Em ambos os caminhos, o desfecho é o mesmo: **formulário digitado captura nome/WhatsApp/e-mail**
(a IA nunca parseia contato do chat) e revela o próximo passo (checkout Kiwify, LP do guia, ou
agendamento).

---

## Onde mexer (config-driven)

Quase tudo de conteúdo vive em **[`config/bio.config.ts`](../config/bio.config.ts)**:

| Bloco | O que controla |
|---|---|
| `brand` | Nome, headline do CTA, subtítulo, `foto` (path em `/public`), `fotoAlt`. |
| `agente.saudacao` | Primeira fala da assistente. |
| `agente.systemPromptTemplate` | Personalidade + regras + fluxo. Placeholders `{{CATALOGO_DE_PRODUTOS}}`, `{{PRODUTO_DE_ENTRADA}}`, `{{LINK_PRODUTO_DE_ENTRADA}}`, `{{CAMINHO_PACIENTE}}` são preenchidos **no servidor** (`app/api/chat/systemPrompt.ts`). |
| `agente.entryProductSlugs[]` | Slugs do perfil PROFISSIONAL — enum da tool `recomendar_entrada`. |
| `agente.meetingProductSlug` | Slug do perfil PACIENTE (`avaliacao`) — tool `encaminhar_reuniao`. |
| `produtos[]` | A vitrine. `{ slug, nome, promessa, preco, precoDe?, checkoutUrl, badge?, detalhe[], oQueRecebe?[], ctaLabel? }`. `checkoutUrl` vazio → card manda pro detalhe. |
| `canais` | Ícones sociais no topo. `icon`: `instagram\|youtube\|spotify\|mic\|globe\|linkedin`. |
| `agendamento` | Bloco "prefere falar direto?". `tipo: 'link'` (abre WhatsApp/calendly) ou `'lead'` (abre o chat pra capturar). |

Cores/fontes: a paleta (dark + dourado da Duda) vive em **[`app/comece/comece.css`](../app/comece/comece.css)**
(tokens shadcn como CSS vars). As fontes reusam Playfair/Inter do `next/font` (via `--font-serif`/`--font-sans`).

---

## Arquitetura (porte do Vite→Next)

O minisite original era Vite + React Router. Aqui foi **portado pro Next.js (App Router)** e vive
DENTRO do site da Duda, como a rota `/comece` — igual o da Giulia roda no domínio dela. Assim
`dudabambil.com/comece` é o link-na-bio, no mesmo deploy do site.

```
app/comece/                     rota do Direcionador
  layout.tsx                    importa comece.css (Tailwind ESCOPADO) + metadata
  comece.css                    @tailwind + tokens dark/dourado (só carrega em /comece)
  page.tsx                      renderiza <BioPage/>
  produto/[slug]/               página de detalhe de cada produto (SSG)
app/api/chat/route.ts           agente de IA (Edge runtime, streaming SSE, OpenAI)
app/api/chat/systemPrompt.ts    monta o system prompt a partir do bio.config (server-only)
app/api/chat/ratelimit.ts       STUB fail-open (ver pendências)
app/api/lead/route.ts           captura de lead → webhook (planilha) OU log
components/bio/*                UI (BioPage, ChatFlow, ProductCard, LeadCaptureForm, ...)
components/ui/{button,input}    shadcn (Tailwind)
config/bio.config.ts            TODO o conteúdo de cliente (importado pelo client E pelo chat)
utils/{bioChat,bioLead,bioEvents,checkout,whatsapp,bioRouting}, hooks/useUTMParams, lib/utils
```

**Isolamento do Tailwind:** o Tailwind é escopado ao `/comece` — `content` no
[`tailwind.config.ts`](../tailwind.config.ts) só varre `app/comece/**` e `components/**`, e o CSS
(com o preflight) só é importado no layout de `/comece`. As páginas existentes (home, curso, guias)
continuam em CSS puro/Modules, **intocadas**.

**Chat:** roda em **Edge runtime** (streaming de LLM em Node estoura o cap de 10s da Vercel).
O system prompt é montado no servidor — o browser nunca segura o papel `system`. As tools de
roteamento são **terminais**: quando o modelo chama `recomendar_entrada`/`encaminhar_reuniao`,
a conversa encerra e a interface captura o contato.

---

## Variáveis de ambiente (todas server-only, SEM `NEXT_PUBLIC_`)

Ver [`.env.example`](../.env.example). Configurar na Vercel e/ou `.env.local`:

```bash
OPENAI_API_KEY=          # PENDÊNCIA PRINCIPAL — sem ela o chat responde "openai_not_configured"
OPENAI_CHAT_MODEL=gpt-4o # trocável (ex.: gpt-4o-mini)
CHAT_ALLOWED_ORIGIN=     # origens permitidas (anti-abuso); vazio = não bloqueia
LEAD_WEBHOOK_URL=        # destino do lead (a "planilha simples": Apps Script/Sheets/Make/Zapier); vazio = só loga
LEAD_WEBHOOK_TOKEN=      # opcional, header x-lead-token pro webhook validar
```

---

## Pendências (backend depois)

1. **`OPENAI_API_KEY`** — sem ela o chat não conversa (retorna `openai_not_configured`); o resto
   do minisite (vitrine, captura, detalhe) funciona. O Rodrigo configura ao voltar.
2. **`LEAD_WEBHOOK_URL`** — a "planilha simples". Enquanto não setado, `/api/lead` aceita o lead
   e **loga no server** (`vercel logs`), sem persistir. Wire de 1 linha: apontar pro webhook.
3. **Rate-limit** (`app/api/chat/ratelimit.ts`) — hoje é **stub fail-open**. Antes de ligar
   tráfego pago com a `OPENAI_API_KEY` viva, implementar trava real (Vercel KV/Upstash) — endpoint
   de LLM exposto é alvo de cost-DoS.
4. **Links reais**: o WhatsApp comercial (+55 67 99856-8757) já está no
   `agendamento.calendlyUrl`, mas o bloco segue `tipo:'lead'` (abre o chat pra capturar) —
   trocar pra `'link'` manda o paciente direto pro WhatsApp e **abre mão do lead**. Falta
   `imersao-wonderskin.checkoutUrl` (TODO). Preencher no `bio.config.ts` quando existir.

---

## Rodar local

`npm run dev` → `http://localhost:3000/comece`. Sem `OPENAI_API_KEY`, o chat responde o erro
amigável ao enviar mensagem; o resto roda normal. Com a chave num `.env.local`, a conversa fica viva.
