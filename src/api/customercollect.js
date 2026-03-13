import request from '@/utils/request'

// 个人收藏列表
export function CustomerCollectLoad(data) {
    return request({
        url: '/CustomerCollect/Load',
        method: 'post',
        data
    })
}

// 个人收藏明细
export function CustomerCollectSave(data) {
    return request({
        url: '/CustomerCollect/Save',
        method: 'post',
        data
    })
}
// 个人收藏明细
export function CustomerCollectPersonDetail(params) {
    return request({
        url: '/CustomerCollect/PersonDetail',
        params
    })
}
// 个人收藏删除
export function CustomerCollectDelete(params) {
    return request({
        url: '/CustomerCollect/Delete',
        params
    })
}