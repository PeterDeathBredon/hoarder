const path = require("path");
const baseConfig = require('./webpack.base.js')
const webpack = require("webpack");
const {merge} = require('webpack-merge')

module.exports = merge(baseConfig, {
    mode: "development",
    devtool: 'inline-source-map',
    devServer: {
        https: true,
        historyApiFallback: {
            index: "/src/reroute.html"
        }
    },
    output: {
        filename: "[name].js"
    },
    plugins: [
        new webpack.NormalModuleReplacementPlugin(
        /credentials\.ts/,
        './dev-credentials.ts'
        ),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                // test: /^(?!component).*\.sass$/,
                test: /^((?!component).)*\.sass$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                // test: /\$.*\.sass$/,
                test: /component.*.sass$/,
                use: [{
                    loader: 'lit-scss-loader',
                    options: {
                        // defaultSkip: true,
                        minify: true
                    },
                }, 'extract-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
})