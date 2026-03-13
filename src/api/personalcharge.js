import request from '@/utils/request'
// method: 'post',
// 系统配置获取系统配置

// 获取页面信息
export function PaymentInfoFindPay(data) {
    return request({
        url: '/PaymentInfo/FindPay',
        method: "post",
        data
    })
}

// 现金支付
export function PaymentInfoPay(data) {
    return request({
        url: '/PaymentInfo/Pay',
        method: "post",
        data
    })
}

// 日结调用
export function EverydayStatics(data) {
    return request({
        url: '/InvoiceStatics/EverydayStatics',
        method: "post",
        data
    })
}