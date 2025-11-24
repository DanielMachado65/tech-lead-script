#!/usr/bin/env node

/**
 * Rotação Semanal Round-Robin com datas reais
 *
 * Uso:
 *  node rotacao-semanal-rr.js --weeks 8 --start Fernanda --start-date 2025-11-24
 *  node rotacao-semanal-rr.js --weeks=8 --start=Fernanda --start-date=2025-11-24 --ics out.ics
 */

const fs = require("fs");

class RotacaoSemanalRR {
  constructor(pessoas) {
    this.pessoas = pessoas;
  }

  gerarEscala({ weeks, startName, startDate } = {}) {
    const n = this.pessoas.length;

    const normalizedStart = (startName || this.pessoas[0]).trim().toLowerCase();
    let startIndex = this.pessoas.findIndex(
      (p) => p.toLowerCase() === normalizedStart
    );
    if (startIndex === -1) startIndex = 0;

    const firstMonday = alignToMonday(startDate || new Date());

    const escala = [];
    for (let w = 0; w < weeks; w++) {
      const idx = (startIndex + w) % n;

      const weekStart = addDays(firstMonday, w * 7);
      const weekEnd = addDays(weekStart, 6); // domingo

      escala.push({
        semana: w + 1,
        responsavel: this.pessoas[idx],
        inicio: weekStart,
        fim: weekEnd,
      });
    }
    return escala;
  }

  imprimirEscala(escala) {
    console.log("\n═══════════════════════════════════════════════════");
    console.log(" ESCALA SEMANAL (ROUND-ROBIN) - SUSTENTAÇÃO ");
    console.log("═══════════════════════════════════════════════════\n");

    escala.forEach(({ semana, responsavel, inicio, fim }) => {
      console.log(
        `Semana ${String(semana).padStart(2, "0")} — ${formatDate(
          inicio
        )} a ${formatDate(fim)} — Responsável: ${responsavel}`
      );
    });

    console.log("\n═══════════════════════════════════════════════════\n");
  }

  exportarMarkdown(escala) {
    const header =
      "| Semana | Início | Fim | Responsável |\n|---|---|---|---|\n";
    const rows = escala
      .map(
        ({ semana, inicio, fim, responsavel }) =>
          `| ${semana} | ${formatDate(inicio)} | ${formatDate(
            fim
          )} | ${responsavel} |`
      )
      .join("\n");
    return header + rows;
  }

  exportarICS(escala, { calendarName = "Sustentação RR" } = {}) {
    const lines = [];
    lines.push("BEGIN:VCALENDAR");
    lines.push("VERSION:2.0");
    lines.push("PRODID:-//RotacaoSemanalRR//Confluence//BR");
    lines.push(`X-WR-CALNAME:${calendarName}`);

    escala.forEach(({ semana, inicio, fim, responsavel }) => {
      const dtStart = formatICSDate(inicio); // all-day
      const dtEndExclusive = formatICSDate(addDays(fim, 1)); // fim + 1 dia

      lines.push("BEGIN:VEVENT");
      lines.push(`UID:sustentacao-${semana}-${dtStart}@rotacao-rr`);
      lines.push(`DTSTAMP:${formatICSDate(new Date())}T000000Z`);
      lines.push(`DTSTART;VALUE=DATE:${dtStart}`);
      lines.push(`DTEND;VALUE=DATE:${dtEndExclusive}`);
      lines.push(`SUMMARY:Sustentação - ${responsavel}`);
      lines.push("END:VEVENT");
    });

    lines.push("END:VCALENDAR");
    return lines.join("\r\n");
  }
}

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const token = argv[i];

    if (token.startsWith("--weeks=")) {
      args.weeks = Number(token.split("=")[1]);
      continue;
    }
    if (token.startsWith("--start=")) {
      args.start = token.split("=")[1];
      continue;
    }
    if (token.startsWith("--start-date=")) {
      args.startDate = token.split("=")[1];
      continue;
    }
    if (token.startsWith("--ics=")) {
      args.ics = token.split("=")[1];
      continue;
    }

    const next = argv[i + 1];
    if (token === "--weeks") {
      args.weeks = Number(next);
      i++;
      continue;
    }
    if (token === "--start") {
      args.start = next;
      i++;
      continue;
    }
    if (token === "--start-date") {
      args.startDate = next;
      i++;
      continue;
    }
    if (token === "--ics") {
      args.ics = next;
      i++;
      continue;
    }
  }
  return args;
}

// Helpers de data (sem libs externas)
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function alignToMonday(dateInput) {
  const d = new Date(dateInput);
  // JS: 0=dom,1=seg,...6=sab
  const day = d.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  return addDays(d, diffToMonday);
}

function formatDate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy}`;
}

function formatICSDate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

function runCli(argv = process.argv) {
  const pessoas = ["Heitor", "Laercio", "Fernanda", "Nathan", "Eduardo"];
  const rotacao = new RotacaoSemanalRR(pessoas);

  const args = parseArgs(argv);

  const weeks =
    Number.isFinite(args.weeks) && args.weeks > 0 ? args.weeks : pessoas.length;

  const startDate = args.startDate ? new Date(args.startDate) : new Date();

  const escala = rotacao.gerarEscala({
    weeks,
    startName: args.start,
    startDate,
  });

  rotacao.imprimirEscala(escala);

  console.log("Markdown para colar no Confluence/Notion/Jira:\n");
  console.log(rotacao.exportarMarkdown(escala));

  if (args.ics) {
    const ics = rotacao.exportarICS(escala);
    fs.writeFileSync(args.ics, ics, "utf8");
    console.log(`\nArquivo ICS gerado em: ${args.ics}\n`);
  }
}

if (require.main === module) {
  runCli();
}

module.exports = { RotacaoSemanalRR, runCli, parseArgs };
