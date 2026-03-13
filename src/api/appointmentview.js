import request from '@/utils/request'
// method: 'post',

// 预约时间表
export function GetAppointmentTimeLoad(data) {
    return request({
        url: '/AppointmentStatics/AppointmentTimeLoad',
        method: 'post',
        data
    })
}

// 预约人员
export function AppointmentCustomerLoad(data) {
    return request({
        url: '/AppointmentStatics/AppointmentCustomerLoad',
        method: 'post',
        data
    })
}