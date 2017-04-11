#!/bin/bash

# Run node container to install dependencies, test and build app
npm install;
echo ******Dependencies was installed******

npm run build
echo ******Dist was built******

# Build docker image
docker build -t cloudstack-nginx --file=Dockerfile ..
