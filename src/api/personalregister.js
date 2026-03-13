import request from '@/utils/request'
// method: 'post',
// 系统配置获取系统配置
export function getSysConfig(params) {
    return request({
        url: '/SysConfig/Load',
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

// 获取职业病用户数据
export function getPersonalRegisterList2(data) {
    return request({
        url: '/CustomerRegisterOccupation/Load',
        method: "post",
        data
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
export function setSubmitNew(data) {
    return request({
        url: '/CustomerRegisterNew/Save',
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

// 获取人员明细列表
export function CombineAndChooseList(params) {
    return request({
        url: '/CompanyRegister/CombineAndChooseList',
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

// 打印状态获取
export function CardDetailDetail(params) {
    return request({
        url: '/CustomerCardDetail/Detail',
        method: "get",
        params
    })
}

// 复检状态
export function CustomerRegisterVisit(data) {
    return request({
        url: '/CustomerRegister/Visit',
        method: "post",
        data
    })
}

// 专项检查
export function CustomerRegisterSpecial(data) {
    return request({
        url: '/CustomerRegister/Special',
        method: "post",
        data
    })
}

// 打印状态获取
export function NoPasswordDetail(params) {
    return request({
        url: '/CustomerCardDetail/NoPasswordDetail',
        method: "get",
        params
    })
}

// 打印状态获取
export function MoreCost(data) {
    return request({
        url: '/CustomerRegister/MoreCost',
        method: "post",
        data
    })
}

// 读卡保存头像
export function SaveHeadImage(data) {
    return request({
        url: '/CustomerRegister/SaveHeadImage',
        method: "post",
        data
    })
}

// 获取档案图片
export function ArchivesImages(params) {
    return request({
        url: '/TotalCheck/ArchivesImages',
        method: "get",
        params
    })
}
// 保存档案图片
export function SaveArchivesImages(data) {
    return request({
        url: '/TotalCheck/SaveArchivesImages',
        method: "post",
        data
    })
}
// 删除档案图片
export function DeleteArchivesImages(data) {
    return request({
        url: '/TotalCheck/DeleteArchivesImages',
        method: "post",
        data
    })
}


// 文件上传
export function ImportImage(data) {
    return request({
        url: '/Files/ImportImage',
        method: 'post',
        data
    })
}


// 退费标记
export function RefundSymbol(params) {
    return request({
        url: '/CustomerRegister/RefundSymbol',
        method: 'get',
        params
    })
}
// 是否需要纸质报告
export function PaperReport(data) {
    return request({
        url: '/CustomerRegister/PaperReport',
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

// 
export function WriteLog4(params) {
    return request({
        url: '/SysConfig/WriteLog4',
        method: 'get',
        params
    })
}

// 
export function CheckCompanySeqno(params) {
    return request({
        url: '/CompanyRegister/CheckCompanySeqno',
        method: 'get',
        params
    })
}


export function SendCostToHis(params) {
    return request({
        url: '/CustomerRegister/SendCostToHis',
        method: 'get',
        params
    })
}


export function LastProcess(params) {
    return request({
        url: '/CustomerRegister/LastProcess',
        method: 'get',
        params
    })
}


export function CopyCombine(params) {
    return request({
        url: '/CustomerRegister/CopyCombine',
        method: 'get',
        params
    })
}

export function SendCostApply(params) {
    return request({
        url: '/CustomerRegister/SendCostApply',
        method: 'get',
        params
    })
}
export function RuleCombineList(params) {
    return request({
        url: '/CustomerRegisterNew/RuleCombineList',
        method: 'get',
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
export function HealthCheckForH5(data) {
    return request({
        url: '/HealthCheckForH5/Post',
        method: 'post',
        data
    })
}
// 列表数据查询
export function CheckChooseRule(data) {
    return request({
        url: '/CustomerRegisterNew/CheckChooseRule',
        method: 'post',
        data
    })
}
// 校验自选项目是否完成
export function CheckPreSaveChooseRule(data) {
    return request({
        url: '/CustomerRegisterNew/CheckPreSaveChooseRule',
        method: 'post',
        data
    })
}

// ==================== 职业病信息相关接口 ====================

// 获取职业病详细信息
export function GetOccupationOther(params) {
    return request({
        url: '/CustomerRegisterNew/OccupationOther',
        method: 'get',
        params
    })
}

// 保存职业病信息
export function SaveOccupation(data) {
    return request({
        url: '/CustomerRegisterNew/SaveOccupation',
        method: 'post',
        data
    })
}