#!/bin/bash
set -x

# build
npm run build

export APP_NAME=rmg
BRANCH=$(git branch | grep \* | cut -d ' ' -f2)

git config --global user.name "Build Agent"
git config --global user.email rmg.build.agent@users.noreply.github.com

if [ "$BRANCH" = "master" ]
then
  # build with a normal version
  npm version patch -m "${APP_NAME}-%s release" --force || { echo "Release Error"; exit 1; }
  export RELEASE_VERSION=$(node -p "require('./package.json').version")
else
  # build with a hashed version
  VERSION=`node -p "require('./package.json').version"`
  GITHASH=$(git log -n 1 --pretty=%h)
  export RELEASE_VERSION="$VERSION.$BRANCH.$GITHASH"
#  git tag -a "${APP_NAME}-${RELEASE_VERSION}" -m "${APP_NAME}-${RELEASE_VERSION} release"
fi

git push origin HEAD
git push origin "${APP_NAME}-${RELEASE_VERSION}"

echo "RMG_VER=${RELEASE_VERSION}" >> $GITHUB_ENV