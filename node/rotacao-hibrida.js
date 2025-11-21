#!/usr/bin/env node

/**
 * Rotação Híbrida - Sistema de Alocação para Sustentação
 * 
 * Este script gerencia a rotação de pessoas para sustentação,
 * alocando cada pessoa com 20% de sua capacidade.
 * 
 * Equipe: Heitor, Eduardo, Laercio, Fernanda, Nathan
 */

class RotacaoHibrida {
  constructor() {
    this.pessoas = [
      { nome: 'Heitor', capacidadeAlocada: 0, disponivel: true },
      { nome: 'Eduardo', capacidadeAlocada: 0, disponivel: true },
      { nome: 'Laercio', capacidadeAlocada: 0, disponivel: true },
      { nome: 'Fernanda', capacidadeAlocada: 0, disponivel: true },
      { nome: 'Nathan', capacidadeAlocada: 0, disponivel: true }
    ];
    this.percentualAlocacao = 20; // 20% da capacidade
    this.rotacaoAtual = 0;
  }

  /**
   * Retorna a próxima pessoa na rotação
   */
  proximaPessoa() {
    const pessoa = this.pessoas[this.rotacaoAtual];
    this.rotacaoAtual = (this.rotacaoAtual + 1) % this.pessoas.length;
    return pessoa;
  }

  /**
   * Aloca uma pessoa para sustentação
   */
  alocarSustentacao() {
    const pessoa = this.proximaPessoa();
    const capacidadeRestante = 100 - pessoa.capacidadeAlocada;
    
    if (capacidadeRestante >= this.percentualAlocacao) {
      pessoa.capacidadeAlocada += this.percentualAlocacao;
      console.log(`✓ ${pessoa.nome} alocado(a) para sustentação (${this.percentualAlocacao}% de capacidade)`);
      console.log(`  Capacidade total alocada: ${pessoa.capacidadeAlocada}%\n`);
      return pessoa;
    } else {
      console.log(`✗ ${pessoa.nome} não tem capacidade disponível (${capacidadeRestante}% restante)`);
      console.log(`  Tentando próxima pessoa...\n`);
      return this.alocarSustentacao();
    }
  }

  /**
   * Libera alocação de uma pessoa
   */
  liberarAlocacao(nomePessoa) {
    const pessoa = this.pessoas.find(p => p.nome === nomePessoa);
    if (pessoa && pessoa.capacidadeAlocada >= this.percentualAlocacao) {
      pessoa.capacidadeAlocada -= this.percentualAlocacao;
      console.log(`✓ ${pessoa.nome} liberado(a) de sustentação (${this.percentualAlocacao}% de capacidade)`);
      console.log(`  Capacidade total alocada: ${pessoa.capacidadeAlocada}%\n`);
      return true;
    }
    return false;
  }

  /**
   * Exibe o status atual da equipe
   */
  exibirStatus() {
    console.log('═══════════════════════════════════════════════════');
    console.log('      STATUS DA ROTAÇÃO HÍBRIDA - SUSTENTAÇÃO      ');
    console.log('═══════════════════════════════════════════════════\n');
    
    this.pessoas.forEach(pessoa => {
      const barraCapacidade = '█'.repeat(pessoa.capacidadeAlocada / 5);
      const barraDisponivel = '░'.repeat((100 - pessoa.capacidadeAlocada) / 5);
      console.log(`${pessoa.nome.padEnd(12)} │ ${barraCapacidade}${barraDisponivel} ${pessoa.capacidadeAlocada}%`);
    });
    
    console.log('\n═══════════════════════════════════════════════════\n');
  }

  /**
   * Simula múltiplas alocações
   */
  simularRotacao(numeroAlocacoes = 10) {
    console.log(`\n🔄 Simulando ${numeroAlocacoes} alocações de sustentação...\n`);
    
    for (let i = 1; i <= numeroAlocacoes; i++) {
      console.log(`--- Alocação #${i} ---`);
      this.alocarSustentacao();
    }
    
    this.exibirStatus();
  }
}

// Execução principal
if (require.main === module) {
  const rotacao = new RotacaoHibrida();
  
  console.log('\n╔═══════════════════════════════════════════════════╗');
  console.log('║     SISTEMA DE ROTAÇÃO HÍBRIDA - SUSTENTAÇÃO     ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');
  
  // Exibe status inicial
  console.log('📊 Status inicial da equipe:\n');
  rotacao.exibirStatus();
  
  // Simula rotação
  rotacao.simularRotacao(10);
  
  console.log('✅ Simulação concluída!\n');
}

module.exports = RotacaoHibrida;
