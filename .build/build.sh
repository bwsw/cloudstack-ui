#! /bin/bash

COMMAND="npm i && npm rebuild node-sass && npm run build"

docker run -v  $(pwd)/..:/workspace -w /workspace node /bin/bash -ce "$COMMAND"

# Build docker image
docker build -t cloudstack-nginx --file=Dockerfile ..
