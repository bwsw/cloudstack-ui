#!/bin/bash

# Run node container to install dependencies, test and build app
docker run --name node-install -v $(pwd):/workspace -w /workspace node npm i;
ID=$(docker ps -aqf "name=node-install")
docker wait $ID
docker rm $ID

docker run --name node-build -v $(pwd):/workspace -w /workspace node npm build;
ID=$(docker ps -aqf "name=node-build")
docker wait $ID
docker rm $ID

docker build -t cloudstack-nginx ./..;
docker run -d -p 80:80 --name cloudstack-nginx cloudstack-nginx;
