const path = require('path');

module.exports = {
  entry: {
      index: './src/index',
      lang: './src/lang', 
      querycheck: './src/querycheck'
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
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/'
  }, 
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  externals: {
    jquery: 'jQuery', 
    '@material/dialog': 'mdc.dialog',
    '@material/icon-button': 'mdc.iconButton',
    '@material/list': 'mdc.list',
    '@material/menu': 'mdc.menu',
    '@material/menu-surface': 'mdc.menuSurface',
    '@material/ripple': 'mdc.ripple',
    '@material/select': 'mdc.select',
    '@material/slider': 'mdc.slider',
    '@material/switch': 'mdc.switchControl',
    '@material/tab-bar': 'mdc.tabBar',
    '@material/textfield': 'mdc.textField',
  }
};