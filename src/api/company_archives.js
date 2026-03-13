import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/CompanyArchives/Load',
        method: 'get',
        params
    })
}

export function CompanyRegisterLoad(params) {
    return request({
        url: '/CompanyArchives/CompanyRegisterLoad',
        method: 'get',
        params
    })
}

export function getDetailList(params) {
    return request({
        url: '/CompanyArchives/Detail',
        method: 'get',
        params
    })
}


export function addCompany(data) {
    return request({
        url: '/CompanyArchives/AddorUpdate',
        method: 'post',
        data
    })
}

export function update(data) {
    return request({
        url: '/Company_Archives/Update',
        method: 'post',
        data
    })
}

export function del(data) {
    return request({
        url: '/CompanyArchives/Delete',
        method: 'post',
        data
    })
}

export function GetAreaList(data) {
    return request({
        url: '/DicArea/GetAreaList',
        method: 'post',
        data
    })
}

export function GetIndustryCategoryList(params) {
    return request({
        url: '/DicOccupationTree/GetIndustryCategoryList',
        method: 'get',
        params
    })
}

export function GetEconomicTypeList(params) {
    return request({
        url: '/DicOccupationTree/GetEconomicTypeList',
        method: 'get',
        params
    })
}

export function GetOccupationTreeList(params) {
    return request({
        url: '/DicOccupationTree/GetOccupationTreeList',
        method: 'get',
        params
    })
}