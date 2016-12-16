#!/bin/bash

# Run node container to install dependencies, test and build app
docker run -v $(pwd):/workspace -w /workspace node npm i && npm test
docker run -v $(pwd):/workspace -w /workspace node npm build

#docker build -t cloudstack-nginx ./..
#docker run -d -p 80:80 --rm --name cloudstack-nginx cloudstack-nginx
