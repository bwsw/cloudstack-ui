FROM nginx

COPY ./.build/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./.build/replace-placeholders.sh /etc/nginx/replace-placeholders.sh
COPY ./dist /var/www/dist

CMD ["bin/bash", "/etc/nginx/replace-placeholders.sh"]
