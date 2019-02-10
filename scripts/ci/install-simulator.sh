#!/bin/bash

set -u -o pipefail

SIMULATOR_IMAGE=tamazlykar/cs-sim-no-kafka
STATUS_CHECK_PORT=8888

docker run --name cloudstack-simulator -d -p 4220:8888 ${SIMULATOR_IMAGE}
echo "Docker container is started"

echo "Wait until simulator initialized"
for i in $(seq 1 200); do
  PORT_STATUS=$(curl -LI 127.0.0.1:${STATUS_CHECK_PORT} -o /dev/null -w '%{http_code}\n' -s);
#  docker logs --tail=20 cloudstack-simulator  todo remove
  if [ "$PORT_STATUS" = "403" ]; then
    echo -e "\nSimulator initialization is done";
    break;
  fi;
  echo -en "\rChecking... ($i/200)";
  echo -e "\n Server HTTP response $PORT_STATUS";
  sleep 5;
done
