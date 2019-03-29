#!/bin/bash

set -u -e -o pipefail

if [[ "$CI_TYPE" == "ON_DEMAND" ]]; then
  echo $CONFIG > ./src/config/config.json
else
  # Setup environment
  readonly thisDir=$(cd $(dirname $0); pwd)
  cp ${thisDir}/configs/deployment-config.json ${thisDir}/../../src/config/config.json
fi

echo -e "\Deployment application config added\n"
