import request from '@/utils/request'

// 健康视图统计-个人体检列表 
export function getPersonCheckList(params) {
    return request({
        url: '/HealthViewStatics/PersonCheckList',
        method: "get",
        params
    })
}

// 健康视图统计-个人健康情况信息 
export function getHealthInfo(params) {
    return request({
        url: '/HealthViewStatics/HealthInfo',
        method: "get",
        params
    })
}

// 健康视图统计-个人诊断信息
export function getDiagnoseInfo(params) {
    return request({
        url: '/HealthViewStatics/DiagnoseInfo',
        method: "get",
        params
    })
}

// 健康视图统计-个人诊断信息
export function getImportantInfo(params) {
    return request({
        url: '/HealthViewStatics/ImportantInfo',
        method: "get",
        params
    })
}