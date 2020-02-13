# Environment Set Up

## Getting started

```bash
$ git clone https://github.com/thekingofcity/RailMapGenerator.git
$ cd RailMapGenerator
$ npm install
# launch the build whenever there is a modification
$ npx webpack -watch
```

## Debugging

Change relevant properties of `webpack.config.js` for development and debugging.

```JavaScript
module.export = {
    // ...
    devtool: 'inline-source-map',
    mode = 'development',
    // ...
}
```

## Publishing

Revert changes of `webpack.config.js` describe above.

```JavaScript
module.export = {
    // ...
    // devtool: 'inline-source-map',
    mode = 'production',
    // ...
}
```
