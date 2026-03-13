import request from '@/utils/request'
// method: 'post',

// 加载主体数据
export function CustomerResultExportLoad(data) {
    return request({
        url: '/CustomerResultExport/Load',
        method: 'post',
        data
    })
}

// 导出主体数据
export function CustomerResultExportExport(data) {
    return request({
        url: '/CustomerResultExport/Export',
        method: 'post',
        data
    })
}