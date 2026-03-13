import request from '@/utils/request'

// 疾病字典列表数据
export function Load(params) {
    return request({
        url: '/DicIllness/Load',
        method: 'get',
        params
    })
}

// 疾病字典详情数据
export function IllnessDetail(params) {
    return request({
        url: '/DicIllness/IllnessDetail',
        method: 'get',
        params
    })
}

// 疾病字典新增编辑
export function AddOrUpdate(data) {
    return request({
        url: '/DicIllness/AddOrUpdate',
        method: 'post',
        data
    })
}

// 疾病字典删除
export function Delete(data) {
    return request({
        url: '/DicIllness/Delete',
        method: 'post',
        data
    })
}

// 疾病字典删除
export function WordList(params) {
    return request({
        url: '/DicConclusion/WordList',
        method: 'get',
        params
    })
}