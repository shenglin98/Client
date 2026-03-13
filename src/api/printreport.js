import request from '@/utils/request'

// 打印报表
export function printBase64(data) {
    return request({
        url: '/PrintReport/ReportExportForBase64',
        method: "post",
        data
    })
}

// 打印报表-惠州-广药
export function ReportBook(data) {
    return request({
        url: '/PrintReport/ReportBook',
        method: "post",
        data
    })
}

// 获取单位列表
export function printStaticsBase64(data) {
    return request({
        url: ['index_hzdlyy', 'index_gdgy'].includes(data.page) ? '/PrintReport/ReportStaticsForBase64Flag' : '/PrintReport/ReportStaticsForBase64',
        method: "post",
        data
    })
}