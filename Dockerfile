FROM node:18-alpine

WORKDIR /app

COPY package.json .

COPY .env.example .env

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8085

CMD [ "npm", "run", "preview" ]