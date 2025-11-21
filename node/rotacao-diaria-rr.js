#!/usr/bin/env node

/**
 * Rotação Diária (Round-Robin) - Sustentação (20%)
 *
 * Modelo:
 * - 1 responsável por DIA ÚTIL (seg a sex)
 * - Round-robin contínuo no time
 *
 * Equipe (ordem da rotação): Heitor, Laercio, Fernanda, Nathan, Eduardo
 *
 * Uso:
 *   node rotacao-diaria-rr.js --weeks 4
 *   node rotacao-diaria-rr.js --weeks 4 --start Nathan
 */

class RotacaoDiariaRR {
  constructor(pessoas) {
    this.pessoas = pessoas;
    this.diasUteis = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
  }

  gerarEscala({ weeks = 1, startName = this.pessoas[0] } = {}) {
    const n = this.pessoas.length;

    let startIndex = this.pessoas.indexOf(startName);
    if (startIndex === -1) startIndex = 0;

    const escala = [];
    let cursor = startIndex;

    for (let w = 0; w < weeks; w++) {
      const semana = [];
      for (let d = 0; d < this.diasUteis.length; d++) {
        const responsavel = this.pessoas[cursor % n];
        semana.push({
          dia: this.diasUteis[d],
          responsavel,
        });
        cursor++;
      }
      escala.push({ semana: w + 1, dias: semana });
    }

    return escala;
  }

  imprimirEscala(escala) {
    console.log("\n═══════════════════════════════════════════════════");
    console.log("        ESCALA DIÁRIA (RR) - SUSTENTAÇÃO          ");
    console.log("═══════════════════════════════════════════════════\n");

    escala.forEach(({ semana, dias }) => {
      console.log(`Semana ${String(semana).padStart(2, "0")}:`);
      dias.forEach(({ dia, responsavel }) => {
        console.log(`  ${dia.padEnd(8)} — ${responsavel}`);
      });
      console.log("");
    });

    console.log("═══════════════════════════════════════════════════\n");
  }

  exportarMarkdown(escala) {
    let md = "";
    escala.forEach(({ semana, dias }) => {
      md += `### Semana ${semana}\n\n`;
      md += "| Dia | Responsável |\n|---|---|\n";
      md += dias
        .map(({ dia, responsavel }) => `| ${dia} | ${responsavel} |`)
        .join("\n");
      md += "\n\n";
    });
    return md.trim();
  }
}

// ---------- CLI ----------
function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const key = argv[i];
    const val = argv[i + 1];
    if (key === "--weeks") args.weeks = Number(val);
    if (key === "--start") args.start = val;
  }
  return args;
}

if (require.main === module) {
  const pessoas = ["Heitor", "Laercio", "Fernanda", "Nathan", "Eduardo"];
  const rotacao = new RotacaoDiariaRR(pessoas);

  const args = parseArgs(process.argv);
  const weeks = Number.isFinite(args.weeks) ? args.weeks : 1;
  const startName = args.start || pessoas[0];

  const escala = rotacao.gerarEscala({ weeks, startName });
  rotacao.imprimirEscala(escala);

  console.log("Markdown para colar no Notion/Jira:\n");
  console.log(rotacao.exportarMarkdown(escala));
}

module.exports = RotacaoDiariaRR;
