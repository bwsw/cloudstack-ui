#!/bin/bash

set -u -e -o pipefail

echo -e "\nStart of e2e tests\n"

./scripts/ci/add-proxy-conf.sh
./scripts/ci/install-simulator.sh

docker run --rm \
  --network ${DOCKER_NETWORK_NAME} \
  -v $(pwd):/workspace \
  -w /workspace \
  ${NODE_CHROME_YARN_IMAGE} \
  /bin/bash -ce "yarn && yarn e2e --protractor-config=./e2e/protractor-ci.conf.js --suite=CI"

echo -e "\nEnd of e2e tests\n"
