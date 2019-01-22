#!/bin/bash

set -u -e -o pipefail

# Setup environment
readonly thisDir=$(cd $(dirname $0); pwd)
echo ${thisDir}

cp ${thisDir}/proxy-conf-ci.js ${thisDir}/../../proxy-conf.js
