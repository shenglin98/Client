import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/Themroughly/Load',
    method: 'get',
    params
  })
}



export function add(data) {
  console.log(data)
  return request({
    url: '/ThemRoughly/Add',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/ThemRoughly/Update',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/ThemRoughly/Delete',
    method: 'post',
    data
  })
}

