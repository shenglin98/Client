import request from '@/utils/request'

// 人体系统字典列表
export function getDicBodySystemList(params) {
    return request({
        url: '/DicBodySystem/Load',
        method: 'get',
        params
    })
}

// 人体系统字典新增或修改
export function getDicBodySystemAddorEdit(data) {
    return request({
        url: '/DicBodySystem/CreateOrUpdate',
        method: 'post',
        data
    })
}

// 人体系统字典删除
export function getDicBodySystemDelete(data) {
    return request({
        url: '/DicBodySystem/Delete',
        method: 'post',
        data
    })
}

// 病史字典列表
export function getDicMedicalHistoryList(params) {
    return request({
        url: '/DicMedicalHistory/Load',
        method: 'get',
        params
    })
}
// 病史字典新增或修改
export function getDicMedicalHistoryAddorEdit(data) {
    return request({
        url: '/DicMedicalHistory/CreateOrUpdate',
        method: 'post',
        data
    })
}

// 病史字典删除
export function getDicMedicalHistoryDelete(data) {
    return request({
        url: '/DicMedicalHistory/Delete',
        method: 'post',
        data
    })
}

// 健康问卷字典列表
export function getDicQuestionnaireList(params) {
    return request({
        url: '/DicQuestionnaire/Load',
        method: 'get',
        params
    })
}

// 健康问卷字典新增或修改
export function getDicQuestionnaireAddorEdit(data) {
    return request({
        url: '/DicQuestionnaire/CreateOrUpdate',
        method: 'post',
        data
    })
}

// 健康问卷字典删除
export function getDicQuestionnaireDelete(data) {
    return request({
        url: '/DicQuestionnaire/Delete',
        method: 'post',
        data
    })
}

// 调查问卷明细字典列表
export function getDicQuestionnaireItemList(params) {
    return request({
        url: '/DicQuestionnaireItem/Load',
        method: 'get',
        params
    })
}

// 调查问卷明细字典新增或修改
export function getDicQuestionnaireItemAddorEdit(data) {
    return request({
        url: '/DicQuestionnaireItem/CreateOrUpdate',
        method: 'post',
        data
    })
}

// 调查问卷明细字典列表
export function getDicQuestionnaireItemDelete(data) {
    return request({
        url: '/DicQuestionnaireItem/Delete',
        method: 'post',
        data
    })
}

// 调查问卷明细选项字典列表
export function getDicOptionList(params) {
    return request({
        url: '/DicQuestionnaireItemOption/Load',
        method: 'get',
        params
    })
}

// 调查问卷明细选项字典新增或修改
export function getDicOptionAddorEdit(data) {
    return request({
        url: '/DicQuestionnaireItemOption/CreateOrUpdate',
        method: 'post',
        data
    })
}

// 调查问卷明细选项字典删除
export function getDicOptionDelete(data) {
    return request({
        url: '/DicQuestionnaireItemOption/Delete',
        method: 'post',
        data
    })
}
// 体检调查问卷之病史
export function getMedicalHistory(params) {
    return request({
        url: '/CustomerRegister/MedicalHistory',
        method: 'get',
        params
    })
}

// 体检调查问卷之病史
export function getQuestionnaire(params) {
    return request({
        url: '/CustomerRegister/Questionnaire',
        method: 'get',
        params
    })
}

// 组合问卷字典 列表
export function questionnaireCombineLoad(params) {
    return request({
        url: '/DicQuestionnaireCombine/Load',
        method: 'get',
        params
    })
}

// 组合问卷字典字典新增或修改
export function questionnaireCombineLoadAddorEdit(data) {
    return request({
        url: '/DicQuestionnaireCombine/CreateOrUpdate',
        method: 'post',
        data
    })
}
// 组合问卷字典删除
export function questionnaireCombineDelete(data) {
    return request({
        url: '/DicQuestionnaireCombine/Delete',
        method: 'post',
        data
    })
}

// 问卷明细三级字典 列表
export function OptionAnswerLoad(params) {
    return request({
        url: '/DicQuestionnaireItemOptionAnswer/Load',
        method: 'get',
        params
    })
}

// 问卷明细三级字典字典新增或修改
export function OptionAnswerAddorEdit(data) {
    return request({
        url: '/DicQuestionnaireItemOptionAnswer/CreateOrUpdate',
        method: 'post',
        data
    })
}
// 问卷明细三级字典删除
export function OptionAnswerDelete(data) {
    return request({
        url: '/DicQuestionnaireItemOptionAnswer/Delete',
        method: 'post',
        data
    })
}
// 组合问卷新增预览功能
export function PreviewQuestionnaireCombine(params) {
    // ?combineid=
    return request({
        url: '/DicQuestionnaireCombine/PreviewQuestionnaireCombine',
        method: 'get',
        params
    })
}