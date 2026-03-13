import request from '@/utils/request'

export function getList(data) {
    return request({
        url: '/CompanyRegister/Load',
        method: 'post',
        data
    })
}

export function getDetail(params) {
    console.log(params)
    return request({
        url: '/CompanyRegister/Detail',
        method: 'get',
        params
    })
}

export function add(data) {
    console.log(data)
    return request({
        url: '/CompanyRegister/Create',
        method: 'post',
        data
    })
}

export function update(data) {
    return request({
        url: '/CompanyRegister/Update',
        method: 'post',
        data
    })
}

export function del(data) {
    return request({
        url: '/CompanyRegister/Delete',
        method: 'post',
        data
    })
}
export function UpdateCostStatusYes(data) {
    return request({
        url: '/CompanyRegister/UpdateCostStatusYes',
        method: 'post',
        data
    })
}
export function UpdateCostStatusNo(data) {
    return request({
        url: '/CompanyRegister/UpdateCostStatusNo',
        method: 'post',
        data
    })
}
export function GroupPriceSync(data) {
    return request({
        url: '/CompanyRegister/GroupPriceSync',
        method: 'post',
        data
    })
}
export function CompanyReportLoad(data) {
    return request({
        url: '/CompanyReport/Load',
        method: 'post',
        data
    })
}