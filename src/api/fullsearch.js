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
        url: '/FullSearch/Load',
        method: 'post',
        data
    })
}

// 列表数据查询
export function DepartResultSearchLoad(data) {
    return request({
        url: '/DepartResultSearch/Load',
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

// 文件导出-xml
export function getExportExportXml(data) {
    return request({
        url: '/FileExport/ExportXml',
        method: 'post',
        data
    })
}

// 文件打印
export function ReportExport(data) {
    return request({
        url: '/PrintReport/ReportExport',
        method: 'post',
        data
    })
}

// 文件打印
export function DownloadHead(data) {
    return request({
        url: '/Files/DownloadHead',
        method: 'post',
        data
    })
}

// 
export function Delete(data) {
    return request({
        url: '/CustomerRegister/Delete',
        method: 'post',
        data
    })
}
// 
export function SetViewReoprtFlag(data) {
    return request({
        url: '/FullSearch/SetViewReoprtFlag',
        method: 'post',
        data
    })
}
// 
export function FileExportExport(data) {
    return request({
        url: ['index_hzdlyy', 'index_gdgy'].includes(data.page) ? '/FileExport/ExportFlag' : '/FileExport/Export',
        method: 'post',
        data
    })
}