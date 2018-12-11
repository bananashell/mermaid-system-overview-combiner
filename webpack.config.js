//#region "imports"
const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const { GenerateSW } = require("workbox-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ForkTsCheckerNotifierWebpackPlugin = require("fork-ts-checker-notifier-webpack-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
//#endregion

const SOURCE_PATH = path.join(__dirname, "src/");
const DESTINATION_PATH = path.join(__dirname, "dist/");

const generateSW = new GenerateSW({
    exclude: [/\.cshtml$/],
    include: [/\.html$/, /\.js$/, /\.css$/],
    clientsClaim: true,
    skipWaiting: true,
    runtimeCaching: [
        {
            urlPattern: /locales/,
            handler: "staleWhileRevalidate",
            options: {
                cacheableResponse: {
                    statuses: [0, 200]
                }
            }
        }
    ]
});

const extractCssPlugin = new MiniCssExtractPlugin({
    filename: "./styles/[name].[contenthash].css",
    chunkFilename: "./styles/[id].[contenthash].css"
});

const generateIndexHtml = new HtmlWebpackPlugin({
    title: "System Overviewer",
    template: "./src/index.ejs",
    inject: false
});

const polyfills = ["whatwg-fetch", "babel-polyfill"];

module.exports = (env, argv) => {
    let mockExtensions = [];

    if (env && env.mock) {
        mockExtensions = [".mock.ts", ".mock.tsx"];
    }

    const isDev = argv.mode === "development";
    const isDevServer = env && env.devServer;

    console.log("DEVELOPMENT:", isDev);

    return {
        context: __dirname,
        devtool: isDev ? "cheap-module-eval-source-map" : "hidden-source-map",
        target: "web",
        entry: {
            main: ["./src/styles/main.scss", "./src/scripts/index.tsx"]
        },
        output: {
            filename: "scripts/[name]-[hash].bundle.js",
            chunkFilename: "scripts/[name]-[hash].chunk.js",
            path: DESTINATION_PATH,
            crossOriginLoading: isDev ? "anonymous" : false,
            pathinfo: false
        },
        resolve: {
            extensions: [
                ...mockExtensions,
                ".ts",
                ".tsx",
                ".js",
                ".jsx",
                ".scss",
                "eot",
                "svg",
                "ttf",
                "woff",
                "woff2",
                "css",
                "png",
                "jpg",
                "jpeg"
            ],
            modules: [
                path.resolve(SOURCE_PATH, "scripts"),
                path.resolve(__dirname, "node_modules"),
                path.resolve(SOURCE_PATH, "styles"),
                path.resolve(SOURCE_PATH, "assets")
            ]
        },
        optimization: {
            splitChunks: {
                chunks: "all"
            }
        },
        module: {
            rules: [
                {
                    test: /^(?!.*\.test\.tsx?$).*\.tsx?$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        {
                            loader: "babel-loader"
                        }
                    ]
                },
                {
                    test: /\.(sass|scss)$/,
                    use: [
                        !isDevServer && { loader: MiniCssExtractPlugin.loader },
                        isDevServer && { loader: "style-loader", options: { sourceMap: true } },
                        { loader: "css-loader", options: { sourceMap: true } },
                        {
                            loader: "sass-loader",
                            options: { sourceMap: true, outputStyle: "compact" }
                        },
                        {
                            loader: "postcss-loader",
                            options: { sourceMap: true }
                        }
                    ].filter((loader) => !!loader)
                },
                {
                    test: /\.(css)$/,
                    use: [
                        !isDevServer && { loader: MiniCssExtractPlugin.loader },
                        isDevServer && { loader: "style-loader", options: { sourceMap: true } },
                        { loader: "css-loader", options: { sourceMap: true } },
                        {
                            loader: "postcss-loader",
                            options: { sourceMap: true }
                        }
                    ].filter((loader) => !!loader)
                },
                {
                    test: /\.(otf|woff|woff2|eot|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: "url-loader",
                    options: {
                        name: "fonts/[name].[ext]",
                        outputPath: "./assets/",
                        publicPath: "/"
                    }
                }
            ]
        },
        devServer: {
            // proxy: {
            //     "/api": "http://localhost:5050",
            //     "/static": "http://localhost:5050",
            //     "/assets": "http://localhost:5050",
            //     "/locales": "http://localhost:5050",
            //     "/swagger": "http://localhost:5050",
            //     "/jsnlog.logger": "http://localhost:5050"
            // },
            compress: true,
            overlay: true,
            historyApiFallback: true,
            hot: true,
            noInfo: true,
            clientLogLevel: "warning"
        },

        plugins: [
            new CleanWebpackPlugin([`${DESTINATION_PATH}/**/*`]),
            new CaseSensitivePathsPlugin(),
            isDev &&
                new ForkTsCheckerWebpackPlugin({
                    workers: ForkTsCheckerWebpackPlugin.TWO_CPUS_FREE
                }),
            isDev && new ForkTsCheckerNotifierWebpackPlugin(),
            new webpack.optimize.ModuleConcatenationPlugin(),
            isDev && new webpack.HotModuleReplacementPlugin(),
            new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en|sv)$/),
            new webpack.DefinePlugin({
                __DEV__: isDev
            }),
            new BundleAnalyzerPlugin({
                analyzerMode: "static",
                defaultSizes: "gzip",
                openAnalyzer: false
            }),
            extractCssPlugin,
            generateIndexHtml,
            generateSW
        ].filter((plugin) => !!plugin)
    };
};
