#!/bin/bash
set -eux

# run tests
npm run test:no-watch

# git config
git config --global user.name "Build Agent"
git config --global user.email rmg.build.agent@users.noreply.github.com

# variables
export APP_NAME=rmg
BRANCH=$(git branch | grep \* | cut -d ' ' -f2 | tr '/' '.')
UAT_REPO_NAME=uat-rail-map-generator

### BUMP VERSION
if [ "$BRANCH" = "master" ]
then
  # build with a normal version
  npm version prerelease -m "${APP_NAME}-%s release" --force || { echo "Release Error"; exit 1; }
  export RMG_VER=$(node -p "require('./package.json').version")
else
  # build with a hashed version
  VERSION=`node -p "require('./package.json').version"`
  GITHASH=$(git log -n 1 --pretty=%h)
  export RMG_VER="$VERSION.$BRANCH.$GITHASH"
  # git tag -a "${APP_NAME}-${RMG_VER}" -m "${APP_NAME}-${RMG_VER}"
fi


### BUILD
mkdir -p $UAT_REPO_NAME/$RMG_VER/

# PRD
if [ "$BRANCH" = "master" ]
then
  CI='' npm run build
  cp -r build/ $UAT_REPO_NAME/$RMG_VER/PRD/
fi

# UAT
cat package.json | sed '2 s/RailMapGenerator/uat-rail-map-generator/' > package-new.json
cp package-new.json package.json
CI='' npm run build
cp -r build/ $UAT_REPO_NAME/$RMG_VER/UAT/


### PUSH TAG AND COMMIT
if [ "$BRANCH" = "master" ]
then
  git push --atomic origin HEAD "${APP_NAME}-${RMG_VER}"
fi


### UPLOAD ARTIFACTS
cd $UAT_REPO_NAME/
git add .
git commit -m "Build RMG version $RMG_VER"
git push --force


echo "Build Success: $RMG_VER"
