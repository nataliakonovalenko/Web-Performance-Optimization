const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        index: {
            import: path.resolve(__dirname, "src/js/index.js"),
            filename: "js/shared.bundle.js"
        },
        page1: {
            import: path.resolve(__dirname, "src/js/page1.js"),
            filename: "js/[name].bundle.js",
        },
        page2: {
            import: path.resolve(__dirname, "src/js/page2.js"),
            filename: "js/[name].bundle.js",
        },
    },
    output: {
        path: path.resolve(__dirname, "build"),
    },
    devServer: {
        static: path.resolve(__dirname, "build"),
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
            filename: `page1.html`,
            chunks: [ "index", "page1" ]
        }),
        new HtmlWebpackPlugin({
            template: "./src/page2.html",
            filename: `page2.html`,
            chunks: [ "index", "page2" ]
        }),
    ],
};
