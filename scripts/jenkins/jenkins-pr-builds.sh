#!/bin/bash

set -e

export DOCKER_NETWORK_NAME=cloudstack-network

export NODE_CHROME_YARN_IMAGE=m7ov/node8-chrome:0.4

export SIMULATOR_IMAGE=quay.io/ansible/cloudstack-test-container
export SIMULATOR_HOST_PORT=4220
export SIMULATOR_CONTAINER_PORT=8888
export SIMULATOR_STATUS_CHECK_PORT=4220 # Don't forget to map SIMULATOR_STATUS_CHECK_PORT if it differs from SIMULATOR_CONTAINER_PORT
export SIMULATOR_CONTAINER_NAME=cloudstack-simulator


# Preparation
./scripts/ci/remove-old-containers.sh
./scripts/ci/add-app-config.sh

# Lint, Unit tests
./scripts/ci/test.sh

# e2e tests
./scripts/ci/test-e2e.sh
