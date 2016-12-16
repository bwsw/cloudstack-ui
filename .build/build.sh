#!/bin/bash

docker run -v $(pwd):/workspace -w /workspace node npm i && npm test
docker run -v $(pwd):/workspace -w /workspace node npm build
