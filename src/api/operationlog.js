import request from '@/utils/request'

export function getCompanyList(params) {
    return request({
        url: '/SysOperateLog/Load',
        method: 'get',
        params
    })
}