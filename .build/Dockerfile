FROM nginx
VOLUME /config

COPY .build/nginx.conf /etc/nginx/conf.d/default.conf
COPY .build/startup.sh /etc/nginx/startup.sh
COPY dist /var/www/dist
RUN chmod 777 /etc/nginx/startup.sh

CMD ["/bin/bash", "-e", "/etc/nginx/startup.sh"]
