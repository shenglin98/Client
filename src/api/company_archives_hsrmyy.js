import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/CompanyArchives/Load',
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

// 添加单位名称/ 团检档案
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
// 批量修改单位名称
export function ModifyOrganization(data) {
    return request({
        url: '/OccupationalDisease/ModifyOrganization',
        method: 'post',
        data
    })
}