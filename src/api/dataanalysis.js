import request from '@/utils/request'

// 结论词列表
export function getConclusionsList(params) {
    return request({
        url: '/DicConclusion/LoadConclusions',
        params
    })
}

// 结论词列表
export function getConCludingWordList(params) {
    return request({
        url: '/DicConclusion/LoadConclusions',
        params
    })
}

export function getDictionaryDicLoad(params) {
    return request({
        url: '/dictionary/DicLoad',
        params
    })
}

// 项目字典
export function getItemDictionaryList(params) {
    return request({
        url: '/DicItem/Load',
        params
    })
}



// 体检调查问卷之病史
export function medicalHistory(params) {
    return request({
        url: '/CustomerRegister/MedicalHistory',
        method: 'get',
        params
    })
}
// /DataAnalyseStatics/DataStatics
// 保存
export function dataStatics(data) {
    return request({
        url: '/DataAnalyseStatics/DataStatics',
        method: 'post',
        data
    })
}

// 符号
export function getPublicConfig(params) {
    return request({
        url: '/SysConfig/GetPublicConfig',
        method: 'get',
        params
    })
}