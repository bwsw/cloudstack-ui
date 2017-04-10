sed -i -e 's#API_BACKEND_URL#'"$API_BACKEND_URL"'#g' /etc/nginx/conf.d/default.conf
nginx -g 'daemon off;'
