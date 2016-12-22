#!/bin/bash

# Run node container to install dependencies, test and build app
npm install;
echo ******Dependencies was installed******

npm run build
echo ******Dist was builded******

# Build docker image
docker build -t cloudstack-nginx --file $(pwd)/Dockerfile $(pwd);

# Genetate container name unique for port
CONTAINER_NAME=cloudstack-nginx
CONTAINER_NAME=$CONTAINER_NAME-$DEPLOY_PORT

# Check if nginx is running and then stop it
NGINX_ID=$(docker ps -aqf "name=$CONTAINER_NAME")
if [[ -n $NGINX_ID ]]; then
  docker stop $NGINX_ID;
  docker rm $NGINX_ID;
fi

# Starting server
echo ******Starting Nginx******
docker run -e "API_BACKEND_URL=$API_BACKEND_URL" -e "DEPLOY_PORT=$DEPLOY_PORT" -d -p $DEPLOY_PORT:80 --name $CONTAINER_NAME cloudstack-nginx;




