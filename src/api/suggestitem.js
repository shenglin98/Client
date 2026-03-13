import request from '@/utils/request'

// 通知模板字典列表
export function DicRecommendLoad(params) {
    return request({
        url: '/DicRecommend/Load',
        method: "get",
        params
    })
}
// 通知模板字典详情
export function DicRecommendDetail(params) {
    return request({
        url: '/DicRecommend/Detail',
        method: "get",
        params
    })
}

// 通知模板字典列表
export function DicRecommendSave(data) {
    return request({
        url: '/DicRecommend/Save',
        method: "post",
        data
    })
}