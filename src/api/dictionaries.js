import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/dictionaries/load',
    method: 'get',
    params
  })
}

export function loadForRole(roleId) {
  return request({
    url: '/dictionaries/loadForRole',
    method: 'get',
    params: { appId: '', firstId: roleId }
  })
}

export function add(data) {
  return request({
    url: '/dictionaries/add',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/dictionaries/update',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/dictionaries/delete',
    method: 'post',
    data
  })
}

// dictionariesTypes
export function addType(data) {
  return request({
    url: '/dictionariesTypes/Add',
    method: 'post',
    data
  })
}

export function updateType(data) {
  return request({
    url: '/dictionariesTypes/Update',
    method: 'post',
    data
  })
}

export function delType(data) {
  return request({
    url: '/dictionariesTypes/Delete',
    method: 'post',
    data
  })
}

export function loadType(params) {
  return request({
    url: '/dictionariesTypes/Load',
    method: 'get',
    params
  })
}
