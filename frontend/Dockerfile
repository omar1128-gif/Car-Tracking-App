FROM node:12-alpine

WORKDIR /usr/src/frontend

COPY package*.json ./

RUN npm install --production=true && npm cache clean --force

COPY . .

CMD [ "npm", "start" ]

EXPOSE 3000