#!/usr/bin/env node
/**
 * Alias para manter compatibilidade com o nome antigo.
 * Usa a implementação principal em rotacao-semanal-rr.js.
 */
const { RotacaoSemanalRR, runCli } = require("./rotacao-semanal-rr");

if (require.main === module) {
  runCli();
}

module.exports = RotacaoSemanalRR;
