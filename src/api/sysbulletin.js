import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/sysbulletin/load',
    method: 'post',
    data
  })
}


export function detail(params) {
  return request({
    url: '/sysbulletin/detail',
    method: 'get',
    params
  })
}

export function loadForUser(userId) {
  return request({
    url: '/sysbulletin/loadforuser',
    method: 'get',
    params: { userId: userId }
  })
}

export function save(data) {
  return request({
    url: '/sysbulletin/Save',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/sysbulletin/update',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/sysbulletin/delete',
    method: 'post',
    data
  })
}
// 添加用户
export function AssignRoleUsers(data) {
  return request({
    url: '/AccessObjs/AssignRoleUsers',
    method: 'post',
    data
  })
}

