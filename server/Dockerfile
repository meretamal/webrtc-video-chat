FROM node

WORKDIR /usr/src

COPY package.json .
COPY yarn.lock .
ENV PATH=/usr/src/node_modules/.bin:$PATH

RUN yarn install

WORKDIR /usr/src/app

COPY . .

CMD [ "yarn start:dev" ]
