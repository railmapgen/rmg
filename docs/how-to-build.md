# How to test, build and deploy RMG on different environments?

This instruction is dedicated for collaborators who have write access to the repository.

## Local Test

```shell
$ npm run start # Auto hot-reload on save
```

## Build and Deploy

1. Push your commits to remote
2. Build manually in [Actions](https://github.com/wongchito/RailMapGenerators/actions) with specified branch name
3. Check the lasted build version
4. Choose "Release" and enter the version and environment (UAT, User Acceptance Testing, or PRD, Production) you want to deploy on

## Notes

You may find all build packages in [UAT-RMG repository](https://github.com/wongchito/uat-rail-map-generator)