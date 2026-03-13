import request from '@/utils/request'


// 体检调查问卷类型列表
export function questionnaireTitleList(params) {
    return request({
        url: '/CustomerRegister/QuestionnaireTitleList',
        method: 'get',
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

// 体检调查问卷之病史
export function questionnaire(params) {
    return request({
        url: '/CustomerRegister/Questionnaire',
        method: 'get',
        params
    })
}


// 保存体检之病史
export function SaveMedicalHistory(data) {
    return request({
        url: '/CustomerRegister/SaveMedicalHistory',
        method: 'post',
        data
    })
}

// 保存体检之健康问卷
export function SaveQuestionnaire(data) {
    return request({
        url: '/CustomerRegister/SaveQuestionnaire',
        method: 'post',
        data
    })
}

// 删除体检病史或问卷
export function DeteleQuestion(params) {
    return request({
        url: '/CustomerRegister/DeteleQuestion',
        method: 'get',
        params
    })
}