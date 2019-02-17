#!/bin/bash

set -u -e -o pipefail

# Setup environment
readonly thisDir=$(cd $(dirname $0); pwd)

cp ${thisDir}/configs/pr-config.json ${thisDir}/../../src/config/config.json

echo "Application config added"
