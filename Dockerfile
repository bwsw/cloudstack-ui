FROM bwsw/alpine-nginx-node
VOLUME /config/

COPY .build/nginx.conf /etc/nginx/conf.d/default.conf
COPY .build/startup.sh /etc/nginx/startup.sh
COPY . /tmp/cloudstackui
RUN apk update && \
    apk add --update curl && \
    cd /tmp/cloudstackui && \
    yarn && yarn run build:aot && \
    mkdir -p /static && cp -R dist/. /static/ && \
    chmod 777 /etc/nginx/startup.sh && chmod 755 /static \
    && rm -rf /tmp/cloudstackui

CMD ["/bin/sh", "-e", "/etc/nginx/startup.sh"]
