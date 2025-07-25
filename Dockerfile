FROM node:20
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 8080
CMD ["node", "main.mjs"]




