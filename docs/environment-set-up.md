# Environment Set Up

## Getting started

```bash
$ git clone https://github.com/wongchito/RailMapGenerator.git
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
    mode: 'development',
    // ...
}
```

Uncomment local `React` and Material-UI scripts in `index3.html` for development. 

## Publishing

Revert changes of `webpack.config.js` described above.

```JavaScript
module.export = {
    // ...
    // devtool: 'inline-source-map',
    mode = 'production',
    // ...
}
```

Revert all changed of `index3.html` described above. 