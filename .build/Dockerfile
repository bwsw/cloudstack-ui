FROM nginx

COPY .build/nginx.conf /etc/nginx/conf.d/default.conf
COPY .build/replace-placeholders.sh /etc/nginx/replace-placeholders.sh
COPY dist /var/www/dist
RUN chmod 777 /etc/nginx/replace-placeholders.sh

CMD ["/bin/bash", "-e", "/etc/nginx/replace-placeholders.sh"]
