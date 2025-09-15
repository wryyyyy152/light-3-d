const rspack = require("@rspack/core");
const { defineConfig } = require("@rspack/cli");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { VueLoaderPlugin } = require('vue-loader');
const packages = require("./package.json");
const dotenv = require("dotenv");

const envConfig = dotenv.config().parsed || {};

const config = defineConfig({
    entry: {
        main: "./packages/light-web/src/index.ts",
    },
    experiments: {
        css: false,
    },
    module: {
        parser: {
            "css/auto": {
                namedExports: false,
            },
        },
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            // 2. 处理所有 CSS/SCSS 相关资源（包括独立文件和 Vue 内的 style）
            {
                test: /\.(css|scss)$/, // 匹配 .css 和 .scss 类型的资源
                exclude: /\.module\.(css|scss)$/, // 排除 .module.css 和 .module.scss
                use: [
                    'style-loader', // 将 CSS 注入 DOM（或用 mini-css-extract-plugin 提取为文件）
                    'css-loader', // 解析 CSS
                    'sass-loader' // 解析 SCSS（如果用不到 SCSS 可省略）
                ]

            },
            // 处理 CSS Module：.module.css 和 .module.scss
            {
                test: /\.module\.(css|scss)$/, // 专门匹配带 .module 的样式文件
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true // 启用 CSS Module 功能
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.wasm$/,
                type: "asset",
            },
            {
                test: /\.cur$/,
                type: "asset",
            },
            {
                test: /\.jpg$/,
                type: "asset",
            },
            {
                test: /\.(j|t)s$/,
                loader: "builtin:swc-loader",
                options: {
                    jsc: {
                        parser: {
                            syntax: "typescript",
                            decorators: true,
                        },
                        target: "esnext",
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
        fallback: {
            fs: false,
            perf_hooks: false,
            os: false,
            crypto: false,
            stream: false,
            path: false,
        },
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
        new rspack.CopyRspackPlugin({
            patterns: [
                {
                    from: "./public",
                    globOptions: {
                        ignore: ["**/**/index.html"],
                    },
                },
            ],
        }),
        new rspack.DefinePlugin({
            __APP_VERSION__: JSON.stringify(packages.version),
            __DOCUMENT_VERSION__: JSON.stringify(packages.documentVersion),
            __VUE_OPTIONS_API__: true,             // 兼容选项式API
            __VUE_PROD_DEVTOOLS__: false,           // 生产环境关闭devtools
            'process.env': {
                BASE_URL: JSON.stringify(envConfig.BASE_URL || '/'),
            }
        }),
        new rspack.HtmlRspackPlugin({
            template: "./public/index.html",
            inject: "body",
        }),
        new VueLoaderPlugin(),                    // Vue必需插件
    ],
    optimization: {
        minimizer: [
            new rspack.SwcJsMinimizerRspackPlugin({
                minimizerOptions: {
                    mangle: {
                        keep_classnames: true,
                        keep_fnames: true,
                    },
                },
            }),
            new rspack.LightningCssMinimizerRspackPlugin(),
        ],
    },
    devServer: {
        // 关键配置：支持 HTML5 历史模式
        historyApiFallback: {
            index: '/index.html', // 所有未匹配的路径都返回 index.html
        },
        port: 8082, // 开发服务器端口（可选）
        open: true, // 自动打开浏览器（可选）
    },
    builtins: {
        define: {
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
        }
    }
});

module.exports = config;
