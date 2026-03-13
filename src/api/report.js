import request from '@/utils/request'

// 人体系统字典列表
export function gealthCheckForWeb(data) {
    return request({
        url: '/HealthCheckForWeb/Post',
        method: 'post',
        data
    })
}

// 获取Captcha
export function getCaptcha(data) {
    return request({
        url: '/HealthCheckForWeb/Post',
        method: 'post',
        data
    })
}

// 登录
export function dataFormSubmit(data) {
    return request({
        url: '/HealthCheckForWeb/Post',
        method: 'post',
        data
    })
}

// 报告查询列表
export function CustomerReportList(data) {
    return request({
        url: '/HealthCheckForWeb/Post',
        method: 'post',
        data
    })
}