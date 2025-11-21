#!/usr/bin/env node

/**
 * Rotação Híbrida - Sustentação (20%)
 *
 * Modelo:
 * - 1 Ponto Focal (PF) por semana (round-robin)
 * - 2 Apoios: próximas duas pessoas na rotação
 *
 * Equipe: Heitor, Laercio, Fernanda, Nathan, Eduardo
 *
 * Uso:
 *   node rotacao-hibrida.js --weeks 8
 *   node rotacao-hibrida.js --weeks 8 --start Heitor
 */

class RotacaoHibrida {
  constructor(pessoas) {
    this.pessoas = pessoas;
  }

  /**
   * Gera a escala híbrida
   * @param {number} weeks - número de semanas a gerar
   * @param {string} startName - quem começa como PF
   */
  gerarEscala({
    weeks = this.pessoas.length,
    startName = this.pessoas[0],
  } = {}) {
    const n = this.pessoas.length;

    let startIndex = this.pessoas.indexOf(startName);
    if (startIndex === -1) startIndex = 0;

    const escala = [];

    for (let w = 0; w < weeks; w++) {
      const focalIndex = (startIndex + w) % n;
      const focal = this.pessoas[focalIndex];

      // Apoios são as próximas duas pessoas na fila
      const apoio1 = this.pessoas[(focalIndex + 1) % n];
      const apoio2 = this.pessoas[(focalIndex + 2) % n];

      escala.push({
        semana: w + 1,
        pontoFocal: focal,
        apoios: [apoio1, apoio2],
      });
    }

    return escala;
  }

  /**
   * Imprime escala no console
   */
  imprimirEscala(escala) {
    console.log("\n═══════════════════════════════════════════════════");
    console.log("      ESCALA HÍBRIDA - SUSTENTAÇÃO (20%)          ");
    console.log("═══════════════════════════════════════════════════\n");

    escala.forEach(({ semana, pontoFocal, apoios }) => {
      console.log(
        `Semana ${String(semana).padStart(
          2,
          "0"
        )} — PF: ${pontoFocal} / Apoios: ${apoios.join(", ")}`
      );
    });

    console.log("\n═══════════════════════════════════════════════════\n");
  }

  /**
   * Exporta escala em Markdown (pra colar no Notion/Jira)
   */
  exportarMarkdown(escala) {
    const header = "| Semana | Ponto Focal | Apoios |\n|---|---|---|\n";
    const rows = escala
      .map(
        ({ semana, pontoFocal, apoios }) =>
          `| ${semana} | ${pontoFocal} | ${apoios.join(", ")} |`
      )
      .join("\n");

    return header + rows;
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
  const rotacao = new RotacaoHibrida(pessoas);

  const args = parseArgs(process.argv);
  const weeks = Number.isFinite(args.weeks) ? args.weeks : pessoas.length;
  const startName = args.start || pessoas[0];

  const escala = rotacao.gerarEscala({ weeks, startName });
  rotacao.imprimirEscala(escala);

  // Se quiser o markdown pronto no terminal também:
  console.log("Markdown para colar no Notion/Jira:\n");
  console.log(rotacao.exportarMarkdown(escala));
}

module.exports = RotacaoHibrida;
