import request from '@/utils/request'

// 获取单位列表
export function getCompanyList(params) {
    return request({
        url: '/CompanyArchives/Load',
        params
    })
}

// 获取单位打单列表数据
export function getPrintOrderList(data) {
    return request({
        url: '/CompanyPrintOrder/Load',
        method: "post",
        data
    })
}

// 获取搜索条件集数据
export function getSearchParams(params) {
    return request({
        url: '/CompanyPrintOrder/LoadSearchInfo',
        params
    })
}

// 单位打单修改组合项目
export function setProjectList(data) {
    return request({
        url: '/CompanyPrintOrder/UpdateCombine',
        method: "post",
        data
    })
}

// 单位人员列表人员删除
export function setPrintOrderDel(data) {
    return request({
        url: '/CompanyPrintOrder/Delete',
        method: "post",
        data
    })
}

// 单位打单个人组合明细
export function setPrintOrderDetail(params) {
    return request({
        url: '/CompanyPrintOrder/Detail',
        method: "get",
        params
    })
}

// 单位打单数据冻结
export function setPrintOrderFreeze(data) {
    return request({
        url: '/CompanyPrintOrder/Freeze',
        method: "post",
        data
    })
}

// 单位打单数据解冻
export function setPrintOrderNoFreeze(data) {
    return request({
        url: '/CompanyPrintOrder/NoFreeze',
        method: "post",
        data
    })
}

// 单位打单允许特殊打印指引单
export function AllowPrintGuide(data) {
    return request({
        url: '/CompanyPrintOrder/AllowPrintGuide',
        method: "post",
        data
    })
}

// 修改标准金额
export function AlterQuota(data) {
    return request({
        url: '/CompanyPrintOrder/AlterQuota',
        method: "post",
        data
    })
}

// 修改分组
export function UpdateGroup(data) {
    return request({
        url: '/CompanyPrintOrder/UpdateGroup',
        method: "post",
        data
    })
}

// 文件导出
export function getFiles(params) {
    return request({
        url: '/Files/GetFile',
        params
    })
}

// 批量修改客户等级
export function BatchAlterFields(data) {
    return request({
        url: '/CustomerRegisterNew/BatchAlterFields',
        method: "post",
        data
    })
}