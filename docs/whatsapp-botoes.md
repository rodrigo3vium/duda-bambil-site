# Botões de WhatsApp — de onde a pessoa veio

Cada botão de WhatsApp do site abre a conversa com uma **mensagem pronta
diferente**. É por ela que a equipe da Duda sabe, olhando a conversa, de qual
botão a pessoa veio.

- Fonte da verdade: [utils/whatsappBotoes.ts](../utils/whatsappBotoes.ts)
- Componente: [components/WhatsAppLink.tsx](../components/WhatsAppLink.tsx)
- Testes: [tests/whatsapp/](../tests/whatsapp/)

Número: **+55 67 99856-8757** (WhatsApp comercial da Duda).

---

## 1. Tabela pra equipe — mensagem → botão

| Se a conversa começar com… | A pessoa clicou em… | id do botão |
|---|---|---|
| "Oi, Duda! Vim pelo seu site e **quero agendar um horário**." | Home — card "Agende seu horário" (paciente) | `home-agendar` |
| "Oi, Duda! Vim pelo seu site e **quero saber dos cursos presenciais**." | Home — banner "Cursos presenciais" | `home-cursos-presenciais` |
| "Oi, Duda! Vim pelo seu site e **fiquei na dúvida de qual caminho é o meu**." | Home — ícone do WhatsApp no rodapé | `home-rodape` |

Regras de leitura:

- **"Vim pelo seu site"** = veio de um botão do site. Mensagem sem isso veio de
  outro lugar (perfil do Instagram, contato salvo, indicação).
- A pessoa **pode apagar ou editar** o texto antes de mandar. A maioria não
  mexe, mas uma conversa sem a frase não prova que a pessoa não veio do site.
- O botão diz **qual botão**, não **qual campanha**. Campanha se lê no Meta e
  no Clarity (abaixo).

---

## 2. Onde ver os números

Todo clique num botão de WhatsApp dispara, ao mesmo tempo:

| Onde | O quê | Como ler |
|---|---|---|
| **Meta Pixel** | evento padrão **`Contact`** (Contato), com `content_name` = id do botão, `content_category` = `whatsapp` e os `utm_source/medium/campaign/content` do last touch | Gerenciador de Eventos → pixel `1612355636912285` → Contato. No Gerenciador de Anúncios, "Contatos" vira coluna e pode ser o objetivo de conversão do conjunto |
| **Clarity** | evento `whatsapp_click` (todo clique) + `whatsapp_home_agendar` / `whatsapp_home_cursos_presenciais` / `whatsapp_home_rodape` (por botão), tag `whatsapp_botao` = id, e `upgrade` pra gravação não cair na amostragem | Painel → filtro "Eventos personalizados" (ou tag `whatsapp_botao`) + filtro de UTM pra cruzar com campanha; dá pra assistir a gravação de quem clicou |

O `Contact` leva `event_id` (uuid) como os outros eventos do site — pronto pra
deduplicação quando a API de Conversões entrar (ver
[atribuicao.md](atribuicao.md#4-meta-pixel)).

O que **não** dá pra saber pelo site: se a pessoa de fato mandou a mensagem.
O clique é o último ponto que o site enxerga; o resto acontece no WhatsApp.

---

## 3. Botão novo de WhatsApp

1. Adicione o botão em `BOTOES_WHATSAPP` (`utils/whatsappBotoes.ts`) com uma
   mensagem que comece com "Oi, Duda! Vim pelo seu site e…" e **não repita**
   nenhuma outra — o teste falha se repetir.
2. Use `<WhatsAppLink botao="seu-id">` na página. Nunca um link `wa.me` escrito
   à mão: o teste de guarda varre `app/` e `components/` e falha.
3. Acrescente a linha na tabela da seção 1.

> O Direcionador `/comece` (ainda fora do ar) tem o próprio link de WhatsApp em
> `config/bio.config.ts`, fora deste mapa. Quando ele for publicado, ligar no
> mesmo mecanismo.
