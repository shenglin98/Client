import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/dictionary/DicLoad',
    method: 'get',
    params
  })
}

export function loadForRole(roleId) {
  return request({
    url: '/dictionary/loadForRole',
    method: 'get',
    params: { appId: '', firstId: roleId }
  })
}

export function add(data) {
  return request({
    url: '/dictionary/add',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/dictionary/update',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/dictionary/delete',
    method: 'post',
    data
  })
}

export function detailsLoad(params) {
  return request({
    url: '/dictionary/detailsLoad',
    method: 'get',
    params
  })
}

// dictionaryTypes
export function addType(data) {
  return request({
    url: '/DictionariesTypes/Add',
    method: 'post',
    data
  })
}

export function updateType(data) {
  return request({
    url: '/DictionariesTypes/Update',
    method: 'post',
    data
  })
}

export function delType(data) {
  return request({
    url: '/DictionariesTypes/Delete',
    method: 'post',
    data
  })
}

export function loadType(params) {
  return request({
    url: '/DictionariesTypes/Load',
    method: 'get',
    params
  })
}
