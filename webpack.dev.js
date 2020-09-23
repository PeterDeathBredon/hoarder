const path = require("path");
const baseConfig = require('./webpack.base.js')
const {merge} = require('webpack-merge')

module.exports = merge(baseConfig, {
    mode: "development",
    devtool: 'inline-source-map',
    output: {
        filename: "[name].js"
    },
    plugins: [],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.sass$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
        ]
    },
})