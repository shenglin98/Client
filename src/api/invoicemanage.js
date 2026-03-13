import request from '@/utils/request'

// 发票管理列表
export function InvoiceBillLoad(data) {
    return request({
        url: '/Invoice/BillLoad',
        method: 'post',
        data
    })
}

// 发票管理详情
export function InvoiceBillDetail(params) {
    return request({
        url: '/Invoice/BillDetail',
        method: 'get',
        params
    })
}

// 费用管理列表
export function InvoiceStaticsList(data) {
    return request({
        url: '/InvoiceStatics/FindCustomerCostSettlementList',
        method: 'post',
        data
    })
}

// 编辑发票抬头保存
export function UpdateInvoiceTitle(data) {
    return request({
        url: '/PaymentInfo/UpdateInvoiceTitle',
        method: 'post',
        data
    })
}

// 单位名称数据
export function LoadInvoiceRise(params) {
    return request({
        url: '/CompanyArchives/LoadInvoiceRise',
        method: 'get',
        params
    })
}

// 生成发票
export function GeneBill(params) {
    return request({
        url: '/Invoice/GeneBill',
        method: 'get',
        params
    })
}