import request from '@/utils/request'

// 请求数据
export function getDicOccupation(params) {
    return request({
        url: '/DicOccupation/Load',
        method: 'get',
        params
    })
}

// 新增数据
export function getCreate(data) {
    return request({
        url: '/DicOccupation/Create',
        method: 'post',
        data
    })
}

// 修改数据
export function getUpadate(data) {
    return request({
        url: '/DicOccupation/Upadate',
        method: 'post',
        data
    })
}

// 删除数据
export function getDelete(data) {
    return request({
        url: '/DicOccupation/Delete',
        method: 'post',
        data
    })
}

//  职业病新增五个字典 请求数据
export function getOccupationalDiseaseLoad(params) {
    return request({
        url: '/OccupationalDisease/Load',
        method: 'get',
        params
    })
}
// 职业病新增五个字典  新增数据
export function getOccupationalDiseaseAdd(data) {
    return request({
        url: '/OccupationalDisease/Add',
        method: 'post',
        data
    })
}
//  职业病新增五个字典 修改数据
export function getOccupationalDiseaseUpdate(data) {
    return request({
        url: '/OccupationalDisease/Update',
        method: 'post',
        data
    })
}

// 职业病新增五个字典  删除数据
export function getOccupationalDiseaseDelete(data) {
    return request({
        url: '/OccupationalDisease/Delete',
        method: 'post',
        data
    })
}


// 职业病 获取职业危害套餐与项目
export function GetOccupationHarm(params) {
    return request({
        url: '/OccupationalDisease/GetOccupationHarm',
        params
    })
}

// 职业病 获取职业危害 套餐
export function GetSetmealLoad(params) {
    return request({
        url: '/OccupationalDisease/GetSetmeal',
        params
    })
}



// 职业病 获取职业危害 组合
export function GetDicCombineLoad(params) {
    return request({
        url: '/DicCombine/Load',
        params
    })
}
// 职业病 组合字典搜索
export function GetSearchSetmeal(params) {
    return request({
        url: '/OccupationalDisease/GetSetmeal',
        params
    })
}


// 职业病 添加职业危害 套餐
export function AddSetmealApi(data) {
    return request({
        url: '/OccupationalDisease/AddSetmeal',
        method: 'post',
        data
    })
}

// 职业病 删除职业危害 套餐
export function DelSetmealApi(data) {
    return request({
        url: '/OccupationalDisease/DelSetmeal',
        method: 'post',
        data
    })
}
// 职业病 添加职业危害 组合
export function AddcombineApi(data) {
    return request({
        url: '/OccupationalDisease/Addcombine',
        method: 'post',
        data
    })
}


// 职业病 删除职业危害 组合
export function DelcombineApi(data) {
    return request({
        url: '/OccupationalDisease/Delcombine',
        method: 'post',
        data
    })
}
// 职业病  点击行业关联获取工种数据
export function LoadIndustryRelevance(params) {
    return request({
        url: '/OccupationalDisease/LoadIndustryRelevance',
        method: 'get',
        params
    })
}
// 职业病  获取行业对应的工种数据
export function LoadRelevance(params) {
    return request({
        url: '/OccupationalDisease/LoadRelevance',
        method: 'get',
        params
    })
}
// 职业病  新增行业关联的工种数据
export function AddRelevance(data) {
    return request({
        url: '/OccupationalDisease/AddRelevance',
        method: 'post',
        data
    })
}
// 职业病  编辑行业关联的工种数据
export function EditRelevance(data) {
    return request({
        url: '/OccupationalDisease/EditRelevance',
        method: 'post',
        data
    })
}
// 职业病  删除行业关联的工种数据
export function DelRelevance(data) {
    return request({
        url: '/OccupationalDisease/DelRelevance',
        method: 'post',
        data
    })
}
