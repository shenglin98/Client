import request from '@/utils/request'
// method: 'post',
// 获取单位列表
export function getCompanyList(params) {
    return request({
        url: '/CompanyArchives/Load',
        params
    })
}
// 获取搜索条件集数据
export function getSearchParams(params) {
    return request({
        url: '/CompanyPrintOrder/LoadSearchInfo',
        params
    })
}

// 个人预约列表数据
export function getIntmentList(data) {
    return request({
        url: '/Appointment/Load',
        method: 'post',
        data
    })
}

// 个人预约列表数据-广药
export function getIntmentListNew(data) {
    return request({
        url: '/Appointment/LoadNew',
        method: 'post',
        data
    })
}
// 统计-广药
export function CurrentAppointAndReportCount(params) {
    return request({
        url: '/Appointment/CurrentAppointAndReportCount',
        method: 'get',
        params
    })
}
// 预约保存
export function setAppointmentSave(data) {
    return request({
        url: '/Appointment/Save',
        method: 'post',
        data
    })
}
// 预约保存
export function setAppointmentAlter(data) {
    return request({
        url: '/Appointment/Alter',
        method: 'post',
        data
    })
}
// 批量取消预约
export function setAppointmentCancel(data) {
    return request({
        url: '/Appointment/Cancel',
        method: 'post',
        data
    })
}