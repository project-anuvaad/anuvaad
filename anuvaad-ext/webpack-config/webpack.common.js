const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
    entry: { background: path.resolve(__dirname, '../background.js') },
    module: {
        rules: [{
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-object-rest-spread']
                    }
                }
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
        new HtmlWebpackPlugin({ template: './src/anuvaad.html', filename: './src/anuvaad.html' }),
        new CopyWebpackPlugin({
            patterns: [
                { from: './manifest.json', to: './manifest.json' },
                { from: './asset', to: './asset' },
                { from: './utils', to: './utils' },
                { from: './style', to: './style' },
                { from: './src/options.html', to: './src/options.html' },
            ],
        }),
    ],
    output: { filename: '[name].js', path: path.resolve(__dirname, '../dist') }, // chrome will look for files under dist/* folder
};