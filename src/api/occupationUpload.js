import request from '@/utils/request'

export function getOccupationUploadList(data) {
    return request({
        url: '/OccupationUpload/Load',
        method: 'post',
        data
    })
}

export function getUploadStatics(companycode) {
    return request({
        url: '/OccupationUpload/UploadStatics',
        method: 'get',
        params: { companycode }
    })
}

export function uploadCompanyData(companycode) {
    return request({
        url: '/OccupationUpload/UploadCompanyData',
        method: 'get',
        params: { companycode }
    })
}

export function batchUploadPersonData(data) {
    return request({
        url: '/OccupationUpload/BatchUploadCompanyPersonData',
        method: 'post',
        data
    })
}
