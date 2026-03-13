import request from '@/utils/request'
// method: 'post',

// 条码人员列表
export function getCustomerBarcodeList(data) {
    return request({
        url: '/CustomerBarcode/Load',
        method: 'post',
        data
    })
}
export function batchGenerateBarCode(data) {
    return request({
        url: '/CustomerBarcode/BatchGenerateBarCode',
        method: 'post',
        data
    })
}
// 条码明细
export function getCodeDetail(params) {
    return request({
        url: '/CustomerBarcode/Detail',
        params
    })
}

// 条码生成
export function getCodeSave(data) {
    return request({
        url: '/CustomerBarcode/Save',
        method: 'post',
        data
    })
}

// 条码更新
export function getUpdatePrint(data) {
    return request({
        url: '/CustomerBarcode/UpdatePrint',
        method: 'post',
        data
    })
}

// 条码删除
export function getCodeDelete(data) {
    return request({
        url: '/CustomerBarcode/Delete',
        method: 'post',
        data
    })
}

// 条码删除
export function BatchDelete(data) {
    return request({
        url: '/CustomerBarcode/BatchDelete',
        method: 'post',
        data
    })
}


// 文件导出
export function getFiles(params) {
    return request({
        url: '/Files/GetFile',
        params
    })
}

// 文件打印
export function ReportExport(data) {
    return request({
        url: '/PrintReport/ReportExportForBase64',
        method: 'post',
        data
    })
}

// 条码发送申请
export function SendApplyForLis(data) {
    return request({
        url: '/CustomerBarcode/SendApplyForLis',
        method: 'post',
        data
    })
}

// 条码发送申请
export function SaveAll(params) {
    return request({
        url: '/CustomerBarcode/SaveAll',
        method: 'get',
        params
    })
}

// lis条码生成
export function CreateBarcodeForLis(data) {
    return request({
        url: '/CustomerBarcode/CreateBarcodeForLis',
        method: 'post',
        data
    })
}