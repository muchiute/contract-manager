# -------------------------------
# STAGE 1: Build da aplicação
# -------------------------------
FROM node:20-alpine AS build

# Dependências nativas necessárias para bcrypt e Prisma
RUN apk add --no-cache libc6-compat openssl bash python3 make g++

WORKDIR /usr/src/app

# Copiar apenas arquivos de dependências e instalar tudo
COPY package*.json ./
RUN npm install

# Copiar o restante do código (src, prisma, etc)
COPY . .

# Gerar Prisma Client e compilar o TypeScript
RUN npx prisma generate
RUN npm run build

# -------------------------------
# STAGE 2: Produção
# -------------------------------
FROM node:20-alpine

# Dependências nativas
RUN apk add --no-cache libc6-compat openssl bash

WORKDIR /usr/src/app

# Copiar apenas o necessário do estágio de build
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/package*.json ./

EXPOSE 5000

# Rodar migrations e iniciar a API
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
