#! /bin/sh

PULSE_URL=${PULSE_PLUGIN_ENDPOINT-"http://cs-extensions/pulse"}
# replace placeholders
sed -i -e 's#API_BACKEND_URL#'"$API_BACKEND_URL"'#g' /etc/nginx/conf.d/default.conf
sed -i -e 's#CONSOLE_BACKEND_URL#'"$CONSOLE_BACKEND_URL"'#g' /etc/nginx/conf.d/default.conf
sed -i -e 's#PULSE_PLUGIN_ENDPOINT#'"$PULSE_URL"'#g' /etc/nginx/conf.d/default.conf

# add base href
if [ -n "$BASE_HREF" ]; then
    sed -i -e 's#"/"#'"$BASE_HREF"'#g' /static/index.html
fi

# check if API is available
if [ -z $API_BACKEND_URL ]; then
    echo "No API backend address specified"
    exit 1
fi

if [ -z $CONSOLE_BACKEND_URL ]; then
    echo "No console backend address specified"
    exit 1
fi

API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 $API_BACKEND_URL)
CONSOLE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 $CONSOLE_BACKEND_URL)
if [ $API_STATUS -ne "404" ] && [ $CONSOLE_STATUS -ne "404" ] && [ $API_STATUS -ne "000" ] && [ $CONSOLE_STATUS -ne "000" ] ; then
    nginx -g 'daemon off;'
else
    echo "Backend server is not available"
fi
