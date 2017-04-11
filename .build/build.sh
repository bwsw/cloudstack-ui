#! /bin/bash

# Run node container to install dependencies, test and build app
npm install;
echo ******Dependencies were installed******

npm run build:aot
echo ******Dist was built******

# Build docker image
docker build -t cloudstack-nginx --file=Dockerfile ..
