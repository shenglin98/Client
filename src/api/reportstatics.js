import request from '@/utils/request'

export function LoadSearchInfo() {
    return request({
        url: '/ReportStatics/LoadSearchInfo',
        method: 'get',
    })
}

export function SaveMoreSearch(data) {
    return request({
        url: '/ReportStatics/SaveMoreSearch',
        method: 'post',
        data
    })
}


export function ReportStatics(data) {
    return request({
        url: '/PrintReport/ReportStatics',
        method: 'post',
        data
    })
}
export function SearchLoad() {
    return request({
        url: '/ReportStatics/SearchLoad',
        method: 'post',
    })
}

export function CompanyPrintOrderLoadSearchInfo(params) {
    return request({
        url: '/CompanyPrintOrder/LoadSearchInfo',
        method: 'get',
        params: params
    })
}

export function SearchDetail(params) {
    return request({
        url: '/ReportStatics/SearchDetail',
        method: 'get',
        params: params
    })
}

export function SearchDelete(data) {
    return request({
        url: '/ReportStatics/SearchDelete',
        method: 'post',
        data
    })
}
export function ReportTable(data) {
    return request({
        url: '/ReportStatics/ReportTable',
        method: 'post',
        data
    })
}
export function ExportReportData(data) {
    return request({
        url: '/FileExport/ExportReportData',
        method: 'post',
        data
    })
}