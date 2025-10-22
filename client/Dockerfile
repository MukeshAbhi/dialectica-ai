FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

COPY . .

# dummy DATABASE_URL for build time
ENV DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
RUN npm run build

EXPOSE 3001

ENV PORT=3001

CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npm run start"]