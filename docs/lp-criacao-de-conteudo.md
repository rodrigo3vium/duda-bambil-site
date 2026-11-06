# LP — Curso de Criação de Conteúdo para Estética

Spec + copy da página de vendas do curso gravado de conteúdo da Duda.
Fonte da copy: as 9 aulas do curso (transcritas em 05/11/2026). Todo fato
sobre a Duda nesta página saiu das aulas ou das LPs já aprovadas — nada inventado.

## Decisões

| Item | Valor | Origem |
|---|---|---|
| Rota | `/criacao-de-conteudo` | decisão técnica |
| Nome do produto | Curso de Criação de Conteúdo para Estética | nome que a Duda usa na aula 1 |
| Público | Esteticistas e biomédicas (estética facial) | Rodrigo, 05/11/2026 |
| Preço | R$597 à vista ou parcelado no cartão (sem "De R$") | Rodrigo, 05/11/2026 |
| Inclusos | Garantia de 7 dias + lista de equipamentos com link | Rodrigo, 05/11/2026 |
| **NÃO prometer** | acesso vitalício, certificado | Rodrigo não confirmou |
| Checkout | `https://pay.kiwify.com.br/0oKeqVO` (produto "Conteúdo que vende" na Kiwify) | painel da Kiwify, 06/11/2026 |
| Visual | Mesmo design system da `/limpeza-de-pele` (bege/preto, Playfair + Inter), CSS Module próprio da rota | padrão do repo |
| Rastreio | `<CheckoutLink produto="curso-conteudo" origem="lp-conteudo-oferta" / "lp-conteudo-final">` | regra do repo |

Parcelamento: a página diz só "ou parcelado no cartão". O valor da parcela
depende da configuração da Kiwify; quando o Rodrigo mandar, entra no card.

## Estrutura

Mesma sequência de blocos da LP de Limpeza de Pele, que já funciona:

1. Hero
2. O espelho (dor)
3. A virada (o que este curso é e não é)
4. As 9 aulas
5. Para quem é / não é
6. Oferta
7. Garantia
8. Quem ensina
9. Dúvidas
10. Fechamento

---

## Copy

### 1. Hero

**Eyebrow:** Curso de conteúdo para esteticistas e biomédicas

(Ajuste na montagem: a versão aprovada era "Para esteticistas e biomédicas que já atendem". A categoria entrou na eyebrow pra passar no teste do estranho da skill ux-pagina: o H1 não diz o que é vendido.)

**H1:** O conteúdo que traz paciente já acontece na sua maca. *Você só não está gravando.*

**Lead:** Sem dia de produção, sem softbox, sem calendário de 30 posts prontos. Em 9 aulas diretas, a Duda te mostra como transformar a rotina do consultório (o preparo da sala, a dúvida da paciente, o resultado do protocolo) em conteúdo que faz quem assiste querer agendar com você.

**CTA:** Quero aprender — R$597 (âncora para #oferta)

**Meta:** Acesso imediato · 9 aulas · 7 dias de garantia

### 2. O espelho

**Eyebrow:** Você já viveu isso

**H2:** Tirou a tarde pra gravar. O post não deu em nada.

Se maquiou, trocou de roupa, chamou modelo, chamou alguém pra filmar. Postou no feed na mesma semana. Quase ninguém viu. Nenhuma mensagem, nenhum agendamento.

E o ciclo recomeça: você sabe que precisa fazer conteúdo, mas a agenda, o financeiro, a limpeza da sala e a vida lá fora sempre ganham. O Instagram vira mais um peso.

**Pivô:** O problema não é o seu celular nem a sua luz. É que ninguém te ensinou a fazer o conteúdo **certo**:

- Você escreve no story como se falasse com outra esteticista ("oxigenação celular", "ácido tal") e a paciente não entende o que ganha com isso
- Você grava cinco stories seguidos só falando, sem legenda, e ela pula todos
- O fundo do vídeo tem carrinho bagunçado e gaveta aberta, e é disso que ela lembra, não do procedimento
- Você espera ter microfone, LED e tripé bom pra começar, e não começa
- Você posta o print do feedback com "gratidão" e deixa passar a venda que estava ali

### 3. A virada

**H2:** Este não é mais um curso de calendário de conteúdo.

Não tem 30 posts editáveis pra trocar o logo. Não tem roteiro pra seguir sem entender por quê. Se você espera receber tudo pronto, este curso não é pra você.

É o jeito que a Duda faz o próprio Instagram: celular, tripé e a luz da sala. O básico muito bem feito, gravado no meio dos atendimentos.

**Pivô:** Você sai daqui com três coisas:

1. **Ideias que não acabam**: os 5 ângulos que tiram conteúdo de cada atendimento, cada dúvida e cada resultado
2. **Formatos que cabem na rotina**: cinco jeitos de gravar sem parar o dia, enquanto você arruma a bancada ou atende
3. **Linguagem que vende**: trocar o termo técnico pelo que a paciente ganha, até ela pensar "eu preciso fazer isso, e com ela"

### 4. As 9 aulas

**Eyebrow:** O que você vai aprender

**H2:** Nove aulas, do celular limpo ao conteúdo que roda.

Aulas curtas e diretas, cerca de 1h30 no total. Dá pra assistir uma no intervalo e aplicar no atendimento seguinte.

| # | Título | Texto |
|---|---|---|
| 01 | Começando do jeito certo | Por que tanto conteúdo de estética não dá resultado, e o combinado que separa quem aplica de quem só anota no caderno. |
| 02 | O básico bem feito | Câmera limpa, cenário organizado, edição limpa. Por que o carrinho bagunçado rouba a atenção do procedimento, e por que menos é mais no story e no feed. |
| 03 | Você já tem o equipamento | Comece com o celular e a luz de uma janela. Quando vale investir, e o que a Duda usa hoje (microfone e tripé de ímã), com os links. |
| 04 | O que a sua paciente quer assistir | Feed atrai, story vende. O teste do "minha mãe entenderia?" antes de postar. E o perfil espião, pra achar conteúdo que já funcionou sem se perder rolando o feed. |
| 05 | Os formatos que cabem na rotina | Story vlog, take, talk, estático, terceira pessoa e carrossel: como gravar enquanto arruma a sala, prepara a pele ou explica algo pra paciente. A aula mais longa do curso. |
| 06 | A técnica dos ângulos | O bastidor que a paciente não vê, a sua opinião sobre cada etapa do protocolo e os erros que todo paciente comete. Três produtos da sua bancada viram três conteúdos. |
| 07 | Sua base de conteúdo | Dúvidas e resultados: de uma pergunta de paciente saem cinco conteúdos. Como contar um resultado sem ficar só no antes e depois, e montar a lista que acaba com o "o que eu posto hoje?". |
| 08 | Os erros que custam paciente | Story falado sem legenda, excesso de edição, nunca mostrar o rosto, foto de curso sem contexto e feedback sem gancho. E o que fazer no lugar de cada um. |
| 09 | Teste e constância | Os Reels de teste do Instagram: o mesmo vídeo com legendas diferentes até achar o que roda. E como replicar o que deu certo em vez de inventar do zero. |

**Destaque na aula 07:** "Uma pergunta que você ia só responder vira cinco conteúdos."

**Destaque na aula 09:** "Um vídeo que eu já tinha postado várias vezes ganhou uma legenda nova e passou de 130 mil visualizações." (aula 9, fala da Duda)

### 5. Para quem é

**H2:** Para quem é este curso.

**É pra você se:**
- É esteticista ou biomédica esteta e já atende (ou está prestes a começar)
- Sabe que precisa postar, mas trava no "o que eu posto hoje?"
- Já gastou com equipamento ou com dia de produção e não viu retorno
- Não tem como parar a agenda pra gravar
- Quer que o Instagram traga paciente, não só curtida

**Não é pra você se:**
- Quer 30 posts prontos pra trocar o logo e repostar
- Procura edição cheia de efeito e transição
- Vai assistir, anotar e deixar pra depois

### 6. Oferta

**H2:** Uma paciente nova que fecha protocolo paga o curso.

O resto é lucro, e conteúdo que continua trabalhando por você toda semana.

**Card:**
- Eyebrow: Investimento
- R$597 · à vista
- ou parcelado no cartão
- Você leva:
  - 9 aulas diretas, da gravação à constância
  - Os 5 formatos e os 5 ângulos pra nunca mais ficar sem ideia
  - A lista dos equipamentos que a Duda usa, com link
  - Aulas gravadas: assista no celular ou no computador, no seu ritmo
  - Garantia incondicional de 7 dias
- CTA: Quero começar agora (CheckoutLink, origem `lp-conteudo-oferta`)
- Rodapé do card: Acesso imediato · À vista ou parcelado · Garantia de 7 dias

### 7. Garantia

**Selo:** 7 dias

**H2:** Risco zero. Só seu, não.

Entre, assista, grave os primeiros conteúdos. Se em 7 dias você achar que não valeu, pede o reembolso e devolvemos 100% do valor. Sem formulário chato, sem pergunta constrangedora.

O risco é todo nosso, porque a gente sabe o que tem lá dentro.

### 8. Quem ensina

**Eyebrow:** Quem ensina

**H2:** Duda Bambil

Esteticista formada há 4 anos, especialista em gerenciamento de pele. Atendo pacientes no meu próprio consultório e ensino profissionais da estética.

Comecei a fazer conteúdo em 2024 com um iPhone 11, sem microfone e com uma ring light quebrada, presa com fita. Postava de tudo, até procedimento que eu nem atendo. Era conteúdo solto, sem pé nem cabeça.

Hoje uso um tripé de ímã, um microfone e a luz da minha sala. O que mudou não foi o equipamento: foi entender o que gravar, como falar e por que testar. É esse método que está aqui dentro, o mesmo que eu uso no meu Instagram todo dia.

**Assinatura:** — Duda Bambil

### 9. Dúvidas

**Eyebrow:** Dúvidas frequentes · **H2:** Antes de você decidir.

- **Não gosto de aparecer. Consigo fazer?** Sim. Vários formatos do curso não pedem que você fale nada: o take e o estático, por exemplo. Mas a aula 8 explica por que aparecer aos poucos faz diferença, e como começar sem travar.
- **Preciso comprar equipamento?** Não. Um celular que grave e a luz de uma janela bastam pra começar. A aula 3 mostra quando vale investir, e o que comprar.
- **Não tenho tempo pra criar conteúdo.** É exatamente disso que o curso trata: gravar no meio da rotina que você já tem, sem parar a agenda.
- **Vou receber posts prontos ou um calendário?** Não. Você aprende a tirar conteúdo da sua própria rotina, das suas pacientes e dos seus resultados, que é o que faz quem assiste querer agendar com você.
- **As aulas são ao vivo?** Não. São 9 aulas gravadas, cerca de 1h30 no total, disponíveis no momento da compra.
- **Como recebo o acesso?** Na hora. O e-mail com login chega em minutos após a confirmação do pagamento.

### 10. Fechamento

**Eyebrow:** Última coisa

**H2:** Seu próximo conteúdo já está acontecendo no consultório. *Só falta apertar o rec.*

Você já tem a rotina, as pacientes e as perguntas. Falta o método pra transformar isso em paciente nova.

**CTA:** Começar agora — R$597 (CheckoutLink, origem `lp-conteudo-final`)

**Meta:** Acesso imediato · 9 aulas · 7 dias de garantia

---

## Implementação

- `app/criacao-de-conteudo/page.tsx` — a página (Server Component; copy em arrays no topo)
- `app/criacao-de-conteudo/config.ts` — `CHECKOUT_URL` e `PRECO` (fora do page.tsx porque página do Next só exporta os campos dela)
- `app/criacao-de-conteudo/SectionNav.tsx` — índice fixo + barra de progresso (único client component)
- `app/criacao-de-conteudo/styles.module.css` — cópia do CSS da `/limpeza-de-pele` com os pisos de leitura (desvios listados no topo do arquivo)
- `tests/criacao-de-conteudo/pagina.test.tsx` — quebra se a página prometer vitalício/certificado, se um checkout sair sem `<CheckoutLink>` ou se aparecer preço riscado

Pisos de leitura aplicados (skill ux-pagina): corpo 18px/400, entrelinha 1.7, texto corrido ≤ 60ch (~66 caracteres na Inter), `--ink-mute` de #6b6863 → #5c5954 (o antigo dava 3,9:1 sobre o bege escuro; o novo dá 4,9:1), eyebrow com tracking 0.12em, links do índice com 44px de altura. "Modo leitura" da skill **não** entrou: ele serve pra desligar textura/grão, e esta página não tem.

## Pendências antes de publicar

- [x] Link de checkout da Kiwify (`CHECKOUT_URL` em `app/criacao-de-conteudo/config.ts`)
- [ ] (opcional) Valor da parcela, se quiser mostrar
