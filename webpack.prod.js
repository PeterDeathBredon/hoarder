const path = require("path");
const baseConfig = require('./webpack.base.js')
const devMode = process.env.NODE_ENV !== 'production';
const {merge} = require('webpack-merge')
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

module.exports = merge(baseConfig, {
    mode: "production",
    output: {
        filename: "[name]-[contentHash].js",
        path: path.resolve(__dirname, "dist")
    },
    plugins: [new CleanWebpackPlugin(), new MiniCssExtractPlugin({
        filename: '[name]-[hash].css',
    })],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.sass$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },

        ]
    },
    optimization: {
        minimize: true,
        minimizer: [
            // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
            // `...`
            new CssMinimizerPlugin(),
        ],
    },
})