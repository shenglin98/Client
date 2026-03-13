import '@babel/polyfill'
import Vue from 'vue'
import layer from 'vue-layer'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/custom-theme/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import VueContextMenu from 'vue-contextmenu'

import '@/styles/index.scss' // global css
import '@/styles/elmenu.scss' // global css

import App from './App'
import router from './router'
import store from './store'


import '@/permission' // permission control

import '@/assets/public/css/comIconfont/iconfont.css'
import '@/assets/public/css/comIconfont/iconfont.js'

//工作流使用的图标
import '@/assets/public/css/workflowicon/iconfont.css'
import '@/assets/public/css/workflowicon/iconfont.js'


import '../public/ueditor/ueditor.config.js'
import '../public/ueditor/ueditor.all.js'
import '../public/ueditor/lang/zh-cn/zh-cn.js'
import '../public/ueditor/formdesign/leipi.formdesign.v4.js'
import '../public/config.js'

// RSA加密
import JSEncrypt from "jsencrypt";
Vue.prototype.$jsEncrypt = JSEncrypt;

Vue.prototype.$socketUrl = window.socketUrl;

// base64加密

import { Base64 } from 'js-base64'
Vue.prototype.$Base64 = Base64;
window.Base64 = Base64;


// md5加密
import md5 from 'js-md5';
Vue.prototype.$md5 = md5;
window.md5 = md5;


import animate from "animate.css"
Vue.use(animate)

import websocket from 'vue-native-websocket';
Vue.use(websocket, '', {
    connectManually: true, // 手动连接
    format: 'json', // json格式
    reconnection: true, // 是否自动重连
    reconnectionAttempts: 5, // 自动重连次数
    reconnectionDelay: 2000, // 重连间隔时间
});


// main.js
import { ws1, ws2 } from '@/utils/global.js'
Vue.prototype.$global = ws1
Vue.prototype.$global2 = ws2
import globalh5 from '@/utils/globalh5.js'
Vue.prototype.$globalh5 = globalh5


// 富文本编辑器  vue-quill-editor


import QuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'
import 'quill/dist/quill.snow.css'
Vue.use(QuillEditor)

// 请假条表单和详情
import FrmLeaveReqAdd from '@/views/forms/userDefine/frmLeaveReq/add'
import FrmLeaveReqUpdate from '@/views/forms/userDefine/frmLeaveReq/update'
import FrmLeaveReqDetail from '@/views/forms/userDefine/frmLeaveReq/detail'

// 富文本编辑器
import tinymce from 'tinymce'
import VueTinymce from '@packy-tang/vue-tinymce'
import './utils/zh_CN' // 汉化包
Vue.prototype.$tinymce = tinymce // 将全局tinymce对象指向给Vue作用域下
Vue.use(VueTinymce) // 安装vue的tinymce组件


// 引入echarts
// import echarts from 'echarts'
import * as echarts from 'echarts'; // 新版引入
Vue.prototype.$echarts = echarts


import EasyTable from 'vue-element-easy-table'
Vue.use(EasyTable, /* 全局配置，element-ui table属性都可用 */ {
    // 表格属性
    tableAttrs: {
        border: true,
        fit: true,
        'highlight-current-row': true,
        //   size: 'small',
    },
    // 单元格属性
    tableColumnAttrs: {
        // align: 'center',
        // emptyPlaceholder: '--',
    },
    // 分页属性
    paginationAttrs: {
        align: 'left',
        layout: 'total, sizes, pager, jumper',
        'page-sizes': [10, 20, 30, 50]
    }
})



import Search from '@/components/search'

Vue.use(Search, {
    searchSize: 'mini'
})


// 
Vue.directive('loadmore', {
    bind(el, binding) {
        const selectWrap = el.querySelector('.el-table__body-wrapper')
        selectWrap.addEventListener('scroll', function() {
            let sign = 30
            const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
            if (scrollDistance <= sign) {
                binding.value()
            }
        })
    }
})

//定义一个新的Message方法，多传入一个offset参数
const $message = options => {
    return ElementUI.Message({
        ...options,
        offset: 200,
        duration: 500
    });
};

//重写一遍success的方法,将offset写入options
['success', 'warning', 'info', 'error'].forEach(type => {
    $message[type] = options => {
        if (typeof options === 'string') {
            options = {
                message: options,
                offset: 200,
                duration: 500
            };
        }

        options.duration = 500;
        options.type = type;
        return ElementUI.Message(options);
    };
});
//将$message挂载到this上
Vue.prototype.$message = $message;




// 挂载axios到原型
import Axios from "axios";
Vue.prototype.$axios = Axios




Vue.use(ElementUI, {
    locale
})
Vue.use(VueContextMenu)

// 引入打印方法
import {
    $base64ToBlob,
    $downloadExportFile
} from '@/utils/printreport.js'

Vue.prototype.$base64ToBlob = $base64ToBlob;
Vue.prototype.$downloadExportFile = $downloadExportFile;


// 引入vxe-table
import XEUtils from 'xe-utils';
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

Vue.use(VXETable)
Vue.XEUtils = Vue.prototype.$XEUtils = XEUtils;
import "vue-easytable/libs/theme-default/index.css"; // import style
import {
    VeTable,
    VePagination,
    VeIcon,
    VeLoading,
    VeLocale
} from "vue-easytable"; // import library

Vue.use(VeTable);
Vue.use(VeLoading);
Vue.prototype.$veLoading = VeLoading;


// 时间选择器 - 多种输入格式
Vue.directive('dateFormat', {
    inserted: function(el, binding, vnode) {
        const {
            value: _obj
        } = binding
        const {
            context: that,
            data
        } = vnode
        const {
            expression: key
        } = data.model

        if (that && that._isVue) {
            const $this = $($(el).children('input')[0])

            $this.on('change', function() {
                let value = $this.val()

                // 中文日期
                if (!value.match(/\d{1,}/g)) {
                    const chinaNum = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九']
                    const wList = [...value].map(w => {
                        const idx = chinaNum.findIndex(p => p == w)
                        return idx == -1 ? w : idx
                    })
                    value = wList.join('')
                }

                value = value.replace(/^(\d{4})\D*(\d{1,2})\D*(\d{1,2})\D*/, '$1-$2-$3') // 格式化输入格式

                const time = value && value.constructor == String ? new Date(value) : value // 转换时间格式
                let keys = key.split('.')

                // 自定义赋值
                if (_obj) {
                    const {
                        keys: keyList
                    } = _obj
                    keys = keyList
                }

                if (keys && keys.length >= 2) {
                    const [key1, key2, key3, key4] = keys

                    if (key4) {
                        that[key1][key2][key3][key4] = time
                    } else if (key3) {
                        that[key1][key2][key3] = time
                    } else {
                        that[key1][key2] = time
                    }
                } else {
                    that[key] = time
                }
            })
        }
    }
})








Vue.config.productionTip = false
    // Vue.prototype.Hospitals = window.hospitals || "index";
Vue.prototype.$layer = layer(Vue, {
    msgtime: 3
})
Vue.component('FrmLeaveReqAdd', FrmLeaveReqAdd)
Vue.component('FrmLeaveReqUpdate', FrmLeaveReqUpdate)
Vue.component('FrmLeaveReqDetail', FrmLeaveReqDetail)
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})