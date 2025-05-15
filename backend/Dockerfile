FROM node:18-alpine AS builder

RUN apk update && apk upgrade
RUN apk add --no-cache openssl

WORKDIR /app

# 1. Copiar archivos necesarios para dependencias
COPY package*.json ./
COPY src/persistence/prisma ./src/persistence/prisma/

# 2. Instalar dependencias y generar cliente Prisma
RUN npm ci
RUN npm run prisma:generate

# 3. Copiar el resto del código y construir
COPY . .
RUN npm run build

# Etapa de producción
FROM node:18-alpine AS prod

RUN apk update && apk upgrade
RUN apk add --no-cache openssl

WORKDIR /app

# Copiar desde el builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/persistence/prisma ./src/persistence/prisma

ENV NODE_ENV production
EXPOSE 3050

CMD ["npm", "run", "start:prod"]