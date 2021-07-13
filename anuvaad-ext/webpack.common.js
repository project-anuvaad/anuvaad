const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: { popup: './src/anuvaad.html', background: './background.js' },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ["file-loader"]
            }
        ]
    },
    resolve: {
        extensions: ["*", ".js"]
    },
    plugins: [
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        new HtmlWebpackPlugin({ template: 'src/anuvaad.html' }),
        new CopyWebpackPlugin({
            patterns: [
                { from: './manifest.json' },
                { from: './asset' },
                { from: './utils' },
                { from: './style' },
            ],
        }),
    ],
    output: { filename: '[name].js', path: path.resolve(__dirname, 'dist') }, // chrome will look for files under dist/* folder
};