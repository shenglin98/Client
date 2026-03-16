import request from '@/utils/request'

// method: 'post',

// 获取总检结果
export function getTotalCheck(data) {
    return request({
        url: '/TotalCheck/Detail',
        method: 'post',
        data
    })
}

// 保存体检总检结果
export function CheckItemIsComplete(data) {
    return request({
        url: '/TotalCheck/CheckItemIsComplete',
        method: 'post',
        data
    })
}

// 保存体检总检结果
export function setTotalCheckSave(data) {
    return request({
        url: '/TotalCheck/Save',
        method: 'post',
        data
    })
}

// 结论词文件夹列表
export function getLoadFiles(params) {
    return request({
        url: '/DicConclusion/LoadFiles',
        params
    })
}

// 结论词列表
export function getConclusionsList(params) {
    return request({
        url: '/DicConclusion/LoadConclusions',
        params
    })
}

// 个人结论词字典保存
export function setSavePersonWord(data) {
    return request({
        url: '/DicConclusion/SavePersonWord',
        method: 'post',
        data
    })
}

// 个人结论词字典删除
export function setDelPersonWord(data) {
    return request({
        url: '/DicConclusion/DeletePersonWord',
        method: 'post',
        data
    })
}

// 体检总检审核
export function getCheck(data) {
    return request({
        url: '/TotalCheck/Check',
        method: 'post',
        data
    })
}

// 体检总检取消审核
export function setCancelCheck(data) {
    return request({
        url: '/TotalCheck/CancelCheck',
        method: 'post',
        data
    })
}

// 体检总检列表
export function getDepartCheckList(data) {
    return request({
        url: '/TotalCheck/Load',
        method: 'post',
        data
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

// 职业病--所有检查
// export function getAllCheck_zyb(params) {
//     return request({
//         url: '/OccupationalDepartCheck/AllCheck',
//         params
//     })
// }

// 健康档案
export function getPersonArchives(params) {
    return request({
        url: '/DepartCheck/PersonArchives',
        params
    })
}

// 生成对比内容
export function getCompare(params) {
    return request({
        url: '/TotalCheck/Compare',
        params
    })
}

// 根据关键词获取建议
export function getLoadAdvice(data) {
    return request({
        url: '/TotalCheck/LoadAdvice',
        method: 'post',
        data
    })
}

// 根据关键词获取建议
export function setSaveTrack(data) {
    return request({
        url: '/CustomerTrack/SaveTotalTrack',
        method: 'post',
        data
    })
}

// 体检总检追踪列表
export function getLoadTrack(params) {
    return request({
        url: '/CustomerTrack/LoadTotalTrack',
        params
    })
}

// 保存危机提醒、异常信息
export function setSaveIllitems(data) {
    return request({
        url: '/TotalCheck/SaveIll',
        method: 'post',
        data
    })
}

// 重新生成
export function setGenerateAgain(params) {
    return request({
        url: '/TotalCheck/GenerateAgain',
        params
    })
}

// 删除总检
export function setTotalCheckDelete(params) {
    return request({
        url: '/TotalCheck/Delete',
        params
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

// 单位打单个人组合明细
export function setPrintOrderDetail(params) {
    return request({
        url: '/CompanyPrintOrder/Detail',
        method: "get",
        params
    })
}

// 获取组合结论信息
export function getCombineDetail(params) {
    return request({
        url: '/DepartCheck/CombineDetail',
        params
    })
}

// 获取总检结果
export function getTotalCheckQyzyy(data) {
    return request({
        url: '/TotalCheck/Detail',
        method: 'post',
        data
    })
}

// 根据关键词获取建议
export function getLoadAdviceQyzyy(data) {
    return request({
        url: '/TotalCheck/LoadAdviceForQyzyy',
        method: 'post',
        data
    })
}

// 根据关键词获取建议
export function setChangeTotalShowFlag(params) {
    return request({
        url: '/TotalCheck/ChangeTotalShowFlag',
        method: 'get',
        params
    })
}

// 根据关键词获取建议
export function TestTimeOut(params) {
    return request({
        url: 'UsersTest/TestTimeOut',
        method: 'get',
        params
    })
}

export function getPersonalSimpleDetail(params) {
    return request({
        url: '/CustomerRegister/SimpleDetail',
        params
    })
}
export function commonWordsLoad(params) {
    return request({
        url: '/DicCommonDescribe/Load',
        params
    })
}
export function commonWordsCreateOrUpdate(data) {
    return request({
        url: '/DicCommonDescribe/CreateOrUpdate',
        method: 'post',
        data
    })
}
export function commonWordsDelete(data) {
    return request({
        url: '/DicCommonDescribe/Delete',
        method: 'post',
        data
    })
}
export function changeUsedRegid(params) {
    return request({
        url: '/TotalCheck/ChangeUsedRegid',
        params
    })
}
export function ApichangeUsedRegid(params) {
    return request({
        url: '/TotalCheck/ChangeUsedRegid',
        params
    })
}
export function getNextRegid(params) {
    return request({
        url: '/TotalCheck/GetNextRegid',
        params
    })
}
// 批量总检
export function batchSave(data) {
    return request({
        url: '/TotalCheck/BatchSave',
        method: 'post',
        data
    })
}
// 取消批量总检
export function BatchCancel(data) {
    return request({
        url: '/TotalCheck/BatchCancel',
        method: 'post',
        data
    })
}
// 批量总检
export function GenerateAgainConclusionTextSortIndex(data) {
    return request({
        url: '/totalcheck/GenerateAgainConclusionTextSortIndex',
        method: 'post',
        data
    })
}
// 获取复查数据
export function GetReviewGet(params) {
    return request({
        url: '/OccupationalDisease/ReviewGet',
        method: 'get',
        params
    })
}
// 编辑复查数据
export function SetReviewSet(data) {
    return request({
        url: '/OccupationalDisease/ReviewSet',
        method: 'post',
        data
    })
}
// 转诊随访
export function LoadTransfer(data) {
    return request({
        url: '/CustomerTrack/LoadTransfer',
        method: 'post',
        data
    })
}

// 转诊随访
export function LoadTransferDetail(params) {
    return request({
        url: '/CustomerTrack/LoadTransferDetail',
        method: 'get',
        params
    })
}

// 转诊随访
export function TransferHandle(data) {
    return request({
        url: '/CustomerTrack/TransferHandle',
        method: 'post',
        data
    })
}
// 获取占用人
export function UsedRegidList(params) {
    return request({
        url: '/TotalCheck/UsedRegidList',
        method: 'get',
        params
    })
}
//  解除占用人占用
export function FreeRegid(params) {
    return request({
        url: `/TotalCheck/FreeRegid`,
        method: 'get',
        params
    })
}
//  解除占用人占用
export function SendHis(params) {
    return request({
        url: `/CustomerTrack/sendHis`,
        method: 'get',
        params
    })
}
//  新增随访复查人员
export function AddTransfer(data) {
    return request({
        url: `/CustomerTrack/AddTransfer`,
        method: 'post',
        data
    })
}
//  解读接口
export function TotalCheckRead(params) {
    return request({
        url: `/TotalCheck/Read`,
        method: 'get',
        params
    })
}
export function DepartmentDetail(params) {
    return request({
        url: `/DicCombine/Detail`,
        method: 'get',
        params
    })
}

export function DicLoad(params) {
    return request({
        url: '/dictionary/DicLoad',
        method: 'get',
        params
    })
}


// 发起检查是否授权接口
export function CheckAuthorize(params) {
    return request({
        url: `/CAAuthorize/CheckAuthorize`,
        method: 'get',
        params
    })
}

// 发起授权接口
export function StartAuthorize(params) {
    return request({
        url: `/CAAuthorize/StartAuthorize`,
        method: 'get',
        params
    })
}

// 二审详情接口
export function TotalCheck2Detail(params) {
    return request({
        url: `/TotalCheck2/Detail`,
        method: 'get',
        params
    })
}

// ==================== 体检结论模块下拉框接口开始 ====================

// 1. 处理意见列表
export function GetHandleAdviseList(params) {
    return request({
        url: '/DicOccupationTree/GetHandleAdviseList',
        method: 'get',
        params
    })
}

// 2. 危害因素结论列表
export function GetHealthCheckConclusionList(params) {
    return request({
        url: '/DicOccupationTree/GetOccupationTreeList',
        method: 'get',
        params: {
            category: 'HealthCheckConclusion',
            ...params
        }
    })
}

// 3. 疑似职业病列表
export function GetSuspectedOccupationList(params) {
    return request({
        url: '/DicOccupationTree/GetOccupationTreeList',
        method: 'get',
        params: {
            category: 'SuspectedOccupation',
            ...params
        }
    })
}

// 4. 职业禁忌列表
export function GetOccupationTabooList(params) {
    return request({
        url: '/DicOccupationTree/GetOccupationTreeList',
        method: 'get',
        params: {
            category: 'OccupationTaboo',
            ...params
        }
    })
}

// ==================== 体检结论模块下拉框接口结束 ====================

// 批量二审
export function BatchCheck2(data) {
    return request({
        url: '/TotalCheck2/BatchCheck',
        method: 'post',
        data
    })
}

// 取消批量二审
export function BatchCheck2Cancel(data) {
    return request({
        url: '/TotalCheck2/CancelCheck',
        method: 'post',
        data
    })
}

// 发送短信
export function SendSMS(params) {
    return request({
        url: '/FullSearch/SendSMS',
        method: 'get',
        params
    })
}
// 健康档案备注获取
export function GetHealthRemark(params) {
    return request({
        url: '/TotalCheck/GetHealthRemark',
        method: 'get',
        params
    })
}

// 健康档案备注保存
export function SaveHealthRemark(data) {
    return request({
        url: '/TotalCheck/SaveHealthRemark',
        method: 'post',
        data
    })
}

// 健康档案备注保存
export function CombineImage(params) {
    return request({
        url: '/DepartCheck/CombineImage',
        method: 'get',
        params
    })
}
// 健康档案 就诊记录
export function VisitRecord(params) {
    return request({
        url: '/HealthViewStatics/VisitRecord',
        method: 'get',
        params
    })
}
// 是否打印报告书
export function LastProcess(params) {
    return request({
        url: '/CustomerRegister/LastProcess',
        method: 'get',
        params
    })
}

// 是否打印报告书
export function DSTotalCheck(data) {
    return request({
        url: '/DSTotalCheck/Handle',
        method: 'post',
        data
    })
}