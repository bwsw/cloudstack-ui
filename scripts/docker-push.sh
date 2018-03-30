#!/bin/bash

# To run the docker login command non-interactively, you can set the --password-stdin flag to provide a password
# through STDIN. Using STDIN prevents the password from ending up in the shell’s history, or log-files.

echo $BWSW_DOCKER_PASSWORD | docker login --username $BWSW_DOCKER_USERNAME --password-stdin


# Сreates a tagged image if the assembly was launched from the tagged comit

if [ -z ${TRAVIS_TAG} ]
then
  docker push ${DOCKER_USER}/${DOCKER_REPO}
else
  docker tag ${DOCKER_USER}/${DOCKER_REPO} ${DOCKER_USER}/${DOCKER_REPO}:${TRAVIS_TAG}
  docker push ${DOCKER_USER}/${DOCKER_REPO}:${TRAVIS_TAG}
fi
