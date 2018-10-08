FROM node:10-alpine

RUN apk update && apk add git supervisor && rm -rf /var/run/apk/*

ADD package.json /usr/src/app/
ADD yarn.lock /usr/src/app/

RUN mkdir -p /usr/src/app
RUN chown -R node: /usr/src/app

USER node
WORKDIR /usr/src/app/

RUN yarn install

ADD . /usr/src/app/

RUN NODE_ENV=production yarn build

USER root
