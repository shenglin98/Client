import request from '@/utils/request'
// method: 'post',
// 系统配置获取系统配置
export function getPersonalOccupationDetail(params) {
    return request({
        url: '/CustomerRegisterOccupation/Detail',
        params
    })
}
export function getBatchOrGroup(params) {
    return request({
        url: '/CompanyPrintOrder/LoadSearchInfo',
        params
    })
}