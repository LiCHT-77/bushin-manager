FROM node:16.14-alpine

RUN apk update \
    && apk upgrade \
    && apk add --no-cache bash make gcc g++ python3 \
    && npm install -g nuxt

EXPOSE 3000
