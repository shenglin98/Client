import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/DicSetmeal/Load',
        method: 'get',
        params
    })
}

export function loadType(params) {
    return request({
        url: '/DictionariesTypes/Load',
        method: 'get',
        params
    })
}

export function dicsetmealload(params) {
    return request({
        url: '/DicSetmeal/Detail',
        method: 'get',
        params
    })
}

export function loadmecsetmeal(params) {
    return request({
        url: '/DicSetmeal/loadmecsetmeal',
        method: 'get',
        params
    })
}

export function dicsetmealadd(data) {
    return request({
        url: '/DicSetmeal/Create',
        method: 'post',
        data
    })
}

export function createmecsetmeal(data) {
    return request({
        url: '/DicSetmeal/CreateMecSetmeal',
        method: 'post',
        data
    })
}

export function dicsetmealupdate(data) {
    return request({
        url: '/DicSetmeal/Update',
        method: 'post',
        data
    })
}

export function dicsetmealdelete(data) {
    return request({
        url: '/DicSetmeal/Delete',
        method: 'post',
        data
    })
}

export function getComboList(params) {
    return request({
        url: '/DicPersonSetmeal/Load',
        method: 'get',
        params
    })
}

export function getComboDetails(params) {
    return request({
        url: '/DicPersonSetmeal/Detail',
        method: 'get',
        params
    })
}
export function deleteCombo(data) {
    return request({
        url: '/DicPersonSetmeal/Delete',
        method: 'post',
        data
    })
}
export function addChangeCombo(data) {
    return request({
        url: '/DicPersonSetmeal/CreateOrUpdate',
        method: 'post',
        data
    })
}
export function GetSetmealPrice(params) {
    return request({
        url: '/DicSetmeal/GetSetmealPrice',
        method: 'get',
        params
    })
}
export function SameSetmealPrice(params) {
    return request({
        url: '/DicSetmeal/SameSetmealPrice',
        method: 'get',
        params
    })
}