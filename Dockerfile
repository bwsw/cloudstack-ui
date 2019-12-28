FROM node:8 as builder

# Build cloudstack UI app
WORKDIR /tmp/cloudstackui
COPY package.json yarn.lock /tmp/cloudstackui/
RUN yarn install
COPY . /tmp/cloudstackui
RUN yarn build --prod


FROM openresty/openresty:alpine-nosse42

# Copy nginx and supervisor configs and scripts
COPY .build/nginx.conf /etc/nginx/conf.d/default.conf
COPY .build/startup.sh /etc/nginx/startup.sh
COPY .build/supervisor.conf /etc/supervisord.conf

# Copy cloustack UI assets
COPY --from=builder /tmp/cloudstackui/dist/cloudstack-ui /static/

RUN apk update \
    && apk add --update curl supervisor nodejs \
    && apk add --update npm \
    && rm -rf /var/cache/apk/*

# Copy and init http access helper server
WORKDIR /cloudstack-http-access-helper
COPY projects/http-access-helper/ /cloudstack-http-access-helper/
RUN npm install --production

RUN  chmod 777 /etc/nginx/startup.sh

VOLUME /config/

# Run supervisor which starts nginx and node (http access helper)
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
