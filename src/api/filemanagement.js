import request from '@/utils/request' 
// 批量新增激活/注销
export function Load(params) {
    return request({
        url: '/Files/Load',
        method: 'get',
        params
    })
}
 