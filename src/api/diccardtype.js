import request from '@/utils/request'

// 体检卡字典列表数据
export function DicCardTypeLoad(params) {
    return request({
        url: '/DicCardType/Load',
        method: 'get',
        params
    })
}

// 体检卡字典新增编辑
export function DicCardTypeSave(data) {
    return request({
        url: '/DicCardType/Save',
        method: 'post',
        data
    })
}

// 体检卡字典删除
export function DicCardTypeDelete(data) {
    return request({
        url: '/DicCardType/Delete',
        method: 'post',
        data
    })
}