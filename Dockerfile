FROM node:8 as builder

WORKDIR /tmp/cloudstackui

COPY package.json yarn.lock /tmp/cloudstackui/
RUN yarn install

COPY . /tmp/cloudstackui
RUN yarn build --prod --aot

FROM firesh/nginx-lua

COPY .build/nginx.conf /etc/nginx/conf.d/default.conf
COPY .build/startup.sh /etc/nginx/startup.sh

COPY --from=builder /tmp/cloudstackui/dist/cloudstack-ui /static/

RUN  chmod 777 /etc/nginx/startup.sh

VOLUME /config/

RUN apk update \
    && apk add --update curl \
    && rm -rf /var/cache/apk/*

CMD ["/bin/sh", "-e", "/etc/nginx/startup.sh"]
