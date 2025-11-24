FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos do projeto
COPY package*.json ./
COPY *.js ./

# Instalar dependências (se houver)
RUN npm install --production 2>/dev/null || true

# Comando padrão para executar o script
CMD ["node", "rotacao-semanal-rr.js"]
