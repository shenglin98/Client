import request from '@/utils/request'

export function getList(data) {
    return request({
        url: '/CompanyRegister/Load',
        method: 'post',
        data
    })
}

export function update(data) {
    return request({
        url: '/Company_register/Update',
        method: 'post',
        data
    })
}

export function del(data) {
    return request({
        url: '/Company_register/Delete',
        method: 'post',
        data
    })
}
// 单位预约-组合套餐
export function getSetMeal(params) {
    return request({
        url: '/CompanyRegister/LoadSetmealAndCombine',
        params
    })
}
// 单位预约详情
export function getCompanyDetail(params) {
    return request({
        url: '/CompanyRegister/Detail',
        params
    })
}
// 单位预约新增
export function getCompanyAdd(data) {
    delete data.mainitem.companyitems;
    delete data.mainitem.receptitems;
    return request({
        url: '/CompanyRegister/Add',
        method: 'post',
        data
    })
}


// 文件上传
export function setFilesUpload(data) {
    return request({
        url: '/Files/Upload',
        method: 'post',
        data
    })
}

// 单位预约检查类型
export function getRegisterGroup(params) {
    return request({
        url: '/SysConfig/GetPublicConfig',
        params
    })
}
// 单位编辑保存
export function setGroupUpdate(data) {
    delete data.mainitem.companyitems;
    delete data.mainitem.receptitems;
    return request({
        url: '/CompanyRegister/Update',
        method: 'post',
        data
    })
}


// 单位预约检查类型
export function getCenterDic(params) {
    return request({
        url: '/Dictionary/DicLoad',
        params
    })
}

// 删除文件附件
export function setFilesDelete(data) {
    return request({
        url: '/Files/Delete',
        method: 'post',
        data
    })
}

// 获取单位价格
export function geneCombineDiscount(params) {
    return request({
        url: '/DicSetmeal/GeneCombineDiscount',
        params
    })
}

// 完成单位结算
export function setFinishYes(data) {
    return request({
        url: '/CompanyRegister/SetFinishYes',
        method: 'post',
        data
    })
}

// 取消单位结算
export function SetFinishNo(data) {
    return request({
        url: '/CompanyRegister/SetFinishNo',
        method: 'post',
        data
    })
}

// 获取单位价格
export function CalcCombinePrice(data) {
    return request({
        url: 'CompanyRegister/CalcCombinePrice',
        method: 'post',
        data
    })
}

// 获取单位价格
export function CalcChargePrice(data) {
    return request({
        url: 'CompanyRegister/CalcChargePrice',
        method: 'post',
        data
    })
}

// 获取单位价格
export function SelectDays(params) {
    return request({
        url: '/CompanyRegister/SelectDays',
        method: 'get',
        params
    })
}

// 获取单位价格
export function CompanyRegisterCopy(params) {
    return request({
        url: '/CompanyRegister/Copy',
        method: 'get',
        params
    })
}

// 单位时间段保存模板
export function SysDataTemplateSave(data) {
    return request({
        url: '/SysDataTemplate/Save',
        method: 'post',
        data
    })
}

// 单位时间段保存模板列表
export function SysDataTemplateLoad(params) {
    return request({
        url: '/SysDataTemplate/Load',
        method: 'get',
        params
    })
}

// 单位时间段保存模板详情
export function SysDataTemplateDetail(params) {
    return request({
        url: '/SysDataTemplate/Detail',
        method: 'get',
        params
    })
}

// 单位时间段保存模板删除
export function SysDataTemplateDelete(data) {
    return request({
        url: '/SysDataTemplate/Delete',
        method: 'post',
        data
    })
}

// 单位时间段保存模板删除
export function SameGroupCombinePrice(data) {
    return request({
        url: '/CompanyRegister/SameGroupCombinePrice',
        method: 'post',
        data
    })
}

export function AppointmentCompanyLoad(params) {
    return request({
        url: '/AppointmentStatics/AppointmentCompanyLoad',
        method: 'get',
        params
    })
}