import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken, getLicenseKey } from '@/utils/auth'
import { GetSysAppKey } from '@/api/users.js'
import { generateUniqueId } from "@/utils/common.js"; // 引入页面接口


// 创建axios实例
const service = axios.create({
    baseURL: window.baseUrl || location.origin + "/api", // api的base_url
    // baseURL: 'http://192.168.1.2:52789/api' || location.origin + "/api", // 内用
    // baseURL: 'http://101.200.229.181:8091/api' || location.origin + "/api", // 线上  - 测试库
    // baseURL: 'http://101.200.229.181:9030/api' || location.origin + "/api", // 线上  - 测试库
    // baseURL: window.baseUrl, // api的base_url
    // baseURL: process.env.VUE_APP_BASE_API, // api的base_url
    timeout: 0 // 请求超时时间
        // timeout: 60000 * 5 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(async(config) => {
    // 特殊接口入参加密
    if (config.url === "/CustomerRegister/GetCustomerRegisterInfo") {
        let res = await GetSysAppKey({ conid: "HCJKTJ2025!@#" })
        let appid = "HCJKTJ2025!@#";
        let noise = generateUniqueId();
        let data = window.Base64.encode(JSON.stringify(config.data));
        let key = res.result || "";
        let version = "V1.0.1";
        let sign = window.md5(`appid=${appid}&data=${data}&noise=${noise}&key=${key}&version=${version}`);
        config.data = {
            appid,
            noise,
            version,
            data,
            sign,
        }
    }
    // 特殊打印处理
    if (config.url === "/PrintReport/ReportBook") {
        config.baseURL = config.baseURL.replace(/api/g, "api-report");
    }
    // 获取结果特殊处理
    if (config.url === "/DepartCheck/GetResultFlag") {
        config.url = "/DepartCheck/GetResult";
        config.baseURL = config.baseURL.replace(/api/g, "api-result");
    }
    // 统计报表特殊处理
    if (config.url === "/PrintReport/ReportStaticsForBase64Flag") {
        config.url = "/PrintReport/ReportStaticsForBase64";
        config.baseURL = config.baseURL.replace(/api/g, "api-report");
    }
    // 一键导出特殊处理
    if (config.url === "/FileExport/ExportFlag") {
        config.url = "/FileExport/Export";
        config.baseURL = config.baseURL.replace(/api/g, "api-file");
    }

    // AI总检转换
    if (config.url === "/DSTotalCheck/Handle") {
        config.baseURL = config.baseURL.replace(/api/g, "api-ds");
    }



    if (store.getters.tenantid) {
        config.headers['tenantId'] = store.getters.tenantid
    }

    if (store.getters.token) {
        // config.headers['X-Token'] = "asnciusancnuisacn" // 让每个请求携带自定义token 请根据实际情况自行修改
        config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    if (store.getters.licenseKey) {
        config.headers['LICENSE-KEY'] = getLicenseKey() // 让每个请求携带自定义返回加密验证秘文 请根据实际情况自行修改
    }

    if (store.getters.isIdentityAuth) {
        config.headers['Authorization'] = 'Bearer ' + store.getters.oidcAccessToken
    }
    if (localStorage.getItem('md5code')) {
        config.headers['X-ClientId'] = localStorage.getItem('md5code')
    }

    return config
}, error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
    response => {
        /**
         * code为非200是抛错 可结合自己业务进行修改
         */
        const res = response.data
        if (res.code !== 200) {
            // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
            if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
                MessageBox.confirm('登录已超时，可以【取消】继续留在该页面，或者【重新登录】', '超时提醒', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('FedLogOut').then(() => {
                        location.reload() // 为了重新实例化vue-router对象 避免bug
                    })
                })
            } else {
                // Message({
                //     showClose: true,
                //     message: res.message || res.msg,
                //     type: 'error',
                //     duration: 5 * 1000
                // })
                let tempmsg = res.message || res.msg || "未知错误";
                // tempmsg = tempmsg.replaceAll("\r\n", '<br/>');
                // tempmsg = tempmsg.replaceAll("\n", '<br/>');
                MessageBox.confirm(`<div style="wdith:600px;color:red;font-weight: 600;">${tempmsg}</div>`, {
                    type: 'error',
                    showConfirmButton: false,
                    showCancelButton: false,
                    dangerouslyUseHTMLString: true,
                    closeOnClickModal: false,
                })
                setTimeout(() => {
                    MessageBox.close();
                }, res.tipTime || 4 * 1000);
            }
            return Promise.reject('error')
        } else if (res.code == 200 && res.systemWarn) {
            MessageBox.confirm(res.systemWarn, '系统提示', {
                confirmButtonText: '确定',
                showClose: false,
                showCancelButton: false,
                closeOnClickModal: false,
                closeOnPressEscape: false,
                customClass: "systemWarnTips",
                type: 'warning'
            }).then(() => {})
            return response.data
        } else {
            return response.data
        }
    },
    error => {
        console.log(error, 'error');
        if (error.response && error.response.status == 400) { //调用远程服务时，前端类型和后端不匹配
            var message = '<strong>' + error.response.data.detail + '</strong><br>'
                //异常信息需要特殊处理一下
            var errors = Object.entries(error.response.data.errors).map(([key, value]) => ({ key, value }));
            errors.forEach(item => {
                    message += item.key + ":"

                    item.value.forEach(dtl => {
                        message += " " + dtl;
                    })

                    message += "<br>";
                })
                // MessageBox.confirm(message, {
                //         cancelButtonText: '关闭',
                //         type: 'warning',
                //         duration: 4000,
                //     }).then(() => {}).catch(() => {

            //     })
            Message({
                showClose: true,
                dangerouslyUseHTMLString: true,
                message: message,
                type: 'error',
                duration: 10 * 1000
            })
        } else if (error.response && error.response.status == 401) {

            if (error.response.data.code === 402) {
                MessageBox.confirm(error.response.data.message, '系统提示', {
                    confirmButtonText: '确定',
                    showClose: false,
                    showCancelButton: false,
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                    type: 'warning'
                }).then(() => {
                    store.dispatch('FedLogOut').then(() => {
                        location.reload() // 为了重新实例化vue-router对象 避免bug
                    })
                })
            } else if (error.response.data.code === 403) {
                MessageBox.confirm(error.response.data.message, '系统提示', {
                    confirmButtonText: '确定',
                    showClose: false,
                    showCancelButton: false,
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                    customClass: "expiretips",
                    type: 'warning'
                }).then(() => {
                    store.dispatch('FedLogOut').then(() => {
                        location.reload() // 为了重新实例化vue-router对象 避免bug
                    })
                })
            }
        } else {
            Message({
                showClose: true,
                message: '请先启动禾创健康管理系统，再刷新本页面，异常详情：' + error.message,
                type: 'error',
                duration: 10 * 1000
            })
        }
        return Promise.reject(error)
    }
)

export default service