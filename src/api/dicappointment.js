import request from '@/utils/request'

export function getList(url, params) {
    return request({
        url: '/' + url + '/Load',
        method: 'get',
        params
    })
}

export function detail(url, params) {
    return request({
        url: '/' + url + '/Detail',
        method: 'get',
        params
    })
}

export function save(url, data) {
    return request({
        url: '/' + url + '/Save',
        method: 'post',
        data
    })
}

export function getorganlist() {
    return request({
        url: '/Check/OrganList',
        method: 'post',
    })
}


export function del(url, data) {
    return request({
        url: '/' + url + '/delete',
        method: 'post',
        data
    })
}
// 获取节假日数据
export function HolidayLoad(params) {
    return request({
        url: `/DicaAppointmentVacation/HolidayLoad`,
        method: 'get',
        params
    })
}
// 编辑-添加-删除  节假日数据
export function UpdateHoliday(data) {
    return request({
        url: `/DicaAppointmentVacation/UpdateHoliday`,
        method: 'post',
        data
    })
}
// 总号源 - 保存
export function SaveAllAppointmentNum(data) {
    return request({
        url: `/DicaAppointmentVacation/SaveAllAppointmentNum`,
        method: 'post',
        data
    })
}
// 总号源 - 删除
export function DeleteAllAppointmentNum(data) {
    return request({
        url: `/DicaAppointmentVacation/DeleteAllAppointmentNum`,
        method: 'post',
        data
    })
}
// 总号源 - 列表
export function LoadAllAppointmentNum(params) {
    return request({
        url: `/DicaAppointmentVacation/LoadAllAppointmentNum`,
        method: 'get',
        params
    })
}