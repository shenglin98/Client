import request from '@/utils/request'

// method: 'post',

// 体检进度
export function getCheckSchedule(data) {
    return request({
        url: '/DecisionSupport/MedicalProgressStatistics',
        method: 'post',
        data
    })
}

// 年度对比
export function getYearCompared(data) {
    return request({
        url: '/DecisionSupport/AnnualComparisonStatistics',
        method: 'post',
        data
    })
}

// 人群年龄分布
export function getCrowdAgeDistributed(data) {
    return request({
        url: '/DecisionSupport/PopulationAgeDistributionStatistics',
        method: 'post',
        data
    })
}

// 月度对比
export function getMonthCompared(data) {
    return request({
        url: '/DecisionSupport/MonthlyContrastStatistics',
        method: 'post',
        data
    })
}

// 类型分布
export function getTypeDistributed(data) {
    return request({
        url: '/DecisionSupport/TypeDistributionStatistics',
        method: 'post',
        data
    })
}

// 收入概况信息（人数统计）
export function getInfoForPerson(data) {
    return request({
        url: '/IncomeStatics/SurveyInfoForPerson',
        method: 'post',
        data
    })
}

// 收入概况信息（收入统计）
export function getInfoForIncome(data) {
    return request({
        url: '/IncomeStatics/SurveyInfoForIncome',
        method: 'post',
        data
    })
}

// 收入概况信息（个人比率统计）
export function getInfoForPersonRate(data) {
    return request({
        url: '/IncomeStatics/SurveyInfoForPersonRate',
        method: 'post',
        data
    })
}

// 收入概况信息（性别统计）
export function getInfoForSexRate(data) {
    return request({
        url: '/IncomeStatics/SurveyInfoForSexRate',
        method: 'post',
        data
    })
}

// 年度对比 
export function getInfoForYearCompare(data) {
    return request({
        url: '/IncomeStatics/SurveyInfoForYearCompare',
        method: 'post',
        data
    })
}

// 月度对比 
export function getInfoForMonthCompare(data) {
    return request({
        url: '/IncomeStatics/SurveyInfoForMonthCompare',
        method: 'post',
        data
    })
}

// 团检费用排行  
export function getInfoForCompanyCostSort(data) {
    return request({
        url: '/IncomeStatics/SurveyInfoForCompanyCostSort',
        method: 'post',
        data
    })
}

// 费用占比（科室比率）  
export function getInfoForDepartRate(data) {
    return request({
        url: '/IncomeStatics/SurveyInfoForDepartRate',
        method: 'post',
        data
    })
}

// 费用占比（费用分布） 
export function getInfoForCostRange(data) {
    return request({
        url: 'IncomeStatics/SurveyInfoForCostRange',
        method: 'post',
        data
    })
}

// 单位体检提醒通知 
export function TatCompanyCheckStaticsForNextCheck(params) {
    return request({
        url: '/TatStatics/TatCompanyCheckStaticsForNextCheck',
        method: 'get',
        params
    })
}

// 个人体检提醒通知 
export function TatPersonCheckStaticsForNextCheck(params) {
    return request({
        url: '/TatStatics/TatPersonCheckStaticsForNextCheck',
        method: 'get',
        params
    })
}

// 数字点击进入分页列表 
export function TatNextCheckList(data) {
    return request({
        url: '/TatStatics/TatNextCheckList',
        method: 'post',
        data
    })
}

// 设置为已通知（post） 
export function SetNotice(data) {
    return request({
        url: '/TatStatics/SetNotice',
        method: 'post',
        data
    })
}