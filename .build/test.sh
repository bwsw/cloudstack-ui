#!/bin/bash

# Run node container to install dependencies, test and build app
npm install;
echo ******Dependencies was installed******

npm run build
echo ******Dist was builded******

docker build -t cloudstack-nginx --file $(pwd)/Dockerfile $(pwd);

NGINXID=$(docker ps -aqf "name=cloudstack-nginx")
if [[ -n $NGINXID ]]; then
  docker stop $NGINXID;
  docker rm $NGINXID;
fi

echo Starting Nginx
docker run -d -p 80:80 --name cloudstack-nginx cloudstack-nginx;


