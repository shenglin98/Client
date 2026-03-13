/*
 * @Author: wangming
 * @Date: 2022-03-18 09:37:37
 * @LastEditors: wangming
 * @LastEditTime: 2022-05-29 17:30:27
 * @FilePath: /Client/vue.config.js
 * @Description: 
 */
const path = require('path')

const PrerenderSPAPlugin = require('prerender-spa-plugin');
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;

function resolve(dir) {
    return path.join(__dirname, '/', dir)
}

const mode = process.env.NODE_ENV
const isDev = mode === 'development'
const version = new Date().getTime();

module.exports = {
    // 生产环境开启gzip压缩
    // configureWebpack: config => {
    //     if (process.env.NODE_ENV === 'production') {
    //         // 为生产环境修改配置...
    //         return {
    //             plugins: [
    //                 new PrerenderSPAPlugin({
    //                     staticDir: path.join(__dirname, 'dist'),
    //                     routes: ['/'],
    //                     renderer: new Renderer({
    //                         headless: true,
    //                         // 在这里指定chrome路径,解决linux和windows下的路径问题
    //                         // executablePath: '/usr/bin/google-chrome',
    //                         // 在这里设置你的chrome路径，如果在windows下记得改路径
    //                         executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    //                     })
    //                 })
    //             ]
    //         }
    //     }
    // },
    chainWebpack: (config) => {
        config.plugins.delete("prefetch");
    },
    configureWebpack: {
        output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
            filename: isDev ? `[name].js` : `js/[name].[chunkhash].${version}.js`,
            chunkFilename: isDev ? `[name].js` : `js/[id].[chunkhash].${version}.js`
        },
        devtool: 'source-map'

    },
    // configureWebpack: (config) => {
    //     devtool: 'source-map'
    // },
    transpileDependencies: [/node_modules/],
    pages: {
        index: {
            // add here ---start---
            entry: ['node_modules/babel-polyfill/dist/polyfill.js', 'src/main.js'],
            // add here ---end---
            template: 'public/index.html',
            filename: 'index.html',
            chunks: ['chunk-vendors', 'chunk-common', 'index'],
        },
    },
    lintOnSave: false,
    productionSourceMap: false,
    lintOnSave: process.env.NODE_ENV !== 'production',
    // devServer: {
    //   port: 1803,     // 端口
    //   overlay: {
    //     warnings: false,
    //     errors: false
    //   }
    // },
    publicPath: "/",
    outputDir: "dist",
    assetsDir: "static",
    devServer: {
        port: 1803,
        overlay: {
            warnings: false,
            errors: false
        },
        proxy: {
            '/apireadCard': {
                // 此处的写法，目的是为了 将 /api 替换成 https://www.baidu.com/
                target: 'http://localhost:8099/?cmd=readCard',
                // 允许跨域
                changeOrigin: true,
                pathRewrite: {
                    '^/apireadCard': ''
                }
            },
            '/apiGetText': {
                // 此处的写法，目的是为了 将 /api 替换成 https://www.baidu.com/
                target: 'http://127.0.0.1:53536/1.txt',
                // 允许跨域
                changeOrigin: true,
                pathRewrite: {
                    '^/apiGetText': ''
                }
            },
            '/api-pay': {
                // 此处的写法，目的是为了 将 /api 替换成 https://www.baidu.com/
                target: 'http://101.200.229.181:8030/api-pay/Payment/Refund',
                // 允许跨域
                changeOrigin: true,
                pathRewrite: {
                    '^/api-pay': ''
                }
            },
            '/apipayWx': {
                // 此处的写法，目的是为了 将 /api 替换成 https://www.baidu.com/
                target: 'http://101.200.229.181:8030/api-pay/Payment/PaymentCodePay',
                // 允许跨域
                changeOrigin: true,
                pathRewrite: {
                    '^/apipayWx': ''
                }
            },
            '/apiWxMicropay': {
                // 此处的写法，目的是为了 将 /api 替换成 https://www.baidu.com/
                target: 'http://101.200.229.181:8030/api-pay/Payment/WxMicropay',
                // 允许跨域
                changeOrigin: true,
                pathRewrite: {
                    '^/apiWxMicropay': ''
                }
            },
            '/apiDSTotal': {
                // 此处的写法，目的是为了 将 /api 替换成 https://www.baidu.com/
                target: 'http://101.200.229.181:9071/api',
                // 允许跨域
                changeOrigin: true,
                pathRewrite: {
                    '^/apiDSTotal': ''
                }
            },

        }
        // proxy: {
        //     '/api-proxy': {
        //         // 此处的写法，目的是为了 将 /api 替换成 https://www.baidu.com/
        //         target: 'http://101.200.229.181:8092/api',
        //         // 允许跨域
        //         changeOrigin: true,
        //         pathRewrite: {
        //             '^/api-proxy': ''
        //         }
        //     },
        // }
    },
}