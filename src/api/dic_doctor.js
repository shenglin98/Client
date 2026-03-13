import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/dic_doctor/Load',
    method: 'get',
    params
  })
}



export function add(data) {
  console.log(data)
  return request({
    url: '/dic_doctor/Add',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/dic_doctor/Update',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/dic_doctor/Delete',
    method: 'post',
    data
  })
}

