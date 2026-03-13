import request from '@/utils/request'
// method: 'post',
// 我的工作统计
export function getWorkStatic(params) {
    return request({
        url: '/MainPage/WorkStatic',
        params
    })
}

// 站内信列表
export function getMessageList(data) {
    return request({
        url: '/SysStationletter/Load',
        method: 'post',
        data
    })
}

// 获取便签列表数据
export function getNoteList(data) {
    return request({
        url: '/SysNote/Load',
        method: 'post',
        data
    })
}

// 便签保存数据
export function setNoteAdd(data) {
    return request({
        url: '/SysNote/Save',
        method: 'post',
        data
    })
}

// 便签详情
export function setNoteDetail(params) {
    return request({
        url: '/SysNote/Detail',
        method: 'get',
        params
    })
}


// 便签删除数据
export function setNoteDelete(data) {
    return request({
        url: '/SysNote/Delete',
        method: 'post',
        data
    })
}

// 系统宫傲列表
export function getSysBulletin(data) {
    return request({
        url: '/SysBulletin/Load',
        method: 'post',
        data
    })
}

// 危机值列表
export function getCriticalvalueList(data) {
    return request({
        // url: '/CustomerCritical/Load',
        url: '/CustomerCritical/DashboardList',
        method: 'post',
        data
    })
}

// 消息提醒个人明细
export function getDetails(params) {
    return request({
        url: '/CustomerRegister/Detail',
        method: 'get',
        params
    })
}

// 消息提醒个人明细
export function getGetModules(params) {
    return request({
        url: '/Check/GetModules',
        method: 'get',
        params
    })
}

// 我的工作模块获取配置
export function getMyWorkModule(params) {
    return request({
        url: '/MainPage/MyWorkModule',
        method: 'get',
        params
    })
}
// 我的工作模块保存配置
export function setMyWorkModuleSave(data) {
    return request({
        url: '/MainPage/MyWorkModuleSave',
        method: 'post',
        data
    })
}

// 获取常用功能模块
export function getMyModules(params) {
    return request({
        url: '/Users/GetMyModules',
        method: 'get',
        params
    })
}
// 保存常用功能模块
export function saveMyModules(data) {
    return request({
        url: '/Users/SaveMyModules',
        method: 'post',
        data
    })
}

// 危急值未处理
export function getNotConfirmCritical(data) {
    return request({
        url: '/CustomerCritical/GetNotConfirmCritical',
        method: 'post',
        data
    })
}

// 危急值处理
export function getNotConfirmConfirm(data) {
    return request({
        url: '/CustomerCritical/Confirm',
        method: 'post',
        data
    })
}

// 危急值列表
export function getCriticalList(data) {
    return request({
        url: '/CustomerCritical/CriticalList',
        method: 'post',
        data
    })
}

// 查看预约列表
export function AppointmentLoad(data) {
    return request({
        url: '/Appointment/Load  ',
        method: 'post',
        data
    })
}