FROM node:8-alpine as builder

COPY . /tmp/cloudstackui

WORKDIR /tmp/cloudstackui

RUN yarn install --verbose \
    && yarn run build:aot

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
