import request from '@/utils/request'

// method: 'post',

// 获取系统报表列表
export function SysReportDesignLoad(data) {
    return request({
        url: '/SysReportDesign/Load',
        method: 'post',
        data
    })
}

// 角色列表
export function rolesLoadAll(params) {
    return request({
        url: '/roles/LoadAll',
        method: 'get',
        params
    })
}

// 提交编辑
export function SysReportDesignSave(data) {
    return request({
        url: '/SysReportDesign/Save',
        method: 'post',
        data
    })
}