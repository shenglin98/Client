import request from '@/utils/request'
// method: 'post',
// 系统配置获取系统配置
export function getOrderSearch(data) {
    return request({
        url: '/CustomerRegister/OrderSearch',
        method: 'post',
        data
    })
}
// 系统配置获取系统配置
export function getOrderSearchList(data) {
    return request({
        url: '/CustomerRegister/OrderSearchList',
        method: 'post',
        data
    })
}