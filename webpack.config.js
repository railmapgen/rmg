const path = require('path');

module.exports = {
  entry: {
      index: './src/index',
      lang: './src/lang'
  }, 
  // uncomment devtool for debugging
  // devtool: 'inline-source-map',
  // change to development when debugging
  mode: 'production', 
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/, 
      },
    ]
  },
  resolve: {
    extensions: [
      '.ts', '.js'
    ], 
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  }, 
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  externals: {
    jquery: 'jQuery', 
    '@material/dialog': 'mdc.dialog',
    '@material/list': 'mdc.list',
    '@material/menu': 'mdc.menu',
    '@material/menu-surface': 'mdc.menuSurface',
    '@material/select': 'mdc.select',
    '@material/slider': 'mdc.slider',
    '@material/switch': 'mdc.switchControl',
    '@material/tab-bar': 'mdc.tabBar',
    '@material/textfield': 'mdc.textField',
  }
};