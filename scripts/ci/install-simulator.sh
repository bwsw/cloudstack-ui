#!/bin/bash

set -u -o pipefail

docker run --name cloudstack-simulator -d -p 8888:8888 -p 4220:8080 quay.io/ansible/cloudstack-test-container
echo "Docker container is started"

echo "Wait until simulator initialized"
for i in $(seq 1 200); do
  PORT_STATUS=$(curl -LI 127.0.0.1:8888 -o /dev/null -w '%{http_code}\n' -s);
  echo -e "\n$PORT_STATUS";
  docker logs --tail=20 cloudstack-simulator
  if [ "$PORT_STATUS" = "403" ]; then
    echo -e "\nSimulator initialization is done";
    break;
  fi;
  echo -en "\rChecking... ($i/200)";
  sleep 5;
done
