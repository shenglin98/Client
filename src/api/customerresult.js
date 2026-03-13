import request from '@/utils/request'
// method: 'post',
// 获取获取登记信息、叫号 
export function getDepartCheck(data) {
    return request({
        url: '/DepartCheck/Detail',
        method: 'post',
        data
    })
}

// 获取组合结论信息
export function getCombineDetail(params) {
    return request({
        url: '/DepartCheck/CombineDetail',
        params
    })
}

// 获取组合结论信息-听力
export function ListenCombineDetail(params) {
    return request({
        url: '/DepartCheckListen/ListenCombineDetail',
        params
    })
}

// 获取平均值-听力
export function CalcListenAvg(data) {
    return request({
        url: '/DepartCheckListen/CalcListenAvg',
        method: 'post',
        data
    })
}

// 获取历史值-听力
export function ListenHistoryResult(params) {
    return request({
        url: '/DepartCheckListen/HistoryResult',
        params
    })
}

// 客户排队列表 
export function getPersonnelList(data) {
    return request({
        url: '/DepartCheck/Load',
        method: 'post',
        data
    })
}

// 获取检索条件人员列表数据  获取结论词数据
export function getDicConclusion(params) {
    return request({
        url: '/DicConclusion/Load',
        params
    })
}


// 历史结果
export function getHistoryResult(params) {
    return request({
        url: '/DepartCheck/HistoryResult',
        params
    })
}

// 所有检查
export function getAllCheck(params) {
    return request({
        url: '/DepartCheck/AllCheck',
        params
    })
}

// 健康档案
export function getPersonArchives(params) {
    return request({
        url: '/DepartCheck/PersonArchives',
        params
    })
}


// 获取小结
export function getConclusionDetail(data) {
    return request({
        url: '/DepartCheck/ConclusionDetail',
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

// 默认小结
export function getDefaultConclusion(data) {
    return request({
        url: '/DepartCheck/DefaultConclusion',
        method: 'post',
        data
    })
}

// 生成小结
export function getGenerateConclusion(data) {
    return request({
        url: '/DepartCheck/GenerateConclusion',
        method: 'post',
        data
    })
}

// 检查录入保存
export function getSubmitPage(data) {
    return request({
        url: '/DepartCheck/Save',
        method: 'post',
        data
    })
}

// 检查录入保存 - 听力
export function getSubmitPageListenSave(data) {
    return request({
        url: '/DepartCheckListen/ListenSave',
        method: 'post',
        data
    })
}

// 检查录入保存 - 校正数据
export function CalcCorrectValue(data) {
    return request({
        url: '/DepartCheckListen/CalcCorrectValue',
        method: 'post',
        data
    })
}

// 科室检查审核
export function getCheckPage(data) {
    return request({
        url: '/DepartCheck/Check',
        method: 'post',
        data
    })
}

// 科室检查取消审核
export function getCancelCheckPage(data) {
    return request({
        url: '/DepartCheck/CancelCheck',
        method: 'post',
        data
    })
}

// 项目弃检、缓检、恢复
export function getGiveUpCheck(data) {
    return request({
        url: '/SignIn/UpdateCombineFlag',
        method: 'post',
        data
    })
}

// 结论词文件夹列表
export function getAddSpecialis(params) {
    return request({
        url: '/DicConclusion/LoadConclusions',
        params
    })
}

// 结论词个人结论字典保存
export function setSubmitSpecialis(data) {
    return request({
        url: '/DicConclusion/SavePersonWord',
        method: 'post',
        data
    })
}

// 结论词个人结论字典删除
export function setDelSpecialis(data) {
    return request({
        url: '/DicConclusion/DeletePersonWord',
        method: 'post',
        data
    })
}

// 推荐小结、专科建议 
export function getRecommend(data) {
    return request({
        url: '/DepartCheck/Recommend',
        method: 'post',
        data
    })
}

// 结果数据对比 
export function getResultCompare(params) {
    return request({
        url: '/DepartCheck/ResultCompare',
        params
    })
}

// 结果数据对比 
export function setDepartDelete(params) {
    return request({
        url: '/DepartCheck/Delete',
        params
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
// 文件上传
export function setUploadPdfToImage(data) {
    return request({
        url: '/Files/UploadPdfToImage',
        method: 'post',
        data
    })
}
// 弃检
export function setDepartCheckGiveUp(params) {
    return request({
        url: '/DepartCheck/GiveUp',
        method: 'get',
        params
    })
}
// 取消弃检
export function setDepartCheckGiveUpCancel(params) {
    return request({
        url: '/DepartCheck/CancelGiveUp',
        method: 'get',
        params
    })
}
// 延检
export function setDelay(params) {
    return request({
        url: '/DepartCheck/Delay',
        method: 'get',
        params
    })
}
// 取消延检
export function setCancelDelay(params) {
    return request({
        url: '/DepartCheck/CancelDelay',
        method: 'get',
        params
    })
}

// 提取结果
export function setDepartCheckGetResult(data) {
    return request({
        url: '/DepartCheck/GetResult',
        method: 'post',
        data
    })
}

// 提取结果
export function GetResultFlag(data) {
    return request({
        url: '/DepartCheck/GetResultFlag',
        method: 'post',
        data
    })
}

// 提取结果
export function setDepartCheckDeleteLis(data) {
    return request({
        url: '/DepartCheck/DeleteLis',
        method: 'post',
        data
    })
}

// 危急值列表
export function getCustomerResultCriticalList(params) {
    return request({
        url: '/CustomerCritical/GetCustomerResultCriticalList',
        params
    })
}

// 设置录入状态
export function setDepartCheckInputCheck(params) {
    return request({
        url: '/DepartCheck/InputCheck',
        params
    })
}

// 设置录入状态
export function getGiveUpList(params) {
    return request({
        url: '/DepartCheck/GiveUpList',
        params
    })
}

// 我的总检任务列表
export function getMyPlan(data) {
    return request({
        url: '/TotalCheckPlan/Load',
        method: 'post',
        data
    })
}

// 获取所有pacs结果
export function getCombinePacsDetail(params) {
    return request({
        url: '/DepartCheck/CombinePacsDetail',
        method: 'get',
        params
    })
}

// 获取所有pacs结果
export function HistoryAllResultList(params) {
    return request({
        url: '/DepartCheck/HistoryAllResult',
        method: 'get',
        params
    })
}

// 获取所有pacs结果
export function CopyHistoryResult(params) {
    return request({
        url: 'DepartCheck/CopyHistoryResult',
        method: 'get',
        params
    })
}

// 保存病史
export function UpdateMedicalHistoryInfo(data) {
    return request({
        url: '/DepartCheck/UpdateMedicalHistoryInfo',
        method: 'post',
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
        method: "post",
        data
    })
}

// 申请号修改
export function ApplynoSave(data) {
    return request({
        url: '/DepartCheck/ApplynoSave',
        method: "post",
        data
    })
}

// 
export function SplitContent(params) {
    return request({
        url: '/SysConfig/SplitContent',
        method: "get",
        params
    })
}

// 核对确认/取消确认
export function UpdatVerification(params) {
    return request({
        url: '/DepartCheck/UpdatVerification',
        method: "get",
        params
    })
}

// 检查眼科导入文件接口
export function ImportCheckEyeData(params) {
    return request({
        url: '/DepartCheck/ImportCheckEyeData',
        method: "get",
        params
    })
}

// 保存眼科导入文件接口
export function ImportEyeDataSave(params) {
    return request({
        url: '/DepartCheck/ImportEyeDataSave',
        method: "get",
        params
    })
}
// 保存眼科导入文件接口
export function ImportEyeDataSaveForGZWMKFYY(params) {
    return request({
        url: '/DepartCheck/ImportEyeDataSaveForGZWMKFYY',
        method: "get",
        params
    })
}

// 保存眼科导入文件接口
export function ImportCheckHeightData(params) {
    return request({
        url: '/DepartCheck/ImportCheckHeightData',
        method: "get",
        params
    })
}

// 保存眼科导入文件接口
export function ImportHeightDataSave(params) {
    return request({
        url: '/DepartCheck/ImportHeightDataSave',
        method: "get",
        params
    })
}

// 保存眼科导入文件接口
export function AlterFields(data) {
    return request({
        url: '/CustomerRegisterNew/AlterFields',
        method: "post",
        data
    })
}

// 保存眼科导入文件接口
export function MedicalDetailStatusComplete(params) {
    return request({
        url: '/DepartCheck/MedicalDetailStatusComplete',
        method: "get",
        params
    })
}

// 核对确认-图片查询
export function CombineImage(params) {
    return request({
        url: '/DepartCheck/CombineImage',
        method: "get",
        params
    })
}

// 核对确认-图片查询
export function GetCompanyResult(params) {
    return request({
        url: '/DepartCheck/GetCompanyResult',
        method: "get",
        params
    })
}