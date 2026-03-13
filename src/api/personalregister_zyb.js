import request from '@/utils/request'
// method: 'post',
// 系统配置获取系统配置
export function getSysConfig(params) {
    return request({
        url: '/SysConfig/Load',
        params
    })
}

// 获取职业病评价字典
export function Load_Dic_evaluate_word(params) {
    return request({
        url: 'DicOccupation/Load',
        method: "get",
        params
    })
}

export function getPersonalRegisterList(data) {
    return request({
        url: '/CustomerRegister/Load',
        method: "post",
        data
    })
}

// 职业病总检 签入签出
export function CheckIn(params) {
    return request({
        url: '/OccupationalDisease/CheckIn',
        method: "get",
        params
    })
}
// 获取职业病用户数据
export function getPersonalRegisterList2(data) {
    return request({
        url: '/CustomerRegisterOccupation/Load',
        method: "post",
        data
    })
}
// 职业病 获取职业危害 组合
export function GetDicCombineLoad(params) {
    return request({
        url: '/DicCombine/Load',
        params
    })
}

// 获取疾病列表
export function GetdiseaseLoad(params) {
    return request({
        url: '/DicIllness/Load',
        params
    })
}

// 获取体检总检信息
export function GetGeneralInspectionDetail(data) {
    return request({
        url: '/TotalCheckOccupational/Detail',
        method: "post",
        data
    })
}
// 获取职业病危害因素  根据登记时返回相同
export function GetRegisterHarm(params) {
    return request({
        url: '/OccupationalDisease/GetRegisterHarm',
        params,
    })
}
// 获取职业病危害因素
export function GetHazards(params) {
    return request({
        url: '/DicOccupation/Load?tablename=Dic_occupation_harm',
        params
    })
}

// 获取组合字典
export function GetCombination(params) {
    return request({
        url: '/DicCombine/Load?page=1&limit=100000',
        params
    })
}
// 获取复查建议字典
export function GetTheRecommendations(params) {
    return request({
        url: '/OccupationalDisease/Load?type=6',
        params
    })
}

// 获取职业建议字典
export function GetdictionaryAll(params) {
    return request({
        url: '/OccupationalDisease/Load',
        params
    })
}

// 保存
export function GetGeneralInspectionSave(data) {
    return request({
        url: '/TotalCheckOccupational/Save',
        method: "post",
        data
    })
}
export function getPersonalDetail(params) {
    return request({
        url: '/CustomerRegister/Detail',
        params
    })
}
export function getPersonalOccupationDetail(params) {
    return request({
        url: '/CustomerRegisterOccupation/Detail',
        params
    })
}
export function setSubmit(data) {
    return request({
        url: '/CustomerRegister/Save',
        method: "post",
        data
    })
}
export function getBatchOrGroup(params) {
    return request({
        url: '/CompanyPrintOrder/LoadSearchInfo',
        params
    })
}
export function setDelete(data) {
    return request({
        url: '/CustomerRegister/Delete',
        method: "post",
        data
    })
}
export function getCostDetail(params) {
    return request({
        url: '/CustomerRegister/CostDetail',
        params
    })
}
// 单位预约-组合套餐
export function getSetMeal(params) {
    return request({
        url: '/CompanyRegister/LoadSetmealAndCombine',
        params
    })
}
// 文件导出
export function getFiles(params) {
    return request({
        url: '/Files/GetFile',
        params
    })
}

// 文件上传
export function setFiles64(data) {
    return request({
        url: '/Files/ImportImage',
        method: "post",
        data
    })
}

// 身份证、姓名、性别获取历史信息
export function getRegisterInfo(data) {
    return request({
        url: '/CustomerRegister/GetCustomerRegisterInfo',
        method: "post",
        data
    })
}
// 身份证、姓名、性别获取  门诊卡  patId
export function GetPatientInfo(params) {
    return request({
        url: '/CustomerRegister/GetPatientInfo',
        params
    })
}
// 身份证、姓名、性别获取  门诊卡  patId
export function GetPatientInfo_zyb(params) {
    return request({
        url: '/OccupationalDisease/GetPatientInfo',
        params
    })
}
// 体检推荐
export function getRecommend(data) {
    return request({
        url: '/CustomerRegister/Recommend',
        method: "post",
        data
    })
}

// 收费确认
export function setChargeConfirm(data) {
    return request({
        url: '/CustomerRegister/Cost',
        method: "post",
        data
    })
}

// 收费取消
export function setChargeCancel(data) {
    return request({
        url: '/CustomerRegister/CancelCost',
        method: "post",
        data
    })
}

// 组合折扣
export function setDiscount(data) {
    return request({
        url: '/CustomerRegister/Discount',
        method: "post",
        data
    })
}

// 获取人员明细列表
export function getDetailedList(params) {
    return request({
        url: '/CompanyRegister/CombineList',
        params
    })
}

// /api/CustomerRegister/GetPatientInfo
export function getPatientInfo(params) {
    return request({
        url: '/CustomerRegister/GetPatientInfo',
        params
    })
}
export function setUpdatePatientInfo(data) {
    return request({
        url: '/CustomerRegister/UpdatePatientInfo',
        method: "post",
        data
    })
}

export function setImportImage(data) {
    return request({
        url: '/Files/ImportImage',
        method: "post",
        data
    })
}

export function getPublicConfig(params) {
    return request({
        url: '/SysConfig/GetPublicConfig',
        params
    })
}
// 今日开单组合
export function getCombineStatic(params) {
    return request({
        url: '/CustomerRegister/CombineStatic',
        params
    })
}
// 今日开单组合
export function getAllUser(params) {
    return request({
        url: '/users/load',
        params
    })
}
// 今日开单组合
export function setCollectChargeInfoForNotSave(data) {
    return request({
        url: '/CustomerRegister/CollectChargeInfoForNotSave',
        method: "post",
        data
    })
}
// 今日开单组合
export function CollectChargeInfoForNotSaveByFix(data) {
    return request({
        url: '/CustomerRegister/CollectChargeInfoForNotSaveByFix',
        method: "post",
        data
    })
}
// 今日开单组合
export function setDeleteCombine(params) {
    return request({
        url: '/CustomerRegister/DeleteCombine',
        params
    })
}
// 获取年龄 生日 身份证
export function getIdCardInfo(params) {
    return request({
        url: '/SysConfig/GetIdCardInfo',
        params
    })
}
// 获取年龄 生日 身份证
export function updateCombine(data) {
    return request({
        url: '/CustomerRegister/UpdateCombine',
        method: "post",
        data
    })
}
// 获取年龄 生日 身份证
export function UpdateCombineQty(params) {
    return request({
        url: '/CustomerRegister/UpdateCombineQty',
        params
    })
}
// 获取年龄 生日 身份证
export function addCombine(data) {
    return request({
        url: '/CustomerRegister/AddCombine',
        method: "post",
        data
    })
}
// 获取年龄 生日 身份证
export function clearCombine(params) {
    return request({
        url: '/CustomerRegister/ClearCombine',
        params
    })
}
// 获取年龄 生日 身份证
export function checkUserAcount(data) {
    return request({
        url: '/Users/CheckUserAcount',
        method: "post",
        data
    })
}
// 获取年龄 生日 身份证
export function deleteRegister(data) {
    return request({
        url: '/CustomerRegister/DeleteRegister',
        method: "post",
        data
    })
}
// 获取年龄 生日 身份证
export function sendCostAgain(params) {
    return request({
        url: '/CustomerRegister/SendCostAgain',
        method: "get",
        params
    })
}

// 发送消息给管理员
export function SysMessagesSendMsg(data) {
    return request({
        url: '/SysMessages/SendMsg',
        method: "post",
        data
    })
}

// 打印状态获取
export function ProcessTrackList(params) {
    return request({
        url: '/CustomerRegister/ProcessTrackList',
        method: "get",
        params
    })
}

// 打印状态获取
export function PacsInfoList(data) {
    return request({
        url: '/CustomerRegister/PacsInfoList',
        method: "post",
        data
    })
}

// 打印状态获取
export function PacsInfoDelete(params) {
    return request({
        url: '/CustomerRegister/PacsInfoDelete',
        method: "get",
        params
    })
}

// 打印状态获取
export function ReplaceCombine(data) {
    return request({
        url: '/CustomerRegister/ReplaceCombine',
        method: "post",
        data
    })
}