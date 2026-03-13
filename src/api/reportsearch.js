import request from '@/utils/request'
// method: 'post',
// 加载查询条件
export function getLoadSearchInfo(params) {
    return request({
        url: '/FullSearch/LoadSearchInfo',
        params
    })
}

// 单位打单加载搜索条件
export function getBatch(params) {
    return request({
        url: '/CompanyPrintOrder/LoadSearchInfo',
        params
    })
}

// 列表数据查询
export function getPageList(data) {
    return request({
        url: '/ReportSearch/Load',
        method: 'post',
        data
    })
}

// 文件导出
export function getExportFile(data) {
    return request({
        url: '/FileExport/Export',
        method: 'post',
        data
    })
}

// 批量装订、发放更新
export function getBatchHandle(data) {
    return request({
        url: '/ReportSearch/BatchHandle',
        method: 'post',
        data
    })
}