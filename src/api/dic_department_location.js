import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/dic_department_location/Load',
    method: 'get',
    params
  })
}



export function add(data) {
  console.log(data)
  return request({
    url: '/dic_department_location/Add',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/dic_department_location/Update',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/dic_department_location/Delete',
    method: 'post',
    data
  })
}

