#!/bin/bash

set -e -u -o pipefail

echo -e "\nStart of dependency installation, lint and format checks, unit tests\n"

docker run --rm \
  -v $(pwd):/workspace \
  -w /workspace \
  ${NODE_CHROME_YARN_IMAGE} \
  /bin/bash -ce "yarn && yarn lint && yarn format:check && yarn test"

echo -e "\nEnd of dependency installation, lint and format checks, unit tests\n"
