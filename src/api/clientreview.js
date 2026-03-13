import request from '@/utils/request'

// 追踪列表
export function getLoadTrack(data) {
    return request({
        url: '/CustomerTrack/LoadTrack',
        method: 'post',
        data
    })
}

// 追踪明细
export function getTrackDetail(params) {
    return request({
        url: '/CustomerTrack/TrackDetail',
        params
    })
}

// 继续追踪
export function setAgainTrack(data) {
    return request({
        url: '/CustomerTrack/AgainTrack',
        method: 'post',
        data
    })
}

// 结束追踪
export function setCompleteTrack(data) {
    return request({
        url: '/CustomerTrack/CompleteTrack',
        method: 'post',
        data
    })
}