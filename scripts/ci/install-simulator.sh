#!/bin/bash

set -u -o pipefail

SIMULATOR_IMAGE=quay.io/ansible/cloudstack-test-container
HOST_PORT=4200
APP_CONTAINER_PORT=8888
STATUS_CHECK_PORT=4200

docker stop cloudstack-simulator
docker rm cloudstack-simulator

# Don't forget to map STATUS_CHECK_PORT if it differs from APP_CONTAINER_PORT
docker run --name cloudstack-simulator -d -p ${HOST_PORT}:${APP_CONTAINER_PORT} ${SIMULATOR_IMAGE}
echo "Docker container is started"

echo "Wait until simulator initialized"
for i in $(seq 1 200); do
  PORT_STATUS=$(curl -LI 127.0.0.1:${STATUS_CHECK_PORT} -o /dev/null -w '%{http_code}\n' -s);
  if [ "$PORT_STATUS" = "403" ]; then
    echo -e "\nSimulator initialization is done";
    break;
  fi;
  echo -en "\rChecking... ($i/200)";
  echo -e "\n Server HTTP response $PORT_STATUS";
  sleep 5;
done
