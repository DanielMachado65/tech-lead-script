# Tech Lead Scripts

Scripts para ajudar na função de Tech Lead, organizados por ambiente e tecnologia.

## 📁 Estrutura de Pastas

```
tech-lead-script/
├── node/                    # Scripts em Node.js
│   ├── rotacao-hibrida.js  # Sistema de rotação para sustentação
│   ├── package.json        # Configuração do projeto Node.js
│   └── Dockerfile          # Container Docker para scripts Node.js
└── docker-compose.yml      # Orquestração dos containers
```

## 🚀 Scripts Disponíveis

### Rotação Híbrida (Node.js)

Sistema de alocação de pessoas para sustentação, distribuindo a carga em 20% da capacidade de cada pessoa.

**Equipe:** Heitor, Eduardo, Laercio, Fernanda, Nathan

## 🐳 Como Usar com Docker

### Execução rápida (recomendado)

Use o helper `./run.sh` na raiz para rodar qualquer script Node dentro do container:

```bash
# Rotação híbrida
./run.sh rotacao:hibrida

# Round-robin simples
./run.sh rotacao:round-robin

# Round-robin diário
./run.sh rotacao:diaria-rr

# Passar argumentos adicionais ao script
./run.sh rotacao:hibrida --help
```

### Docker direto

```bash
# Construir a imagem
cd node
docker build -t tech-lead-rotacao .

# Executar o container
docker run --rm tech-lead-rotacao
```

## 💻 Como Usar Localmente (sem Docker)

### Requisitos

- Node.js 18 ou superior

### Executar Scripts Node.js

```bash
# Ir para o diretório node
cd node

# Instalar dependências (se houver)
npm install

# Executar o script de rotação
npm run rotacao

# Ou executar diretamente
node rotacao-hibrida.js
```

## 📊 Funcionalidades do Sistema de Rotação

- **Alocação automática**: Distribui pessoas para sustentação de forma rotativa
- **Controle de capacidade**: Cada pessoa é alocada com 20% de sua capacidade
- **Visualização**: Exibe o status atual de alocação da equipe
- **Simulação**: Permite simular múltiplas alocações para planejamento

## 🔧 Adicionar Novos Scripts

Para adicionar novos scripts em Node.js:

1. Crie o arquivo `.js` dentro da pasta `node/`
2. Adicione um script no `package.json` para facilitar a execução
3. Opcionalmente, atualize o `Dockerfile` se necessário

Para outros ambientes (Python, Go, etc.), crie uma nova pasta no padrão:

```
tech-lead-script/
├── node/        # Scripts Node.js
├── python/      # Scripts Python (futuro)
├── go/          # Scripts Go (futuro)
└── ...
```

## 📝 Licença

Este projeto está sob a licença especificada no arquivo LICENSE.
