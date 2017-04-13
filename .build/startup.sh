#! /bin/sh

# replace placeholders
sed -i -e 's#API_BACKEND_URL#'"$API_BACKEND_URL"'#g' /etc/nginx/conf.d/default.conf
if [ -e '/config/config.json' ]; then
    mkdir -p /var/www/dist/config && cp /config/config.json /var/www/dist/config
fi
nginx -g 'daemon off;'
