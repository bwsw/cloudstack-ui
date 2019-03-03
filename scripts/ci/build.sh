#!/bin/bash

set -e -u -o pipefail

function buildForDeployment {
  docker run --rm \
    -v $(pwd):/workspace \
    -w /workspace \
    ${NODE_CHROME_YARN_IMAGE} \
    /bin/bash -ce "yarn build --prod"

  docker build -t cloudstack-ui-${CI_TYPE} -f ./scripts/ci/Dockerfile .
}

if [[ "$CI_TYPE" == "RELEASE" ]]; then
  docker build -t ${DOCKER_USER}/${DOCKER_REPO} .
else
  buildForDeployment
fi

