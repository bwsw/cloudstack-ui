#! /bin/bash

# Check if DEPLOY_PORT wasn't set
if [ -z "$DEPLOY_PORT" ]; then
  export DEPLOY_PORT="80";
fi

if [ -n "$CONFIG_PATH" ]; then
  export CONFIG_MOUNT="-v ${CONFIG_PATH}:/config";
else
  export CONFIG_MOUNT="";
fi

if [ $# -eq 0 ]; then
  export API=$API_BACKEND_URL;
  export CONSOLE=$CONSOLE_BACKEND_URL;
else
  export API=$1;
  export CONSOLE=$2;
fi

# Generate container name unique for port
CONTAINER_NAME=cloudstack-ui
CONTAINER_NAME=$CONTAINER_NAME-$DEPLOY_PORT

# Check if nginx is running and then stop it
NGINX_ID=$(docker ps -aqf "name=$CONTAINER_NAME")
if [[ -n $NGINX_ID ]]; then
  docker stop $NGINX_ID;
  docker rm $NGINX_ID;
fi

# Starting server
echo ******Starting Nginx******
docker run -e "API_BACKEND_URL=$API" "CONSOLE_BACKEND_URL=$CONSOLE" -d -p $DEPLOY_PORT:80 --name $CONTAINER_NAME $CONFIG_MOUNT bwsw/cloudstack-ui;
