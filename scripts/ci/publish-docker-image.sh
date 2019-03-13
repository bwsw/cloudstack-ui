#!/bin/bash

set -e -u -o pipefail

docker login -u $BWSW_DOCKER_USERNAME -p $BWSW_DOCKER_PASSWORD

# Сreates a tagged image if the assembly was launched from the tagged commit
TAG=${GIT_TAG_NAME:-latest}
docker tag ${DOCKER_USER}/${DOCKER_REPO} ${DOCKER_USER}/${DOCKER_REPO}:${TAG}
docker push ${DOCKER_USER}/${DOCKER_REPO}:${TAG}

docker logout
