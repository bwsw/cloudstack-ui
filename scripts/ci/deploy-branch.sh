#!/bin/bash

set -e -u -o pipefail

docker stop "cloudstack-ui-$GITHUB_USER-$BRANCH_LOWER" 2> /dev/null || true
docker rm "cloudstack-ui-$GITHUB_USER-$BRANCH_LOWER" 2> /dev/null || true

docker run  --restart=always \
  --label branch=$BRANCH_LOWER \
  --label user=$GITHUB_USER \
  -e "BASE_HREF=/$GITHUB_USER/$BRANCH_LOWER/" \
  -e "PULSE_PLUGIN_ENDPOINT=$PULSE_PLUGIN_ENDPOINT" \
  -e "WEBSHELL_PLUGIN_ENDPOINT=$WEBSHELL_PLUGIN_ENDPOINT" \
  -e "CLIENT_ENDPOINT=$CLIENT_ENDPOINT" \
  -d --name "cloudstack-ui-$GITHUB_USER-$BRANCH_LOWER"\
  cloudstack-ui-branch;
