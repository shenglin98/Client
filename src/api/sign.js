import request from '@/utils/request'
// method: 'post',
// 获取检索条件人员列表数据
export function getPersonalRegisterList(data) {
    return request({
        url: '/SignIn/Load',
        method: "post",
        data
    })
}

export function getLoadSearchInfo(params) {
    return request({
        url: '/FullSearch/LoadSearchInfo',
        params
    })
}

export function getBatch(params) {
    return request({
        url: '/CompanyPrintOrder/LoadSearchInfo',
        params
    })
}

// 获取人员详情数据
export function getPersonalDetail(params) {
    return request({
        url: '/CustomerRegister/Detail',
        params
    })
}

// 交表判断
export function AllowSign(params) {
    return request({
        url: '/SignOut/AllowSign',
        method: "get",
        params
    })
}

// 签到登记
export function setSignIn(data) {
    return request({
        url: '/SignIn/Sign',
        method: "post",
        data
    })
}
// 取消签到登记
export function setCancelSign(data) {
    return request({
        url: '/SignIn/CancelSign',
        method: "post",
        data
    })
}

// 交表登记
export function setSignOut(data) {
    return request({
        url: '/SignOut/Sign',
        method: "post",
        data
    })
}

// 取消交表登记
export function setCancelSignOut(data) {
    return request({
        url: '/SignOut/CancelSign',
        method: "post",
        data
    })
}

// 取消交表登记
export function SetSign(params) {
    return request({
        url: '/SignOut/SetSign',
        params
    })
}

// 取消交表登记
export function GetSign(params) {
    return request({
        url: '/SignOut/GetSign',
        params
    })
}

// 取消标记
export function ClearSign(params) {
    return request({
        url: '/SignOut/ClearSign',
        params
    })
}