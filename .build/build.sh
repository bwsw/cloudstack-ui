#!/bin/bash

# Run node container to install dependencies, test and build app
ID=docker run --rm -v $(pwd):/workspace -w /workspace node npm i;
docker wait $ID
ID=docker run --rm -v $(pwd):/workspace -w /workspace node npm build;
docker wait $ID

ID=docker build -t cloudstack-nginx ./..;
docker wait $ID
docker run -d -p 80:80 --name cloudstack-nginx cloudstack-nginx;
