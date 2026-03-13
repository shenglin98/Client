import request from "@/utils/request";

export function getList(data) {
    return request({
        url: "/CustomerCritical/List",
        method: "post",
        data,
    });
}

export function getTemplateList(data) {
    return request({
        url: "/CustomerCriticalItemTemplate/List",
        method: "post",
        data,
    });
}

export function addTemplate(data) {
    return request({
        url: "/CustomerCriticalItemTemplate/Add",
        method: "post",
        data,
    });
}

export function updateTemplate(data) {
    return request({
        url: "/CustomerCriticalItemTemplate/Update",
        method: "post",
        data,
    });
}

export function deleteTemplate(data) {
    return request({
        url: "/CustomerCriticalItemTemplate/Delete",
        method: "post",
        data,
    });
}

export function butchUpdate(data) {
    return request({
        url: "/CustomerCritical/ButchUpdate",
        method: "post",
        data,
    });
}

export function getTrackList(data) {
    return request({
        url: "/CustomerCritical/TrackList",
        method: "post",
        data,
    });
}

export function getTrackJoinCriticalList(data) {
    return request({
        url: "/CustomerCritical/TrackJoinCriticalList",
        method: "post",
        data,
    });
}

export function addTrack(data) {
    return request({
        url: "/CustomerCritical/Track",
        method: "post",
        data,
    });
}

export function butchTrack(data) {
    return request({
        url: "/CustomerCritical/ButchTrack",
        method: "post",
        data,
    });
}

export function PersonCriticals(params) {
    return request({
        url: "/CustomerCritical/PersonCriticals",
        method: "get",
        params,
    });
}

export function PersonCriticalItem(params) {
    return request({
        url: "/CustomerCritical/PersonCriticalItem",
        method: "get",
        params,
    });
}


// 历史通知模板-短信发送-新
export function SendSMSForCustomerCritical(data) {
    return request({
        url: '/SysStationletter/SendSMSForCustomerCritical',
        method: "post",
        data
    })
}


// 设置为短信模板
export function SaveSimple(data) {
    return request({
        url: '/DicNoticetemplate/SaveSimple',
        method: "post",
        data
    })
}


// 设置为短信模板
export function HandleStringFormat(data) {
    return request({
        url: '/SysStationletter/HandleStringFormat',
        method: "post",
        data
    })
}