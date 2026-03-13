import request from '@/utils/request'
// method: 'post',

// 心电图 血压 抽血 获取列表
export function UserItemStaticLoad(data) {
    return request({
        url: '/WorkLoadStatics/UserItemStaticLoad',
        method: 'post',
        data
    })
}
// 心电图 血压 抽血 保存列表
export function UserItemStaticSave(data) {
    return request({
        url: '/WorkLoadStatics/UserItemStaticSave',
        method: 'post',
        data
    })
}
// 心电图 血压 抽血 删除
export function UserItemStaticDelete(data) {
    return request({
        url: '/WorkLoadStatics/UserItemStaticDelete',
        method: 'post',
        data
    })
}

// 转诊 列表
export function UserTransferStaticLoad(data) {
    return request({
        url: '/WorkLoadStatics/UserTransferStaticLoad',
        method: 'post',
        data
    })
}
// 转诊 保存
export function UserTransferStaticSave(data) {
    return request({
        url: '/WorkLoadStatics/UserTransferStaticSave',
        method: 'post',
        data
    })
}

// 复诊统计列表
export function UserFuJianStaticLoad(data) {
    return request({
        url: '/WorkLoadStatics/UserFuJianStaticLoad',
        method: 'post',
        data
    })
}
// 复诊统计 保存
export function UserFuJianStaticSave(data) {
    return request({
        url: '/WorkLoadStatics/UserFuJianStaticSave',
        method: 'post',
        data
    })
}
// 获取人员列表
export function load(params) {
    return request({
        url: '/users/load',
        method: 'GET',
        params
    })
}

// 获取科室
export function getDepartment(params) {
    return request({
        url: '/DicCombine/Detail?code',
        method: 'GET',
        params
    })
}
// 转诊-复诊 获取异常列表
export function UserFuJianTransferConclusionLoad(data) {
    return request({
        url: '/WorkLoadStatics/UserFuJianTransferConclusionLoad',
        method: 'POST',
        data
    })
}
// 转诊-复诊 保存异常列表
export function UserFuJianTransferConclusionSave(data) {
    return request({
        url: '/WorkLoadStatics/UserFuJianTransferConclusionSave',
        method: 'POST',
        data
    })
}
// 专项检查列表
export function UserSpecialCheckLoad(data) {
    return request({
        url: '/WorkLoadStatics/UserSpecialCheckLoad',
        method: 'POST',
        data
    })
}
// 专项检查保存
export function UserSpecialCheckSave(data) {
    return request({
        url: '/WorkLoadStatics/UserSpecialCheckSave',
        method: 'POST',
        data
    })
}