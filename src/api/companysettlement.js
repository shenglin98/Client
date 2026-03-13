import request from '@/utils/request'

// 获取公司列表信息
export function getPageList(data) {
    return request({
        url: '/CompanySettlement/Load',
        method: 'post',
        data
    })
}

// 获取单位数据
export function getCompanyList(params) {
    return request({
        url: '/CustomerRegister/Detail',
        method: 'get',
        params
    })
}

// 获取批次数据
export function getBatchList(params) {
    return request({
        url: '/CompanyPrintOrder/LoadSearchInfo',
        method: 'get',
        params
    })
}

// 未结算人员列表
export function getUnSettlement(params) {
    return request({
        url: '/CompanySettlement/UnSettlementCustomers',
        params
    })
}

// 新增结算
export function setSettlementCreate(data) {
    return request({
        url: '/CompanySettlement/Create',
        method: 'post',
        data
    })
}

// 新增结算-虎门
export function setCreateByCharge(data) {
    return request({
        url: '/CompanySettlement/CreateByCharge',
        method: 'post',
        data
    })
}

// 新增结算
export function setSettlementCreateNoSend(data) {
    return request({
        url: '/CompanySettlement/CreateNoSend',
        method: 'post',
        data
    })
}
// 新增结算
export function setSettlementSend(params) {
    return request({
        url: '/CompanySettlement/Send',
        method: 'get',
        params
    })
}

// 结算详情
export function setSettlDetail(params) {
    return request({
        url: '/CompanySettlement/Detail',
        params
    })
}

// 结算详情
export function setSettlCancel(data) {
    return request({
        url: '/CompanySettlement/Cancel',
        method: 'post',
        data
    })
}

// 结算详情
export function getCalcPayMoney(data) {
    return request({
        url: '/CompanySettlement/CalcPayMoney',
        method: 'post',
        data
    })
}

// 结算详情-虎门
export function CalcPayMoneyByCharge(data) {
    return request({
        url: '/CompanySettlement/CalcPayMoneyByCharge',
        method: 'post',
        data
    })
}

// 结算详情
export function getCalcCustomerPayMoney(data) {
    return request({
        url: '/CompanySettlement/CalcCustomerPayMoney',
        method: 'post',
        data
    })
}

// 结算详情
export function UnSettlementCustomers(params) {
    return request({
        url: '/CompanySettlement/UnSettlementCustomers',
        params
    })
}
// 结算详情
export function CompanySettlementCreate(data) {
    return request({
        url: '/CompanySettlement/Create',
        method: 'post',
        data
    })
}
// 结算拆分详情
export function CompanySettlementDetail(params) {
    return request({
        url: '/CompanySettlementSplit/Detail',
        params
    })
}

// 结算拆分保存
export function CompanySettlementSave(data) {
    return request({
        url: '/CompanySettlementSplit/Save',
        method: 'post',
        data
    })
}

// 结算拆分保存
export function CalcPayMoneyForChecked(data) {
    return request({
        url: '/CompanySettlement/CalcPayMoneyForChecked',
        method: 'post',
        data
    })
}

// 结算拆分保存
export function CreateForPerson(data) {
    return request({
        url: '/CompanySettlement/CreateForPerson',
        method: 'post',
        data
    })
}