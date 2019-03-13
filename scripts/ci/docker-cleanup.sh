#!/bin/bash

set -e

echo -e "\nDocker cleanup starts\n"

docker ps | grep 'weeks ago' | grep 'cloudstack-ui' | awk '{print $1}' | xargs docker rm -f 2> /dev/null || true;

docker system prune --force --filter "label!=do-not-remove"

echo -e "\nDocker cleanup finished\n"
