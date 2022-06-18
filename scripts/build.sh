#!/bin/bash
set -eux

# bump resources version
npm i -g npm-check-updates
ncu -f '/@railmapgen\/rmg-(?!components).*/' -t patch -u
npm install

# run tests
npm run lint:fix
npm run test

# git config
git config --global user.name 'github-actions[bot]'
git config --global user.email 'github-actions[bot]@users.noreply.github.com'

# variables
export APP_NAME=rmg
BRANCH=$(git branch | grep \* | cut -d ' ' -f2 | tr '/' '.')
UAT_REPO_NAME=rmg-repositories

### BUMP VERSION
if [ "$BRANCH" = "main" ]
then
  # build with a normal version
  npm version patch -m "${APP_NAME}-%s release" --no-git-tag-version || { echo "Release Error"; exit 1; }
  export RMG_VER=$(node -p "require('./package.json').version")
else
  # build with a hashed version
  VERSION=$(node -p "require('./package.json').version")
  GITHASH=$(git log -n 1 --pretty=%h)
  export RMG_VER="$VERSION.$BRANCH.$GITHASH"
  # git tag -a "${APP_NAME}-${RMG_VER}" -m "${APP_NAME}-${RMG_VER}"
fi


### BUILD
mkdir -p $UAT_REPO_NAME/"$APP_NAME"/
CI='' npm run build
cp -r build/ $UAT_REPO_NAME/"$APP_NAME"/"$RMG_VER"/


### PUSH TAG AND COMMIT
if [ "$BRANCH" = "main" ]
then
  git add .
  git commit -m "${APP_NAME}-${RMG_VER} release"
  git tag -a "${APP_NAME}-${RMG_VER}" -m "${APP_NAME}-${RMG_VER} release"
  git push
  git push --atomic origin HEAD "${APP_NAME}-${RMG_VER}"
fi


### UPLOAD ARTIFACTS
cd $UAT_REPO_NAME/
git add .
git commit -m "Build RMG version $RMG_VER"
git push --force


echo "Build Success: $APP_NAME-$RMG_VER"
echo "::set-output name=RMG_VER::$RMG_VER"
