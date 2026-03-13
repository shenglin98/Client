import request from '@/utils/request'
// method: 'post',
// 获取质控列表人员数据
export function getCustomerQcProcessList(data) {
    return request({
        url: '/CustomerQcProcess/Load',
        method: 'post',
        data
    })
}
// 质控列表人员修改
export function setCustomerQcProcessSave(data) {
    return request({
        url: '/CustomerQcProcess/Save',
        method: 'post',
        data
    })
}