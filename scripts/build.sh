#!/bin/bash
# CI 构建脚本：运行检查、生成版本号并发布标签与构建产物。
set -eux

# 运行测试
npm run lint:fix
npm run test

# 配置 Git 身份
git config --global user.name 'github-actions[bot]'
git config --global user.email 'github-actions[bot]@users.noreply.github.com'

# 环境变量
export APP_NAME=rmg
BRANCH=$(git branch | grep \* | cut -d ' ' -f2 | tr '/' '.')

### 更新版本号
if [ "$BRANCH" = "main" ]
then
  # 使用正式版本号构建
  npm version $BUMP_VERSION -m "${APP_NAME}-%s release" --no-git-tag-version || { echo "Release Error"; exit 1; }
  export RMG_VER=$(node -p "require('./package.json').version")
else
  # 使用带提交哈希的版本号构建
  VERSION=$(node -p "require('./package.json').version")
  GITHASH=$(git log -n 1 --pretty=%h)
  export RMG_VER="$VERSION.$BRANCH.$GITHASH"
  # 已停用的标签命令：git tag -a "${APP_NAME}-${RMG_VER}" -m "${APP_NAME}-${RMG_VER}"
fi

### 构建
CI='' npm run build

### 推送提交与标签
if [ "$BRANCH" = "main" ]
then
  git add .
  git commit -m "${APP_NAME}-${RMG_VER} release"
  git tag -a "${APP_NAME}-${RMG_VER}" -m "${APP_NAME}-${RMG_VER} release"
  git push
  git push --atomic origin HEAD "${APP_NAME}-${RMG_VER}"
fi

echo "Build Success: $APP_NAME-$RMG_VER"
echo "RMG_VER=$RMG_VER" >> $GITHUB_OUTPUT
