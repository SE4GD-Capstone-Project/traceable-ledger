FROM --platform=linux/amd64 node:alpine

CMD [ "mkdir", "/app/www/" ]

WORKDIR /app/www

COPY ./apps/www/ .

RUN npm install

ENV NODE_ENV production

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]