# How to deploy the latest version of RMG?

This instruction is dedicated for collaborators who have write access to the repository.

## Preview (Local)

(To be added)

## Preview

You may want to preview your changes in real GitHub pages before deploying to `origin` remote. By doing so, you should first prepare an empty (or unused) repository of your own. According to GitHub's policy, GitHub pages service is only available for PRO user or a public repository of a standard user.

Then, change `homepage` of `package.json` to your GitHub pages URL. This step is important because it determines the relative paths of the complied scripts.

```diff
{
-   "homepage": "https://wongchito.github.io/RailMapGenerator",
+   "homepage": "https://wongchito.github.io/rmg-test-page",
    ...
}
```

By now you may build the project with the modified configuration and deploy it to your GitHubs' repository.

```bash
$ npm run build
$ npx gh-pages -d build --repo https://github.com/wongchito/rmg-test-page
```

After previewing, please make sure you have reverted the changes you made to `package.json`.

For more details please visit [Deployment - Create React App Docs](https://create-react-app.dev/docs/deployment#github-pages)

## Publish **(Danger)**

Run `npm run deploy` in Terminal. It will build and deploy automatically for you. **BUT** please make sure that the web page is 100% working or you should [preview](#Preview) it before publishing.
