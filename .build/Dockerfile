FROM nginx:stable-alpine
VOLUME /config/

COPY .build/nginx.conf /etc/nginx/conf.d/default.conf
COPY .build/startup.sh /etc/nginx/startup.sh
COPY dist /static
RUN chmod 777 /etc/nginx/startup.sh
RUN apk add --update curl

CMD ["/bin/sh", "-e", "/etc/nginx/startup.sh"]
