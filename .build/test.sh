#!/bin/bash

# Run node container to install dependencies, test and build app
npm install;
echo \n******Dependencies was installed******\n

npm run build
echo \n******Dist was builded******\n

docker build -t cloudstack-nginx --file $(pwd)/Dockerfile $(pwd);

NGINXID=$(docker ps -aqf "name=cloudstack-nginx")
if [[ -n $NGINXID ]]; then
  docker stop $NGINXID;
fi

echo Starting Nginx
docker run -d -p 80:80 --name cloudstack-nginx cloudstack-nginx;


