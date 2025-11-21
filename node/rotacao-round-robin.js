#!/usr/bin/env node

/**
 * Rotação Semanal Round-Robin - Sustentação (20%)
 *
 * Modelo:
 * - 1 responsável por semana, em round-robin fixo.
 * - Sem apoios automáticos (diferente do híbrido).
 *
 * Equipe (ordem da rotação): Heitor, Laercio, Fernanda, Nathan, Eduardo
 *
 * Uso:
 *   node rotacao-semanal-rr.js --weeks 8
 *   node rotacao-semanal-rr.js --weeks 8 --start Fernanda
 */

class RotacaoSemanalRR {
  constructor(pessoas) {
    this.pessoas = pessoas;
  }

  gerarEscala({
    weeks = this.pessoas.length,
    startName = this.pessoas[0],
  } = {}) {
    const n = this.pessoas.length;

    let startIndex = this.pessoas.indexOf(startName);
    if (startIndex === -1) startIndex = 0;

    const escala = [];
    for (let w = 0; w < weeks; w++) {
      const idx = (startIndex + w) % n;
      escala.push({
        semana: w + 1,
        responsavel: this.pessoas[idx],
      });
    }
    return escala;
  }

  imprimirEscala(escala) {
    console.log("\n═══════════════════════════════════════════════════");
    console.log("   ESCALA SEMANAL (ROUND-ROBIN) - SUSTENTAÇÃO     ");
    console.log("═══════════════════════════════════════════════════\n");

    escala.forEach(({ semana, responsavel }) => {
      console.log(
        `Semana ${String(semana).padStart(
          2,
          "0"
        )} — Responsável: ${responsavel}`
      );
    });

    console.log("\n═══════════════════════════════════════════════════\n");
  }

  exportarMarkdown(escala) {
    const header = "| Semana | Responsável |\n|---|---|\n";
    const rows = escala
      .map(({ semana, responsavel }) => `| ${semana} | ${responsavel} |`)
      .join("\n");
    return header + rows;
  }
}

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
  const rotacao = new RotacaoSemanalRR(pessoas);

  const args = parseArgs(process.argv);
  const weeks = Number.isFinite(args.weeks) ? args.weeks : pessoas.length;
  const startName = args.start || pessoas[0];

  const escala = rotacao.gerarEscala({ weeks, startName });
  rotacao.imprimirEscala(escala);

  console.log("Markdown para colar no Notion/Jira:\n");
  console.log(rotacao.exportarMarkdown(escala));
}

module.exports = RotacaoSemanalRR;
