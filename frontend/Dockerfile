FROM node:16

WORKDIR /usr/src/server

COPY package*.json ./

RUN npm install

COPY . ./

CMD ["npm", "run", "start"]