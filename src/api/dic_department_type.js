import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/dic_department_type/Load',
    method: 'get',
    params
  })
}



export function add(data) {
  console.log(data)
  return request({
    url: '/dic_department_type/Add',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/dic_department_type/Update',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/dic_department_type/Delete',
    method: 'post',
    data
  })
}

