import request from '@/utils/request'

// 获取单位列表
export function getCompanyList(params) {
    return request({
        url: '/CompanyArchives/Load',
        params
    })
}
// 获取单位登记列表
export function getRegisterList(params) {
    return request({
        url: '/CompanyRegister/LoadRegister',
        params
    })
}
// 获取人员明细列表
export function getDetailedList(params) {
    return request({
        url: '/CompanyRegister/CombineList',
        params
    })
}
// 获取人员明细列表
export function CombineAndChooseList(params) {
    return request({
        url: '/CompanyRegister/CombineAndChooseList',
        params
    })
}
// 单位登记获取分组人员列表
export function getGroupCustomer(params) {
    return request({
        url: '/CompanyRegister/LoadGroupCustomer',
        params
    })
}
// 获取人员明细列表文件上传
export function getFilesUpload(data) {
    return request({
        url: '/Files/Upload',
        method: 'post',
        data
    })
}
// 获取导入客户数据
export function getCustomerData(params) {
    return request({
        url: '/CustomerRegister/ExportCustomerData',
        params
    })
}
// 获取导入客户数据
export function getCustomerDataAlias(params) {
    return request({
        url: '/FileExport/ExportCustomerData',
        params
    })
}

// 单位登记保存
export function setCompanySubmit(data) {
    return request({
        url: '/CompanyRegister/Save',
        method: 'post',
        data
    })
}
// 模板文件下载
export function getDownLoad(params) {
    return request({
        url: '/FileExport/DownLoad',
        params
    })
}

// 文件删除接口
export function setFilesDelete(data) {
    return request({
        url: '/Files/Delete',
        method: 'post',
        data
    })
}

// 文件检验重复接口
export function getCheckExportRepeat(data) {
    return request({
        url: '/CompanyRegister/CheckExportRepeat',
        method: 'post',
        data
    })
}

// 文件检验重复接口
export function setUploadByZip(params) {
    return request({
        url: '/CompanyRegister/UploadByZip',
        params
    })
}

// 文件检验重复接口
export function saveForNoGroups(data) {
    return request({
        url: '/CompanyRegister/SaveForNoGroups',
        method: 'post',
        data
    })
}

// 文件检验重复接口
export function SameDataRegister(params) {
    return request({
        url: '/Same/SameDataRegister',
        method: 'get',
        params
    })
}