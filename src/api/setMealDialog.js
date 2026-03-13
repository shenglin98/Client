import request from '@/utils/request'
import axios from 'axios'

// 套餐字典列表
export function getDicSetmealList(params) {
    return request({
        url: '/DicSetmeal/LoadSetmealAndCombine',
        method: 'get',
        params
    })
}

// 套餐字典列表
export function getTemplateList(params) {
    return request({
        url: '/DicPersonSetmeal/Load',
        method: 'get',
        params
    })
}

// 个人套餐字典新增或修改
export function setTemplateAddorUpdate(data) {
    return request({
        url: '/DicPersonSetmeal/CreateOrUpdate',
        method: 'post',
        data
    })
}

// 个人套餐字典删除 
export function setTemplateDelete(data) {
    return request({
        url: '/DicPersonSetmeal/Delete',
        method: 'post',
        data
    })
}

// 获取组合明细
export function getItemList(data) {
    return request({
        url: '/DicCombine/ItemList',
        method: 'post',
        data
    })
}

// 套餐列表-优化
export function LoadSimpleSetmeals(params) {
    return request({
        url: '/DicSetmeal/LoadSimpleSetmeals',
        method: 'get',
        params
    })
}
// 套餐组合列表-优化
export function LoadSetmealCombineList(params) {
    return request({
        url: '/DicSetmeal/LoadSetmealCombineList',
        method: 'get',
        params
    })
}
// 组合列表-优化
export function LoadSimpleCombines(params) {
    return request({
        url: '/DicSetmeal/LoadSimpleCombines',
        method: 'get',
        params
    })
}
// 组合确认-优化
export function SureCombines(data) {
    return request({
        url: '/DicSetmeal/SureCombines',
        method: 'post',
        data
    })
}

// 取消请求用
/* // 获取组合明细
export function getItemList(data, cancelSource) {
    return request({
        url: '/DicCombine/ItemList',
        method: 'post',
        data,
        cancelToken: new axios.CancelToken(function executor(c) {
            // An executor function receives a cancel function as a parameter
            cancelSource.cancel = c;
        })
    })
} */