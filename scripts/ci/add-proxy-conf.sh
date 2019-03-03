#!/bin/bash

set -u -e -o pipefail

# Setup environment
readonly thisDir=$(cd $(dirname $0); pwd)

cat > ${thisDir}/../../proxy-conf.js << EOF
const CLOUDSTACK_ENDPOINT = 'http://${SIMULATOR_CONTAINER_NAME}:${SIMULATOR_CONTAINER_PORT}/';

const PROXY_CONFIG = [
  {
    context: ['/client/api', '/client/console'],
    target: CLOUDSTACK_ENDPOINT,
    secure: false,
  },
];

module.exports = PROXY_CONFIG;
EOF

echo "Proxy config added"
