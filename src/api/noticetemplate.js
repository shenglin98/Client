import request from '@/utils/request'

// 通知模板字典列表
export function DicNoticetemplateLoad(params) {
    return request({
        url: '/DicNoticetemplate/Load',
        method: "get",
        params
    })
}

// 通知模板字典新增/修改
export function DicNoticetemplateSave(data) {
    return request({
        url: '/DicNoticetemplate/Save',
        method: "post",
        data
    })
}

// 通知模板字典删除
export function DicNoticetemplateSetStatus(data) {
    return request({
        url: '/DicNoticetemplate/SetStatus',
        method: "post",
        data
    })
}

// 历史通知模板-短信发送
export function SmsLoadByPhone(params) {
    return request({
        url: '/SysStationletter/SmsLoadByPhone',
        method: "get",
        params
    })
}

// 导入文件-短信发送
export function ImportSmsPerson(params) {
    return request({
        url: '/FileExport/ImportSmsPerson',
        method: "get",
        params
    })
}

// 历史通知模板-短信发送
export function SendSMS(data) {
    return request({
        url: '/SysStationletter/SendSMS',
        method: "post",
        data
    })
}