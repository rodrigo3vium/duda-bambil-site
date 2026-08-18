/**
 * ════════════════════════════════════════════════════════════════════════════
 * APLICAÇÕES DA MENTORIA → PLANILHA
 * Recebe o POST de /api/mentoria (site da Duda) e escreve uma linha por
 * aplicação. Solução ponte até existir um backend de verdade.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * COMO INSTALAR (uma vez só):
 *
 *  1. Crie uma planilha nova no Google Sheets.
 *  2. Extensões → Apps Script. Apague o conteúdo e cole ESTE arquivo inteiro.
 *  3. Troque o TOKEN abaixo por uma senha qualquer que você invente
 *     (ex.: "duda-2026-x7k2"). Serve pra ninguém enfiar lixo na planilha.
 *  4. Implantar → Nova implantação → tipo "App da Web".
 *       Executar como:      Eu
 *       Quem pode acessar:  Qualquer pessoa      ← precisa ser esse
 *  5. Autorize quando pedir (vai aparecer aviso de app não verificado:
 *     "Avançado" → "Acessar <nome do projeto>"). É seu próprio script.
 *  6. Copie a URL da implantação (termina em /exec) e mande pro Rodrigo
 *     COM o token colado no fim, assim:
 *
 *       https://script.google.com/macros/s/AKfy.../exec?token=duda-2026-x7k2
 *
 * A aba e o cabeçalho são criados sozinhos na primeira aplicação que chegar.
 * Se você editar o cabeçalho à mão, as colunas saem do lugar — não edite.
 */

/** Senha combinada. Vai na URL como ?token=... — TROQUE antes de implantar. */
const TOKEN = 'TROQUE-ESTE-TOKEN';

/** Nome da aba onde as aplicações são escritas. */
const ABA = 'Aplicações';

/**
 * Colunas da planilha, na ordem. [chave no payload, título da coluna].
 * Mexer aqui muda a planilha — mas só para linhas NOVAS.
 */
const COLUNAS = [
  ['submitted_at',        'Recebido em'],
  ['nome',                'Nome'],
  ['whatsapp',            'WhatsApp'],
  ['instagram',           'Instagram'],
  ['atuacao',             'Como atende hoje'],
  ['faturamento',         'Faturamento mensal'],
  ['travamento',          'O que mais trava'],
  ['investimento_previo', 'Já investiu'],
  ['prontidao',           'Pronta para começar'],
  ['motivo',              'Por que agora'],
  ['utm_source',          'utm_source'],
  ['utm_medium',          'utm_medium'],
  ['utm_campaign',        'utm_campaign'],
  ['utm_content',         'utm_content'],
  ['utm_term',            'utm_term'],
  ['referrer',            'Veio de'],
  ['origem',              'Origem'],
];

/** Campos de rádio — só nestes o código é traduzido para rótulo. */
const CAMPOS_CODIFICADOS = [
  'atuacao', 'faturamento', 'travamento', 'investimento_previo', 'prontidao',
];

/**
 * Tradução dos códigos para texto legível — a equipe lê isto na triagem.
 * ⚠️ Espelha as opções de app/mentoria/aplicacao.ts no repo do site. Se as
 * opções mudarem lá, atualize aqui; código desconhecido cai como veio, sem
 * quebrar nada.
 */
const ROTULOS = {
  nao_atendo: 'Ainda não atende',
  casa: 'Em casa ou home care',
  sala_alugada: 'Sala alugada / divide espaço',
  espaco_proprio: 'Espaço próprio',
  com_equipe: 'Espaço e equipe',

  ate_3k: 'Até R$ 3 mil',
  '3k_8k': 'R$ 3 a 8 mil',
  '8k_15k': 'R$ 8 a 15 mil',
  '15k_30k': 'R$ 15 a 30 mil',
  acima_30k: 'Acima de R$ 30 mil',

  sem_clientes: 'Sem fluxo de clientes',
  preco_baixo: 'Cobra barato, não consegue subir',
  muito_trabalho: 'Trabalha muito, ganha pouco',
  nao_sei_vender: 'Não sabe vender',
  sem_direcao: 'Não sabe o que fazer primeiro',

  nunca: 'Nunca investiu',
  ate_500: 'Até R$ 500',
  '500_2k': 'R$ 500 a 2 mil',
  '2k_5k': 'R$ 2 a 5 mil',
  acima_5k: 'Acima de R$ 5 mil',

  agora: 'Sim, agora',
  '30_dias': 'Sim, em até 30 dias',
  depois: 'Só mais pra frente',
};

function doPost(e) {
  // Duas aplicações podem chegar juntas; sem trava, uma sobrescreve a outra.
  const trava = LockService.getScriptLock();
  trava.waitLock(30000);

  try {
    if (TOKEN && (!e || !e.parameter || e.parameter.token !== TOKEN)) {
      return responder({ ok: false, error: 'token' });
    }

    const dados = JSON.parse(e.postData.contents);
    const aba = pegarAba();

    const linha = COLUNAS.map(function (col) {
      const chave = col[0];
      let valor = dados[chave];
      if (valor === null || valor === undefined) return '';
      if (chave === 'submitted_at') return formatarData(valor);
      if (chave === 'whatsapp') return formatarWhatsapp(valor);
      // Só os campos de rádio são traduzidos: senão uma pessoa chamada "Agora"
      // ou um @depois viraria rótulo.
      if (CAMPOS_CODIFICADOS.indexOf(chave) !== -1) return ROTULOS[valor] || valor;
      return valor;
    });

    aba.appendRow(linha);
    return responder({ ok: true });
  } catch (erro) {
    // Deixa o erro subir como 500 pro site: a rota tenta de novo (3 tentativas)
    // e, se não colar, guarda o payload no log dela.
    throw erro;
  } finally {
    trava.releaseLock();
  }
}

/** Ping pra testar no navegador se a implantação está de pé. */
function doGet() {
  return responder({ ok: true, aviso: 'endpoint vivo; use POST para enviar' });
}

function pegarAba() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  let aba = planilha.getSheetByName(ABA);

  if (!aba) {
    aba = planilha.insertSheet(ABA);
  }
  if (aba.getLastRow() === 0) {
    const titulos = COLUNAS.map(function (col) { return col[1]; });
    aba.appendRow(titulos);
    aba.getRange(1, 1, 1, titulos.length).setFontWeight('bold');
    aba.setFrozenRows(1);
  }
  return aba;
}

/** ISO (UTC) → data legível no fuso da planilha. */
function formatarData(iso) {
  try {
    return Utilities.formatDate(
      new Date(iso),
      SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone(),
      'dd/MM/yyyy HH:mm'
    );
  } catch (erro) {
    return iso;
  }
}

/** 67998568757 → (67) 99856-8757, com apóstrofo pro Sheets não virar número. */
function formatarWhatsapp(bruto) {
  const d = String(bruto).replace(/\D/g, '');
  if (d.length !== 11) return "'" + bruto;
  return "'(" + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
}

function responder(objeto) {
  return ContentService
    .createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}
