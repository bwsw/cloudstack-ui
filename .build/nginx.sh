#!/bin/bash

docker run -p 80:80 --name docker-nginx --rm -v $(dirname $(pwd))/dist:/var/www/dist -v $(pwd)/nginx.conf:/etc/nginx/conf.d/default.conf nginx

