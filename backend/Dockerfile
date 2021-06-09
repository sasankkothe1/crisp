FROM node:latest

WORKDIR /usr/src/server

COPY package*.json ./

RUN npm install

COPY . ./

CMD ["npm", "run", "start"]
