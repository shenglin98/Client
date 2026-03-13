import request from '@/utils/request'

export function getListType(params) {
    return request({
        url: '/Dictionary/DicOccupationLoad',
        method: 'get',
        params
    })
}


export function addType(data) {
    return request({
        url: '/Dictionary/DicOccupationCreateOrUpdate',
        method: 'post',
        data
    })
}


export function deleteType(data) {
    return request({
        url: '/Dictionary/DicOccupationDelete',
        method: 'post',
        data
    })
}


export function getList(data) {
    return request({
        url: '/Dictionary/DicOccupationDetailLoad',
        method: 'post',
        data
    })
}


export function add(data) {
    return request({
        url: '/Dictionary/DicOccupationDetailCreateOrUpdate',
        method: 'post',
        data
    })
}


export function deleteList(data) {
    return request({
        url: '/Dictionary/DicOccupationDetailDelete',
        method: 'post',
        data
    })
}