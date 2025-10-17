# Stage 1: Build
FROM node:20-alpine AS build

# Instalar dependências nativas necessárias
RUN apk add --no-cache libc6-compat openssl bash

WORKDIR /usr/src/app

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm install

# Copiar todo o backend
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

RUN apk add --no-cache libc6-compat openssl bash

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

# Copiar build e Prisma Client do stage de build
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/node_modules ./node_modules

EXPOSE 5000

# Start da aplicação
CMD ["node", "dist/index.js"]
