import request from '@/utils/request'

// 相关介绍列表
export function Load(params) {
    return request({
        url: '/DicPublicIntroduce/Load',
        method: 'get',
        params
    })
}

// 相关介绍详情
export function Detail(params) {
    return request({
        url: '/DicPublicIntroduce/Detail',
        method: 'get',
        params
    })
}

// 相关介绍保存
export function Save(data) {
    return request({
        url: '/DicPublicIntroduce/Save',
        method: 'post',
        data
    })
}

// 删除相关介绍
export function deleteRelatedTroduce(data) {
    return request({
        url: '/DicPublicIntroduce/Delete',
        method: 'post',
        data
    })
}