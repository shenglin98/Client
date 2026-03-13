import request from '@/utils/request'
// method: 'post',
// 
export function getTimeStatic(params) {
    return request({
        url: '/Appointment/TimeStatic',
        params
    })
}