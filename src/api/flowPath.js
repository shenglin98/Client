import request from '@/utils/request'
// method: 'post',
// 
export function getTrackDetail(params) {
    return request({
        url: '/CustomerRegister/TrackDetail',
        params
    })
}