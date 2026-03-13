import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/users/load',
        method: 'get',
        params
    })
}

/**
 * 是否忽略登录用户权限，直接获取全部数据
 * 用于可以跨部门选择用户的场景
 */
export function loadAll(params) {
    return request({
        url: '/users/loadall',
        method: 'get',
        params
    })
}

export function get(params) {
    return request({
        url: '/users/get',
        method: 'get',
        params
    })
}

export function addhospitaluser(data) {
    return request({
        url: '/users/AddHospitaluser',
        method: 'post',
        data
    })
}

export function GetSysAppKey(data) {
    return request({
        url: '/SysConfig/GetSysAppKey',
        method: 'post',
        data
    })
}

export function cancelhospitaluser(data) {
    return request({
        url: '/users/CancelHospitaluser',
        method: 'post',
        data
    })
}

export function add(data) {
    return request({
        url: '/users/addorupdate',
        method: 'post',
        data
    })
}

export function update(data) {
    return request({
        url: '/users/addorupdate',
        method: 'post',
        data
    })
}

export function changePassword(data) {
    return request({
        url: '/users/changepassword',
        method: 'post',
        data
    })
}

export function changeProfile(data) {
    return request({
        url: '/users/changeprofile',
        method: 'post',
        data
    })
}

export function del(data) {
    return request({
        url: '/users/delete',
        method: 'post',
        data
    })
}

export function loadByRole(params) {
    return request({
        url: '/users/loadByRole',
        method: 'get',
        params
    })
}
export function LoadByOrg(params) {
    return request({
        url: '/users/LoadByOrg',
        method: 'get',
        params
    })
}
export function getUserImage(params) {
    return request({
        url: '/Users/GetUserImage',
        method: 'get',
        params
    })
}
export function getUserProperty(params) {
    return request({
        url: '/Users/GetUserProperty',
        method: 'get',
        params
    })
}
export function UsersSync(params) {
    return request({
        url: '/Users/UsersSync',
        method: 'get',
        params
    })
}