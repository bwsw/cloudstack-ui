#!/bin/bash

set -e

if [[ "$CI_TYPE" =~ ^(MASTER|PR|ON_DEMAND|RELEASE)$ ]]; then
  echo "CI type is ${CI_TYPE}"
else
  echo "Unknown CI_TYPE. Ensure that the correct CI_TYPE env var is specified."
  exit 1;
fi

export DOCKER_NETWORK_NAME=cloudstack-network

export NODE_CHROME_YARN_IMAGE=m7ov/node8-chrome:0.4

export SIMULATOR_IMAGE=quay.io/ansible/cloudstack-test-container
export SIMULATOR_HOST_PORT=4220
export SIMULATOR_CONTAINER_PORT=8888
export SIMULATOR_STATUS_CHECK_PORT=4220 # Don't forget to map SIMULATOR_STATUS_CHECK_PORT if it differs from SIMULATOR_CONTAINER_PORT
export SIMULATOR_CONTAINER_NAME=cloudstack-simulator

export DOCKER_USER=tamazlykar
#export DOCKER_USER=bwsw
export DOCKER_REPO=cloudstack-ui


# Preparation
./scripts/ci/remove-old-containers.sh

if [[ "$CI_TYPE" != "RELEASE" ]]; then
  ./scripts/ci/add-app-config.sh
fi

# Lint, Unit tests
./scripts/ci/test.sh

# e2e tests
#./scripts/ci/test-e2e.sh

# Deploy
./scripts/ci/build.sh
if [[ "$CI_TYPE" != "RELEASE" ]]; then
  ./scripts/ci/deploy.sh
fi

if [[ "$CI_TYPE" == "RELEASE" ]]; then
  ./scripts/ci/publish-docker-image.sh
fi
