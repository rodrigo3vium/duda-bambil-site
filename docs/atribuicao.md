# Atribuição de tráfego

Como o site guarda de onde a pessoa veio, como isso chega no checkout da Kiwify,
na planilha de leads e no Meta Pixel.

**Regra que resume tudo:** origem se captura uma vez, no topo da árvore, e todo
mundo lê da mesma fonte. Não existe segundo storage, segunda chave, segundo
formato.

- Núcleo: [lib/attribution.ts](../lib/attribution.ts)
- Provider: [contexts/AttributionProvider.tsx](../contexts/AttributionProvider.tsx) (montado em [app/layout.tsx](../app/layout.tsx))
- Checkout: [utils/checkout.ts](../utils/checkout.ts) + [components/CheckoutLink.tsx](../components/CheckoutLink.tsx)
- Pixel: [utils/pixel.ts](../utils/pixel.ts) · Clarity: [utils/clarity.ts](../utils/clarity.ts)
- WhatsApp: [utils/whatsappBotoes.ts](../utils/whatsappBotoes.ts) + [components/WhatsAppLink.tsx](../components/WhatsAppLink.tsx) — ver [whatsapp-botoes.md](whatsapp-botoes.md)
- Testes: [tests/atribuicao/](../tests/atribuicao/)

---

## 1. O que é gravado

Uma chave só, no **localStorage**: `attribution`.

```json
{
  "version": 1,
  "legacy_migrated": true,
  "first_touch": {
    "utm_source": "instagram", "utm_medium": "bio", "utm_campaign": "lancamento",
    "utm_term": null, "utm_content": null,
    "fbclid": "ABC", "gclid": null, "ttclid": null,
    "referrer": "https://l.instagram.com/",
    "landing_path": "/gerenciamento-de-pele",
    "ts": "2026-08-27T12:00:00.000Z"
  },
  "last_touch": { "…mesma forma…" }
}
```

| Campo | O que é |
|---|---|
| `utm_source/medium/campaign/term/content` | os 5 UTM padrão, lidos da query |
| `fbclid` / `gclid` / `ttclid` | click ids do Meta / Google / TikTok |
| `referrer` | `document.referrer` da visita que gerou o touch |
| `landing_path` | pathname de entrada (sem query) — em que página a pessoa caiu |
| `ts` | ISO do momento da captura |

### first_touch × last_touch

- **`first_touch`** — a primeira origem **identificada**. Escrito uma vez e
  **nunca sobrescrito** enquanto não expirar. TTL de **90 dias**
  (`FIRST_TOUCH_TTL_DAYS`): passou disso, ele some e a próxima visita
  identificada reabre o ciclo.
- **`last_touch`** — a origem mais recente. **Sobrescrito** sempre que a URL
  trouxer parâmetro novo.

### Ordem de decisão da captura (roda uma vez por carga de página)

1. **URL tem utm_\* ou click id?** → escreve no `last_touch` e, se estiver
   vazio/expirado, também no `first_touch`.
2. **Não tem, mas veio de um referrer externo?** → vira `utm_source = <host>`,
   `utm_medium = "Referencia"` **só no `last_touch`**. O fallback de referrer
   **nunca** toca o `first_touch` — first touch guarda origem identificada, não
   palpite. Referrer do próprio domínio (navegação interna) é ignorado.
3. **Nada disso?** → não escreve nada. Visita direta não apaga a campanha que
   trouxe a pessoa.

Consequência intencional: quem entra direto e nunca vê uma URL com parâmetro
fica **sem `first_touch`**. É o preço de não sujar o first touch com palpite.

### Migração do formato antigo

Antes existiam duas chaves paralelas, que foram **migradas, não descartadas**
(as chaves antigas continuam onde estavam):

| Chave antiga | Onde | Vira |
|---|---|---|
| `utm_params` | localStorage (`/comece`) | `first_touch`, se estiver vazio |
| `mentoria_utm` | sessionStorage (`/mentoria`) | `last_touch`, se estiver vazio |

`mentoria_utm` é de sessão (mais recente), por isso alimenta o last touch.
A migração roda **uma vez** (flag `legacy_migrated`), é idempotente e **nunca
sobrescreve** slot já preenchido: captura real ganha de dado migrado.

---

## 2. Checkout — os parâmetros na URL da Kiwify

`buildCheckoutUrl` usa **todos** os parâmetros que a Kiwify aceita nativamente.
**Parâmetro vazio é omitido** — a Kiwify não recebe string vazia.

| Parâmetro | Conteúdo |
|---|---|
| `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` | **last touch**, um valor por parâmetro (não concatenado) |
| `src` | `utm_source` do **last touch** |
| `sck` | **first touch** concatenado por `\|` (ver abaixo) |
| `s1` | `fbclid` |
| `s2` | `event_id` do `InitiateCheckout` daquele clique |
| `s3` | `landing_path` do **first touch** |

### Formato do `sck`

Posicional, separado por `|`, **sempre nesta ordem**:

```
source|medium|campaign|term|content
```

- Posição vazia **no meio** continua vazia: `instagram||lancamento||story-3`
  (source e campaign e content preenchidos, medium e term vazios).
- Vazias **do fim** são cortadas: `instagram|bio`.
- Sem first touch, o `sck` não é enviado.
- `|` que aparecer dentro de um valor vira `-`, pra não quebrar o parsing.

Exemplo completo:

```
https://pay.kiwify.com.br/IKV1kqf
  ?utm_source=facebook&utm_medium=cpc&utm_campaign=black
  &src=facebook
  &sck=instagram|bio|lancamento
  &s1=FB-9&s2=6f1e…-uuid&s3=/gerenciamento-de-pele
```

Lê-se: **entrou** pelo Instagram bio (campanha lançamento), caindo na LP de
gerenciamento; **comprou** vindo do Facebook CPC na campanha black.

### Como ler no webhook da Kiwify

A Kiwify devolve esses campos no payload da venda (em `TrackingParameters`:
`src`, `sck`, `utm_source`, …, `s1`, `s2`, `s3`). Para desmontar o `sck`:

```js
const [ftSource, ftMedium, ftCampaign, ftTerm, ftContent] =
  (sck ?? "").split("|").concat(["", "", "", "", ""]).slice(0, 5)
    .map((v) => v || null);
```

O `.concat([...]).slice(0,5)` existe porque as posições vazias do fim são
cortadas — sem isso, um `sck` curto quebraria a desestruturação.

`s2` é o **event_id**: é ele que vai casar a venda com o `InitiateCheckout` do
browser quando o CAPI entrar.

### ⚠️ Checkout só sai por `<CheckoutLink>`

Nenhum `<a href={CHECKOUT_URL}>` cru no repo. Existem exatamente dois caminhos:

```tsx
// âncora (LPs)
<CheckoutLink href={CHECKOUT_URL} className={styles.cta}
  produto="curso-limpeza" origem="lp-limpeza-oferta">
  Quero garantir minha vaga
</CheckoutLink>

// clique programático (/comece, onde o destino depende da recomendação)
openCheckout(produto.checkoutUrl, { produto: produto.slug, origem: "comece-chat", novaAba: true });
```

Os dois disparam `InitiateCheckout` e carimbam a URL. Um `<a>` cru pula as duas
coisas — a venda chega na Kiwify órfã e o pixel não vê nada.

O `<CheckoutLink>` ainda troca o `href` no mount pela URL carimbada, então
"abrir em nova aba" e "copiar link" também levam a origem. Sem JS, o href cru
funciona: perde atribuição, não perde a venda.

---

## 3. Formulários — o schema que vai pra planilha

Todo formulário manda o **mesmo conjunto achatado** de colunas
(`flattenAttribution`), pra não existirem duas planilhas com formatos
diferentes:

```
utm_source, utm_medium, utm_campaign, utm_term, utm_content,   ← last touch
fbclid, gclid, ttclid, referrer, landing_path, last_touch_at,  ← last touch
first_utm_source, first_utm_medium, first_utm_campaign,
first_utm_term, first_utm_content, first_fbclid,
first_referrer, first_landing_path, first_touch_at             ← first touch
```

Quem manda: [/mentoria](../app/mentoria/AplicacaoForm.tsx) (via `/api/mentoria`),
[/guia-primeiros-passos](../app/guia-primeiros-passos/LeadForm.tsx) (webhook
direto) e o [/comece](../utils/bioLead.ts) (via `/api/lead`).

As rotas continuam aceitando o campo `utm` antigo (bag dos 5 utm_\*) — payload
velho não quebra. Quando vem `atribuicao`, ela tem prioridade.

> `gclid` e `ttclid` viajam nos formulários, mas **não** vão na URL da Kiwify:
> os slots `s1/s2/s3` estão ocupados por fbclid, event_id e landing_path.

---

## 4. Meta Pixel

O snippet vive em [app/layout.tsx](../app/layout.tsx) (`fbq('init', …)` +
`PageView`). Os eventos de conversão saem de [utils/pixel.ts](../utils/pixel.ts):

| Evento | Quando |
|---|---|
| `Lead` | todo submit de formulário **bem-sucedido** (mentoria, guia, /comece) |
| `InitiateCheckout` | todo clique de `<CheckoutLink>` / `openCheckout` |
| `Contact` | todo clique de `<WhatsAppLink>` — leva o id do botão e os utm do last touch. Detalhes e tabela mensagem → botão em [whatsapp-botoes.md](whatsapp-botoes.md) |

Todo evento leva um **`event_id`** (uuid) em `fbq(..., { eventID })`. Ele existe
pra **deduplicação**: quando a API de Conversões (CAPI) entrar, o mesmo evento
vai chegar por dois caminhos (browser + servidor) e o Meta descarta a duplicata
se os dois trouxerem o mesmo `event_id`. Por isso o event_id do
`InitiateCheckout` viaja no `s2` do checkout.

**CAPI não está implementada.** Não há backend de tracking, tabela de eventos
nem chamada server-side — só o fio deixado pronto.

---

## 5. Mexendo nisso depois

- Adicionar um parâmetro de origem novo → `Touch` em `lib/attribution.ts`, e
  decidir explicitamente se ele entra no `flattenAttribution` (planilha) e/ou
  nos slots da Kiwify (que já estão todos ocupados).
- Página nova com checkout → `<CheckoutLink>`. Nada além disso.
- Botão novo de WhatsApp → entrada em `utils/whatsappBotoes.ts` (mensagem
  exclusiva) + `<WhatsAppLink botao="…">`. Ver [whatsapp-botoes.md](whatsapp-botoes.md).
- Formulário novo → `flattenAttribution(useAttribution())` no payload e
  `trackLead()` no sucesso.
- `hooks/useUTMParams.ts` está **deprecado** e não é usado por nenhuma página;
  sobrou como ponte pra leitura da mesma fonte global.
