if [ -z "$DEPLOY_PORT" ]; then
  export DEPLOY_PORT="8080";
fi

sed -i -e 's#API_BACKEND_URL#'"$API_BACKEND_URL"'#g' /etc/nginx/conf.d/default.conf
sed -i -e 's#DEPLOY_PORT#'"$DEPLOY_PORT"'#g' /etc/nginx/conf.d/default.conf
