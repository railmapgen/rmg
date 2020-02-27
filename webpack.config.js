const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
  {
    entry: {
        index: './src/index',
        lang: './src/lang', 
    }, 
    // uncomment devtool for debugging
    // devtool: 'inline-source-map',
    // change to development when debugging
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          use: 'ts-loader',
          exclude: /node_modules/, 
        },
        {
          test: /\.html$/,
          use: {
            loader: 'html-loader', 
            options: {
              interpolate: true, 
              minimize: true
            }
          }
        }, 
      ]
    },
    resolve: {
      extensions: [
        '.ts', '.js', '.tsx'
      ], 
    },
    output: {
      filename: '[name].min.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: './dist/'
    }, 
    externals: {
      jquery: 'jQuery', 
      '@material/chips': 'mdc.chips',
      '@material/dialog': 'mdc.dialog',
      '@material/icon-button': 'mdc.iconButton',
      '@material/linear-progress': 'mdc.linearProgress',
      '@material/list': 'mdc.list',
      '@material/menu': 'mdc.menu',
      '@material/menu-surface': 'mdc.menuSurface',
      '@material/ripple': 'mdc.ripple',
      '@material/select': 'mdc.select',
      '@material/slider': 'mdc.slider',
      '@material/snackbar': 'mdc.snackbar', 
      '@material/switch': 'mdc.switchControl',
      '@material/tab-bar': 'mdc.tabBar',
      '@material/textfield': 'mdc.textField',
    }, 
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: '../index.html', 
        chunks: ['index', 'lang'],
      })
    ]
  }, 
  {
    entry: {
        index3: './src/index3'
    }, 
    // uncomment devtool for debugging
    // devtool: 'inline-source-map',
    // change to development when debugging
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          use: 'ts-loader',
          exclude: /node_modules/, 
        },
        {
          test: /\.html$/,
          use: {
            loader: 'html-loader', 
            options: {
              interpolate: true, 
              minimize: true
            }
          }
        }, 
      ]
    },
    resolve: {
      extensions: [
        '.ts', '.js', '.tsx'
      ], 
    },
    output: {
      filename: '[name].min.js',
      path: path.resolve(__dirname, 'dist', 'v3'),
      publicPath: './dist/v3/'
    }, 
    externals: {
      jquery: 'jQuery', 
      "react": "React",
      "react-dom": "ReactDOM",
      'i18next': 'i18next',
      'react-i18next': 'ReactI18next',
      'i18next-xhr-backend': 'i18nextXHRBackend', 
      '@material-ui/core': 'MaterialUI',
    }, 
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index3.html',
        filename: '../../index3.html', 
      })
    ]
  }
]
