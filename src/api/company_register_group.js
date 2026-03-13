import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/Company_register_group/Load',
    method: 'get',
    params
  })
}



export function add(data) {
  console.log(data)
  return request({
    url: '/Company_register_group/Add',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/Company_register_group/Update',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/Company_register_group/Delete',
    method: 'post',
    data
  })
}

