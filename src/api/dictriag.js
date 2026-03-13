import request from '@/utils/request'

// 分诊队列字典列表数据
export function LoadTriagQueue(params) {
    return request({
        url: '/DicTriag/LoadTriagQueue',
        method: 'get',
        params
    })
}

// 分诊队列字典新增/修改
export function SaveTriagQueue(data) {
    return request({
        url: '/DicTriag/SaveTriagQueue',
        method: 'post',
        data
    })
}

// 分诊队列字典删除
export function DeleteTriagQueue(data) {
    return request({
        url: '/DicTriag/DeleteTriagQueue',
        method: 'post',
        data
    })
}

// 区域管理字典列表数据
export function LoadTriagArea(params) {
    return request({
        url: '/DicTriag/LoadTriagArea',
        method: 'get',
        params
    })
}

// 区域管理字典新增/修改
export function SaveTriagArea(data) {
    return request({
        url: '/DicTriag/SaveTriagArea',
        method: 'post',
        data
    })
}

// 区域字典字典删除
export function DeleteTriagArea(data) {
    return request({
        url: '/DicTriag/DeleteTriagArea',
        method: 'post',
        data
    })
}

// 诊室字典列表
export function LoadTriagRoom(params) {
    return request({
        url: '/DicTriag/LoadTriagRoom',
        method: 'get',
        params
    })
}
// 诊室字典新增/修改
export function SaveTriagRoom(data) {
    return request({
        url: '/DicTriag/SaveTriagRoom',
        method: 'post',
        data
    })
}

// 诊室字典删除
export function DeleteTriagRoom(data) {
    return request({
        url: '/DicTriag/DeleteTriagRoom',
        method: 'post',
        data
    })
}

// 区域距离字典列表
export function LoadTriagAreaTime(params) {
    return request({
        url: '/DicTriag/LoadTriagAreaTime',
        method: 'get',
        params
    })
}
// 区域距离字典新增/修改
export function SaveTriagAreaTime(data) {
    return request({
        url: '/DicTriag/SaveTriagAreaTime',
        method: 'post',
        data
    })
}

// 区域距离字典删除
export function DeleteTriagAreaTime(data) {
    return request({
        url: '/DicTriag/DeleteTriagAreaTime',
        method: 'post',
        data
    })
}

// 分诊前置 列表
export function LoadTriagCondition(params) {
    return request({
        url: '/DicTriag/LoadTriagCondition',
        method: 'get',
        params
    })
}

// 分诊字典-校验
export function CheckRoomCombineSet(params) {
    return request({
        url: '/DicTriag/CheckRoomCombineSet',
        method: 'get',
        params
    })
}

// 分诊前置 新增/编辑
export function SaveTriagCondition(data) {
    return request({
        url: '/DicTriag/SaveTriagCondition',
        method: 'post',
        data
    })
}

// 分诊前置 删除
export function DeleteTriagCondition(data) {
    return request({
        url: '/DicTriag/DeleteTriagCondition',
        method: 'post',
        data
    })
}