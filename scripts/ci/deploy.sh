#!/bin/bash

set -e -u -o pipefail

function deployPr {
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
}

function deployUserBranch {
  BRANCH_LOWER=`echo "$BRANCH" | tr '[:upper:]' '[:lower:]'`
  BRANCH_LOWER=`echo ${BRANCH_LOWER##*/}`

  docker stop "cloudstack-ui-$GITHUB_USER-$BRANCH_LOWER" 2> /dev/null || true
  docker rm "cloudstack-ui-$GITHUB_USER-$BRANCH_LOWER" 2> /dev/null || true

  docker run  --restart=always \
    --label branch=$BRANCH_LOWER \
    --label user=$GITHUB_USER \
    -e "BASE_HREF=/$GITHUB_USER/$BRANCH_LOWER/" \
    -e "PULSE_PLUGIN_ENDPOINT=$PULSE_PLUGIN_ENDPOINT" \
    -e "WEBSHELL_PLUGIN_ENDPOINT=$WEBSHELL_PLUGIN_ENDPOINT" \
    -e "CLIENT_ENDPOINT=$CLIENT_ENDPOINT" \
    -d --name "cloudstack-ui-$GITHUB_USER-$BRANCH_LOWER"\
    cloudstack-ui-branch;
}

if [[ "$CI_TYPE" == "PR" ]]; then
  deployPr
elif [[ "$CI_TYPE" == "ON_DEMAND" ]]; then
  deployUserBranch
elif [[ "$CI_TYPE" == "MASTER" ]]; then
  BRANCH=master
  GITHUB_USER=bwsw
  deployUserBranch
fi
