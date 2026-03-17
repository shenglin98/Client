import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/sysconfig/Load',
        method: 'get',
        params
    })
}



export function deleteCache() {
    return request({
        url: '/sysconfig/DeleteCache',
        method: 'post',
    })
}

export function addOrUpdate(data) {
    console.log(data)
    return request({
        url: '/sysconfig/AddOrUpdate',
        method: 'post',
        data
    })
}

export function update(data) {
    return request({
        url: '/sysconfig/Update',
        method: 'post',
        data
    })
}

export function del(data) {
    return request({
        url: '/sysconfig/Delete',
        method: 'post',
        data
    })
}

export function getSysConfigInfo(params) {
    return request({
        url: '/SysConfig/GetSysConfigInfo',
        method: 'get',
        params
    })
}

// /SysOperateLog/Load
export function deleteItem(data) {
    return request({
        url: '/SysConfig/Delete',
        method: 'post',
        data
    })
}