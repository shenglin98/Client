/*
 * @Author: wangming
 * @Date: 2022-03-17 18:32:16
 * @LastEditors: wangming
 * @LastEditTime: 2022-05-29 17:31:08
 * @FilePath: /Client/babel.config.js
 * @Description: 
 */
module.exports = {
    "env": {
        "development": {
            "sourceMaps": true,
            "retainLines": true,
        }
    },
    presets: [
        ['@vue/app', {
            polyfills: [
                'es6.promise',
                'es6.symbol',
                'es6.array.iterator',
                'es6.object.assign',
            ],
            useBuiltIns: 'entry',
        }]
    ]
}