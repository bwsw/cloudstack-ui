FROM node:8 as builder

WORKDIR /tmp/cloudstackui

COPY package.json yarn.lock /tmp/cloudstackui/
RUN yarn install

COPY . /tmp/cloudstackui
RUN yarn run build:aot

FROM nginx:stable-alpine

COPY .build/nginx.conf /etc/nginx/conf.d/default.conf
COPY .build/startup.sh /etc/nginx/startup.sh

COPY --from=builder /tmp/cloudstackui/dist /static/

RUN  chmod 777 /etc/nginx/startup.sh

VOLUME /config/

RUN apk update \
    && apk add --update curl \
    && rm -rf /var/cache/apk/*

CMD ["/bin/sh", "-e", "/etc/nginx/startup.sh"]
