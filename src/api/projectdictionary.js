import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/dicitem/Load',
        method: 'get',
        params
    })
}

export function dicItemChargegetList(data) {
    return request({
        url: '/DicItemCharge/Load',
        method: 'post',
        data
    })
}

export function diccombineload(params) {
    return request({
        url: '/DicCombine/Load',
        method: 'get',
        params
    })
}

export function dicItemChargeDetail(params) {
    return request({
        url: '/DicItemCharge/Detail',
        method: 'get',
        params
    })
}

export function dicCombineChargeDetail(params) {
    return request({
        url: '/DicItemCharge/CombineChargeDetail',
        method: 'get',
        params
    })
}

export function dicItemChargeSave(data) {
    return request({
        url: '/DicItemCharge/Save',
        method: 'post',
        data
    })
}

export function combineChargeSave(data) {
    return request({
        url: '/DicItemCharge/CombineChargeSave',
        method: 'post',
        data
    })
}

export function dicCombineload(params) {
    return request({
        url: '/DicCombine/Detail',
        method: 'get',
        params
    })
}

export function dictionaryload(params) {
    return request({
        url: '/Dictionary/DicLoad',
        method: 'get',
        params
    })
}

export function dicCombineadd(data) {
    return request({
        url: '/DicCombine/Create',
        method: 'post',
        data
    })
}

export function diccombineupdate(data) {
    return request({
        url: '/DicCombine/update',
        method: 'post',
        data
    })
}

export function add(data) {
    return request({
        url: '/DicItem/Create',
        method: 'post',
        data
    })
}

export function dicdelete(data) {
    return request({
        url: '/DicItem/Delete',
        method: 'post',
        data
    })
}

export function diccombinedelete(data) {
    return request({
        url: '/DicCombine/Delete',
        method: 'post',
        data
    })
}

export function deleteItemValue(data) {
    return request({
        url: '/DicItem/DeleteItemValue',
        method: 'post',
        data
    })
}


export function combinechargedelete(data) {
    return request({
        url: '/DicItemCharge/CombineChargeDelete',
        method: 'post',
        data
    })
}

export function update(data) {
    return request({
        url: '/DicItem/update',
        method: 'post',
        data
    })
}

export function detailsLoad(params) {
    return request({
        url: '/DicItem/detailsLoad',
        method: 'get',
        params
    })
}

export function detail(params) {
    return request({
        url: '/DicItem/detail',
        method: 'get',
        params
    })
}

// dictionaryTypes
export function addType(data) {
    return request({
        url: '/DictionariesTypes/Add',
        method: 'post',
        data
    })
}

export function updateType(data) {
    return request({
        url: '/DictionariesTypes/Update',
        method: 'post',
        data
    })
}

export function delType(data) {
    return request({
        url: '/DictionariesTypes/Delete',
        method: 'post',
        data
    })
}

export function itemchargedel(data) {
    return request({
        url: '/DicItemCharge/Delete',
        method: 'post',
        data
    })
}

export function loadType(params) {
    return request({
        url: '/DictionariesTypes/Load',
        method: 'get',
        params
    })
}