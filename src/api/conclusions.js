import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/DicConclusion/Load',
        method: 'get',
        params
    })
}


export function gettypeDetail(params) {
    return request({
        url: '/DicConclusion/TypeDetail',
        method: 'get',
        params
    })
}

export function getWordDetail(params) {
    return request({
        url: '/DicConclusion/WordDetail',
        method: 'get',
        params
    })
}

export function typesave(data) {
    return request({
        url: '/DicConclusion/TypeSave',
        method: 'post',
        data
    })
}

export function wordsave(data) {
    return request({
        url: '/DicConclusion/WordSave',
        method: 'post',
        data
    })
}

export function typedel(data) {
    return request({
        url: '/DicConclusion/TypeDelete',
        method: 'post',
        data
    })
}

export function worddelete(data) {
    return request({
        url: '/DicConclusion/WordDelete',
        method: 'post',
        data
    })
}

export function getDicItemDetailItem(params) {
    return request({
        url: '/DicItem/Load',
        params
    })
}

export function LoadWordList(data) {
    return request({
        url: '/DicConclusion/LoadWordList',
        method: 'post',
        data
    })
}

export function UsedWordList(params) {
    return request({
        url: '/DicIllness/UsedWordList',
        method: 'get',
        params
    })
}

export function NoUsedWordList(params) {
    return request({
        url: '/DicIllness/NoUsedWordList',
        method: 'get',
        params
    })
}