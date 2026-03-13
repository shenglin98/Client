import request from '@/utils/request'
// method: 'post',

// 获取申请单列表
export function getAPPLYLoad(params) {
    return request({
        url: '/CustomerRegisterApply/APPLYLoad',
        method: 'get',
        params
    })
}

// 获取申请单列表
export function setSendApply(data) {
    return request({
        url: '/CustomerRegisterApply/SendApply',
        method: 'post',
        data
    })
}

// 获取申请单列表
export function setCancelApply(data) {
    return request({
        url: '/CustomerRegisterApply/CancelApply',
        method: 'post',
        data
    })
}

// 获取申请单列表
export function setResetSendApply(data) {
    return request({
        url: '/CustomerRegisterApply/ResetSendApply',
        method: 'post',
        data
    })
}
// 获取申请单列表
export function APPLYLoadList(data) {
    return request({
        url: '/CustomerRegisterApply/APPLYLoadList',
        method: 'post',
        data
    })
}
// 发送申请单列表
export function SendApply(data) {
    return request({
        url: '/CustomerRegisterApply/SendApply',
        method: 'post',
        data
    })
}
// 取消申请单列表
export function CancelApply(data) {
    return request({
        url: '/CustomerRegisterApply/CancelApply',
        method: 'post',
        data
    })
}
// 重发申请单列表
export function ResetSendApply(data) {
    return request({
        url: '/CustomerRegisterApply/ResetSendApply',
        method: 'post',
        data
    })
}

// 流程列表
export function ApplyProcess(params) {
    return request({
        url: '/CustomerRegisterApply/ApplyProcess',
        method: 'get',
        params
    })
}