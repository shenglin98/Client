import request from '@/utils/request'
// method: 'post',

// 客户销售表
export function getCustomerSalesList(params) {
    return request({
        url: '/CustomerSales/Load',
        params
    })
}

// 获取所有用户
export function getAllUser(params) {
    return request({
        url: '/Users/GetAllUser',
        params
    })
}

// 获取公共下拉
export function getPublicConfig(params) {
    return request({
        url: '/SysConfig/GetPublicConfig',
        params
    })
}

// 客户销售表添加
export function setCustomerSalesAdd(data) {
    return request({
        url: '/CustomerSales/Add',
        method: 'post',
        data
    })
}

// 客户销售表删除
export function setCustomerSalesDel(params) {
    return request({
        url: '/CustomerSales/Delete',
        params
    })
}

// 客户全景
export function getDetailView(params) {
    return request({
        url: '/CustomerSales/DetailView',
        params
    })
}
// 添加客户干系人
export function addStakeholder(data) {
    return request({
        url: '/CustomerSales/AddStakeholder',
        method: 'post',
        data
    })
}
// 添加推进
export function addFollowup(data) {
    return request({
        url: '/CustomerSales/AddFollowup',
        method: 'post',
        data
    })
}
// 报价单列表
export function quoteLoad(data) {
    return request({
        url: '/CustomerSales/QuoteLoad',
        method: 'post',
        data
    })
}
// 报价单删除
export function quoteDelete(params) {
    return request({
        url: '/CustomerSales/QuoteDelete',
        params
    })
}
// 报价单新增
export function addQuote(data) {
    return request({
        url: '/CustomerSales/AddQuote',
        method: 'post',
        data
    })
}

// 附言详情
export function postscriptDetail(params) {
    return request({
        url: '/CustomerSales/PostscriptDetail',
        params
    })
}

// 新增附言
export function postscriptAdd(data) {
    return request({
        url: '/CustomerSales/PostscriptAdd',
        method: 'post',
        data
    })
}

// 修改附言
export function postscriptUpdate(data) {
    return request({
        url: '/CustomerSales/PostscriptUpdate',
        method: 'post',
        data
    })
}