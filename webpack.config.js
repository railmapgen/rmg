const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
    {
        entry: {
            index: './src/index3',
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
                            minimize: true,
                        },
                    },
                },
            ],
        },
        resolve: {
            extensions: ['.ts', '.js', '.tsx'],
        },
        output: {
            filename: '[name].min.js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: './dist/',
        },
        externals: {
            // jquery: 'jQuery',
            react: 'React',
            'react-dom': 'ReactDOM',
            i18next: 'i18next',
            'react-i18next': 'ReactI18next',
            'i18next-xhr-backend': 'i18nextXHRBackend',
            'i18next-browser-languagedetector': 'i18nextBrowserLanguageDetector',
            '@material-ui/core': 'MaterialUI',
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index3.html',
                filename: '../index.html',
            }),
        ],
    },
];
