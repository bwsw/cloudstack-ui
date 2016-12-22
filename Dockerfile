FROM nginx

COPY ./.build/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./.build/replacePlaceholders.sh /etc/nginx/replacePlaceholders.sh
COPY ./dist /var/www/dist

CMD ["bin/bash", "/etc/nginx/replacePlaceholders.sh"]
