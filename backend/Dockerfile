FROM node:12-alpine

WORKDIR /usr/src/backend

COPY package*.json ./

RUN npm install --production=true && npm cache clean --force

COPY . .

CMD [ "node", "app.js" ] 

EXPOSE 5000