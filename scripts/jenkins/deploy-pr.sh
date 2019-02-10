#!/bin/bash

set -e -o pipefail

# Remove all unused containers, networks, images (both dangling and unreferenced), and optionally, volumes.
docker ps | grep 'weeks ago' | grep 'cloudstack-ui' | awk '{print $1}' | xargs docker rm -f 2> /dev/null || true;
docker system prune -f

echo $CONFIG > ./src/config/config.json


./scripts/ci/add-proxy-conf.sh
./scripts/ci/install-simulator.sh


echo -e "\nBuilding docker image\n"
docker build -t cloudstack-ui-pr .

docker stop "cloudstack-ui-$ghprbPullId" 2> /dev/null || true
docker rm "cloudstack-ui-$ghprbPullId" 2> /dev/null || true

echo -e "\nRunning docker container\n"
  docker run  --restart=always \
  --label pr_id=$ghprbPullId \
  -e "BASE_HREF=/$ghprbPullId/" \
  -e "PULSE_PLUGIN_ENDPOINT=$PULSE_PLUGIN_ENDPOINT" \
  -e "WEBSHELL_PLUGIN_ENDPOINT=$WEBSHELL_PLUGIN_ENDPOINT" \
  -e "CLIENT_ENDPOINT=$CLIENT_ENDPOINT" \
  -d --name "cloudstack-ui-$ghprbPullId"\
  cloudstack-ui-pr;
