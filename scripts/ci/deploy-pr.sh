#!/bin/bash

set -e -u -o pipefail

docker stop "cloudstack-ui-$ghprbPullId" 2> /dev/null || true
docker rm "cloudstack-ui-$ghprbPullId" 2> /dev/null || true

docker run  --restart=always \
  --label pr_id=$ghprbPullId \
  -e "BASE_HREF=/$ghprbPullId/" \
  -e "PULSE_PLUGIN_ENDPOINT=$PULSE_PLUGIN_ENDPOINT" \
  -e "WEBSHELL_PLUGIN_ENDPOINT=$WEBSHELL_PLUGIN_ENDPOINT" \
  -e "CLIENT_ENDPOINT=$CLIENT_ENDPOINT" \
  -d --name "cloudstack-ui-$ghprbPullId"\
  cloudstack-ui-pr;
