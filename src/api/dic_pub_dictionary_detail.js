import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/dic_pub_dictionary_detail/Load',
    method: 'get',
    params
  })
}



export function add(data) {
  console.log(data)
  return request({
    url: '/dic_pub_dictionary_detail/Add',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/dic_pub_dictionary_detail/Update',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/dic_pub_dictionary_detail/Delete',
    method: 'post',
    data
  })
}

