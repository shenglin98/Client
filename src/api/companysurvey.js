import request from '@/utils/request'

// 团检概况统计列表
export function getSurveyTotalLoad(data) {
    return request({
        url: '/CompanySurveyStatics/SurveyTotalLoad',
        method: 'post',
        data
    })
}

// 近期团检人数统计列表
export function getPersonTotalLoad(data) {
    return request({
        url: '/CompanySurveyStatics/PersonTotalLoad',
        method: 'post',
        data
    })
}

// 公司单位列表
export function getCompanyList(params) {
    return request({
        url: '/CustomerRegister/Detail',
        params
    })
} 
// 单位看板详情
export function CustomerRegisterLoad(data) {
    return request({
        url: '/CompanySurveyStatics/CustomerRegisterLoad',
        method: 'post',
        data
    })
} 