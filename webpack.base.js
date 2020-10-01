const HtmlWebPackPlugin = require("html-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const WorkboxPlugin = require("workbox-webpack-plugin");

const webpack = require("webpack");
const path = require("path");
module.exports = {
    devServer: {
        https: true
    },
    entry: {
        main: "./src/index.js",
        vendor: "./src/vendor.js"
    },
    plugins: [new HtmlWebPackPlugin(
                {
                    template: './src/index-template.html'
                },
        ),
        // new webpack.ProvidePlugin({
        //         $: "jquery",
        //         jQuery: "jquery"
        //     }
        // )
        new WebpackPwaManifest({
            name: "Hoarder",
            short_name: "Hoarder",
            start_url: "./index.html",
            display: "standalone",
            background_color: "#000000",
            description: "A hoarding app",
            inject: true,
            fingerprints: false,
            crossorigin: "use-credentials", //can be null, use-credentials or anonymous
            icons: [
                {
                    src: path.resolve('src/assets/icon_192x192.png'),
                    sizes: [48, 72, 96, 128, 192, 256, 384, 512] // multiple sizes
                },
                // {
                //     src: path.resolve('src/assets/large-icon.png'),
                //     size: '1024x1024' // you can also use the specifications pattern
                // },
                {
                    src: path.resolve('src/assets/icon_192x192.png'),
                    size: '192x192',
                    purpose: 'maskable'
                }
            ]
        }),
        new WorkboxPlugin.InjectManifest({
                swSrc: './src/sw.js',
                maximumFileSizeToCacheInBytes: 30000000
            }
        ),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.html$/,
                use: ['html-loader']
            },
            {
                test: /favicon.ico$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "favicon.ico",
                        outputPath: "."
                    }
                }
            },
            {
                test: /\.svg|png|jpg|gif$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[name].[hash].[ext]",
                        outputPath: "assets"
                    }
                }
            },
            // {
            //     test: /manifest.webmanifest$/,
            //     use: {
            //         loader: "file-loader",
            //         options: {
            //             name: "manifest.webmanifest",
            //             outputPath: "/"
            //         }
            //     }
            // },
            {
                test: /\.(woff(2)?|ttf|eot|otf)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets/fonts/'
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        alias: {
            jquery: "jquery/src/jquery"
        }
    }
}