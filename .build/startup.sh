#! /bin/sh

EXTENSION_PULSE_URL=${PULSE_PLUGIN_ENDPOINT-"http://localhost/cs-extensions/pulse"}
EXTENSION_WEBSHELL_URL=${WEBSHELL_PLUGIN_ENDPOINT-"http://localhost/cs-extensions/webshell"}
# replace placeholders
sed -i -e 's#CLIENT_ENDPOINT#'"$CLIENT_ENDPOINT"'#g' /etc/nginx/conf.d/default.conf
sed -i -e 's#PULSE_PLUGIN_ENDPOINT#'"$EXTENSION_PULSE_URL"'#g' /etc/nginx/conf.d/default.conf
sed -i -e 's#WEBSHELL_PLUGIN_ENDPOINT#'"$EXTENSION_WEBSHELL_URL"'#g' /etc/nginx/conf.d/default.conf

# add base href
if [ -n "$BASE_HREF" ]; then
    sed -i -e 's#"/"#'"$BASE_HREF"'#g' /static/index.html
fi

# check if API is available
if [ -z $CLIENT_ENDPOINT ]; then
    echo "No Client Endpoint specified"
    exit 1
fi


API_STATUS=$(curl -k -s -o /dev/null -w "%{http_code}" --connect-timeout 10 $CLIENT_ENDPOINT/api) || true
CONSOLE_STATUS=$(curl -k -s -o /dev/null -w "%{http_code}" --connect-timeout 10 $CLIENT_ENDPOINT/console) || true
if [ $API_STATUS -ne "404" ] && [ $CONSOLE_STATUS -ne "404" ] && [ $API_STATUS -ne "000" ] && [ $CONSOLE_STATUS -ne "000" ] ; then
    nginx -g 'daemon off;'
else
    echo "Backend server is not available"
    exit 1
fi
