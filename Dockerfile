FROM nginx

COPY ./.build/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./dist /var/www/dist
