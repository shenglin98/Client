import request from '@/utils/request'

export function fileExport(data) {
    return request({
        url: '/FileExport/Export',
        method: 'post',
        data
    })
}