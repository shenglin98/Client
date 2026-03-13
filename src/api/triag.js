import request from '@/utils/request'

// method: 'post',

// 获取医生当天诊室
export function TriagDetail(params) {
    return request({
        url: '/Triag/Detail',
        method: 'get',
        params
    })
}

// 诊室字典列表
export function LoadTriagRoom(params) {
    return request({
        url: '/Triag/LoadTriagRoom',
        method: 'get',
        params
    })
}

// 诊室开诊
export function TriagOpen(params) {
    return request({
        url: '/Triag/Open',
        method: 'get',
        params
    })
}

// 诊室停诊
export function TriagClose(params) {
    return request({
        url: '/Triag/Close',
        method: 'get',
        params
    })
}

// 诊室关闭
export function TriagDelete(params) {
    return request({
        url: '/Triag/Delete',
        method: 'get',
        params
    })
}

// 诊室叫号
export function TriagCall(params) {
    return request({
        url: '/Triag/Call',
        method: 'get',
        params
    })
}

// 诊室过号(跳号)
export function TriagSkip(params) {
    return request({
        url: '/Triag/Skip',
        method: 'get',
        params
    })
}

// 诊室完成
export function TriagComplete(params) {
    return request({
        url: '/Triag/Complete',
        method: 'get',
        params
    })
}

// 诊室完成 - 无id
export function TriagCompleteNotQueue(params) {
    return request({
        url: '/Triag/CompleteNotQueue',
        method: 'get',
        params
    })
}

// 诊室恢复-过号
export function TriagRestore(params) {
    return request({
        url: '/Triag/Restore',
        method: 'get',
        params
    })
}

// 诊室恢复-暂停-恢复
export function ChangeRoomStopStatus(params) {
    return request({
        url: '/Triag/ChangeRoomStopStatus',
        method: 'get',
        params
    })
}

// 输入体检号
export function CallNoRoom(params) {
    return request({
        url: '/Triag/CallNoRoom',
        method: 'get',
        params
    })
}

// 诊室恢复-请求推送数据
export function WorkPage(params) {
    return request({
        url: '/Triag/WorkPage',
        method: 'get',
        params
    })
}

// 设置诊室
export function TriagSave(data) {
    return request({
        url: '/Triag/Save',
        method: 'post',
        data
    })
}

// 设置诊室
export function TriagTriagDetail(params) {
    return request({
        url: '/Triag/TriagDetail',
        method: 'get',
        params
    })
}

// 设置诊室-取消排队
export function TriagCancelPaidui(params) {
    return request({
        url: '/Triag/CancelPaidui',
        method: 'get',
        params
    })
}

// 设置诊室-排队
export function TriagPaidui(params) {
    return request({
        url: '/Triag/Paidui',
        method: 'get',
        params
    })
}

// 设置诊室-重新排队
export function TriagResetPaidui(params) {
    return request({
        url: '/Triag/RePaidui',
        method: 'get',
        params
    })
}

// 导诊控制台
export function TriagStatic(params) {
    return request({
        url: '/Triag/TriagStatic',
        method: 'get',
        params
    })
}
// 导诊控制台 - 新
export function TriagQueueStatic(params) {
    return request({
        url: '/Triag/TriagQueueStatic',
        method: 'get',
        params
    })
}
// 导诊控制台 - 设定人数
export function UpdateTriagQueuePersonmin(params) {
    return request({
        url: '/DicTriag/UpdateTriagQueuePersonmin',
        method: 'get',
        params
    })
}

// 导诊控制台
export function TriagBigScreen(params) {
    return request({
        url: '/Triag/BigScreen',
        method: 'get',
        params
    })
}

// 叫号获取数据
export function TriagRoomDetail(params) {
    return request({
        url: '/DicTriag/TriagRoomDetail',
        method: 'get',
        params
    })
}

// 叫号获取数据
export function SmallScreen(params) {
    return request({
        url: '/Triag/SmallScreen',
        method: 'get',
        params
    })
}