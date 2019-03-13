#!/bin/bash

set -u -e -o pipefail

if [[ "$CI_TYPE" == "ON_DEMAND" ]]; then
  echo $CONFIG > ./src/config/config.json
else
  # Setup environment
  readonly thisDir=$(cd $(dirname $0); pwd)
  cp ${thisDir}/configs/ci-config.json ${thisDir}/../../src/config/config.json
fi

echo -e "\nApplication config added\n"
