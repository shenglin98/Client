import request from '@/utils/request'
// method: 'post',
// 获取选中人员的诊断
export function CustomerIllList(data) {
    return request({
        url: '/IllnessStatics/CustomerIllList',
        method: "post",
        data
    })
}

// 保存疾病统计信息
export function IllnessStaticsSave(data) {
    return request({
        url: '/IllnessStatics/Save',
        method: "post",
        data
    })
}

// 疾病统计列表
export function IllnessStaticsLoad(data) {
    return request({
        url: '/IllnessStatics/Load',
        method: "post",
        data
    })
}

// 疾病统计详情
export function IllnessStaticsDetial(params) {
    return request({
        url: '/IllnessStatics/Detial',
        method: "get",
        params
    })
}

// 疾病统计详情
export function IllnessStaticsLoadCustomers(data) {
    return request({
        url: 'IllnessStatics/LoadCustomers',
        method: "post",
        data
    })
}

// 疾病统计-统计号删除
export function IllnessStaticsDelete(data) {
    return request({
        url: '/IllnessStatics/Delete',
        method: "post",
        data
    })
}