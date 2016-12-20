#!/bin/bash

# Run node container to install dependencies, test and build app
docker run --name node-install -v $(pwd):/workspace -w /workspace node npm i;
ID=$(docker ps -aqf "name=node-install")
docker wait $ID
docker rm $ID
echo Dependencies was installed

docker run --name node-build -v $(pwd):/workspace -w /workspace node npm run build;
ID=$(docker ps -aqf "name=node-build")
docker wait $ID
docker rm $ID
echo Dist was builded

docker build -t cloudstack-nginx ./..;

NGINXID=$(docker ps -aqf "name=cloudstack-nginx")
if [[ -n $NGINXID ]]; then
  docker stop $NGINXID;
fi
docker run -d -p 80:80 --name cloudstack-nginx cloudstack-nginx;
echo Nginx was started

