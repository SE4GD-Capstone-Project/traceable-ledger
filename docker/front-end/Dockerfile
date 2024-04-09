FROM node:alpine

CMD [ "mkdir", "/code/front-end/" ]

WORKDIR /code/front-end

COPY ../../front-end .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]