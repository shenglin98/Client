import request from '@/utils/request'
// method: 'post',

// 授权列表接口
export function sysExpireList(data) {
    return request({
        url: '/SysExpire/Load',
        method: 'post',
        data
    })
}
// 授权列表接口保存
export function sysExpireSave(data) {
    return request({
        url: '/SysExpire/Save',
        method: 'post',
        data
    })
}