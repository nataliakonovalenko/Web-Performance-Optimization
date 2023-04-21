const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, 'src/js/index.js'),
    output: {
        filename: 'shared.bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/page1.html",
            filename: `page1.html`
        }),
        new HtmlWebpackPlugin({
            template: "./src/page2.html",
            filename: `page2.html`
        }),
    ],
};
