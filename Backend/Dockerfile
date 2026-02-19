FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY tsconfig*.json ./
COPY src ./src

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig*.json ./

CMD ["sh", "-c", "node dist/migrate.js && node dist/main.js"]
