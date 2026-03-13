import request from '@/utils/request'
// method: 'post',
// 获取获取登记信息、叫号 
export function getPersonalDetail(params) {
    return request({
        url: '/CustomerRegister/Detail',
        params
    })
}

export function getBatchOrGroup(params) {
    return request({
        url: '/CompanyPrintOrder/LoadSearchInfo',
        params
    })
}

// 加载主页列表数据
export function getPageList(data) {
    return request({
        url: '/CustomerRegister/Search',
        method: 'post',
        data
    })
}

// 总检任务列表
export function getLoad(data) {
    return request({
        url: '/TotalCheckPlan/Load',
        method: 'post',
        data
    })
}


// 医生总检任务列表
export function getDoctorPlan(data) {
    return request({
        url: '/TotalCheckPlan/DoctorPlan',
        method: 'post',
        data
    })
}
// 医生总检任务分配保存
export function getSave(data) {
    return request({
        url: '/TotalCheckPlan/Save',
        method: 'post',
        data
    })
}
// 医生总检任务分配保存
export function getChangePlan(data) {
    return request({
        url: '/TotalCheckPlan/ChangePlan',
        method: 'post',
        data
    })
}
// 获取复查
export function GetReviewGet(params) {
    return request({
        url: '/OccupationalDisease/ReviewGet',
        method: 'get',
        params
    })
}

// 获取结论
export function GetCause(params) {
    return request({
        url: '/OccupationalDisease/GetCause',
        method: 'get',
        params
    })
}

// 取消分配
export function CancelPlan(data) {
    return request({
        url: '/TotalCheckPlan/CancelPlan',
        method: 'post',
        data
    })
}

// 批量总检/审核 列表
export function TotalCheckLoad(data) {
    return request({
        url: '/TotalCheckPlan/TotalCheckLoad',
        method: 'post',
        data
    })
}

// 批量总检
export function BatchSave(data) {
    return request({
        url: '/TotalCheck/BatchSave',
        method: 'post',
        data
    })
}

// 批量审核
export function BatchCheck(data) {
    return request({
        url: '/TotalCheck/BatchCheck',
        method: 'post',
        data
    })
}

// 批量二审
export function BatchCheck2(data) {
    return request({
        url: '/TotalCheck2/BatchCheck',
        method: 'post',
        data
    })
}

// 取消批量二审
export function BatchCheck2Cancel(data) {
    return request({
        url: '/TotalCheck2/CancelCheck',
        method: 'post',
        data
    })
}