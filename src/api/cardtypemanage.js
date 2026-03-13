import request from '@/utils/request'

// 体检卡管理列表数据
export function CardLoad(data) {
    return request({
        url: '/Card/Load',
        method: 'post',
        data
    })
}
// 体检卡管理新增编辑
export function CardSave(data) {
    return request({
        url: '/Card/Save',
        method: 'post',
        data
    })
}
// 体检卡管理删除
export function CardDelete(data) {
    return request({
        url: '/Card/Delete',
        method: 'post',
        data
    })
}

// 消费卡明细列表接口
export function CustomerCardDetailLoad(data) {
    return request({
        url: '/CustomerCardDetail/Load',
        method: 'post',
        data
    })
}

// 批量新增消费卡
export function BatchCreate(data) {
    return request({
        url: '/Card/BatchCreate',
        method: 'post',
        data
    })
}

// 批量新增激活/注销
export function SetStatus(data) {
    return request({
        url: '/CustomerCardDetail/SetStatus',
        method: 'post',
        data
    })
}

// 批量新增激活/注销
export function ExportCustomerCardData(params) {
    return request({
        url: '/FileExport/ExportCustomerCardData',
        method: 'get',
        params
    })
}

// 批量新增激活/注销
export function ImportCreate(data) {
    return request({
        url: '/Card/ImportCreate',
        method: 'post',
        data
    })
}

// 批量新增激活/注销
export function SeePassWord(params) {
    return request({
        url: '/CustomerCardDetail/SeePassWord',
        method: 'get',
        params
    })
}

// 批量新增激活/注销
export function UpdateEffectivedate(data) {
    return request({
        url: '/CustomerCardDetail/UpdateEffectivedate',
        method: 'post',
        data
    })
}