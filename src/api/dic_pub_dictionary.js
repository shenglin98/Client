import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/dic_pub_dictionary/Load',
    method: 'get',
    params
  })
}



export function add(data) {
  console.log(data)
  return request({
    url: '/dic_pub_dictionary/Add',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/dic_pub_dictionary/Update',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/dic_pub_dictionary/Delete',
    method: 'post',
    data
  })
}

