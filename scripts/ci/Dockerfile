FROM firesh/nginx-lua

COPY .build/nginx.conf /etc/nginx/conf.d/default.conf
COPY .build/startup.sh /etc/nginx/startup.sh

COPY /dist/cloudstack-ui /static/

RUN  chmod 777 /etc/nginx/startup.sh

VOLUME /config/

RUN apk update \
    && apk add --update curl \
    && rm -rf /var/cache/apk/*

CMD ["/bin/sh", "-e", "/etc/nginx/startup.sh"]
