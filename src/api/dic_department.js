import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/Dic_department/Load',
    method: 'get',
    params
  })
}



export function add(data) {
  console.log(data)
  return request({
    url: '/Dic_department/Add',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/Dic_department/Update',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/Dic_department/Delete',
    method: 'post',
    data
  })
}

