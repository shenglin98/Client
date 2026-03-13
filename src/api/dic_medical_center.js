import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/Dic_medical_center/Load',
    method: 'get',
    params
  })
}



export function add(data) {
  console.log(data)
  return request({
    url: '/Dic_medical_center/Add',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/Dic_medical_center/Update',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/Dic_medical_center/Delete',
    method: 'post',
    data
  })
}

