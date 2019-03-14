#!/bin/bash

set -e -u -o pipefail

echo -e "\nBuild an app image from a Dockerfile started\n"

function buildForDeployment {
  docker run --rm \
    -v $(pwd):/workspace \
    -w /workspace \
    ${NODE_CHROME_YARN_IMAGE} \
    /bin/bash -ce "yarn build --prod"

  docker build -t cloudstack-ui-${CI_TYPE_LOWER} -f ./scripts/ci/Dockerfile .
}

CI_TYPE_LOWER=`echo "$CI_TYPE" | tr '[:upper:]' '[:lower:]'`

if [[ "$CI_TYPE" == "RELEASE" ]]; then
  docker build -t ${DOCKER_USER}/${DOCKER_REPO} .
elif [[ "$CI_TYPE" == "MASTER" ]]; then
  docker build -t cloudstack-ui-${CI_TYPE_LOWER} .
else
  buildForDeployment
fi

echo -e "\nBuild an app image from a Dockerfile finished\n"
