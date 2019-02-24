#!/bin/bash

set -e -u -o pipefail

if [ "$(docker ps -aq -f name=${SIMULATOR_CONTAINER_NAME})" ]; then
  docker stop ${SIMULATOR_CONTAINER_NAME} && docker rm ${SIMULATOR_CONTAINER_NAME}
fi

docker run --name ${SIMULATOR_CONTAINER_NAME} -d \
  --network ${DOCKER_NETWORK_NAME} \
  -p ${SIMULATOR_HOST_PORT}:${SIMULATOR_CONTAINER_PORT} \
  ${SIMULATOR_IMAGE}

echo "Docker container is started";
sleep 5;

echo "Wait until simulator initialized"
for i in $(seq 1 200); do
  PORT_STATUS=$(curl -LI 127.0.0.1:${SIMULATOR_STATUS_CHECK_PORT} -o /dev/null -w '%{http_code}\n' -s);
  if [ "$PORT_STATUS" = "403" ]; then
    echo -e "\nSimulator initialization is done";
    break;
  fi;
  echo -en "\rChecking... ($i/200)";
  echo -e "\n Server HTTP response $PORT_STATUS";
  sleep 5;
done
