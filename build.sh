#!/bin/bash
set -x

export APP_NAME=rmg
BRANCH=$(git branch | grep \* | cut -d ' ' -f2)

if [ "$BRANCH" = "master" ]
then
  # build with a normal version
  npm version patch -m "%s release" --force || { echo "Release Error"; exit 1; }
  export RELEASE_VERSION=$(node -p "require('./package.json').version")
  git tag -a "${APP_NAME}-${RELEASE_VERSION}" -m "${APP_NAME}-${RELEASE_VERSION}"
  git push origin HEAD
  git push origin "${APP_NAME}-${RELEASE_VERSION}"
else
  # build with a hashed version
  VERSION=`node -p "require('./package.json').version"`
  GITHASH=$(git log -n 1 --pretty=%h)
  export RELEASE_VERSION="$VERSION.$BRANCH.$GITHASH"
fi
