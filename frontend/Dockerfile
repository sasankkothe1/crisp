FROM node:12

WORKDIR /usr/src/server

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . ./

CMD ["yarn", "start"]