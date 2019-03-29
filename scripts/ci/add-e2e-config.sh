#!/bin/bash

set -u -e -o pipefail

readonly thisDir=$(cd $(dirname $0); pwd)
cp ${thisDir}/configs/e2e-config.json ${thisDir}/../../src/config/config.json

echo -e "\nE2E application config added\n"
