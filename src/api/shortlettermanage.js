import request from '@/utils/request'

// 通知模板字典列表
export function SysStationletterSmsLoad(data) {
    return request({
        url: '/SysStationletter/SmsLoad',
        method: "post",
        data
    })
}

// 通知模板字典新增/修改
export function SysStationletterSmsDetailLoad(data) {
    return request({
        url: '/SysStationletter/SmsDetailLoad',
        method: "post",
        data
    })
}