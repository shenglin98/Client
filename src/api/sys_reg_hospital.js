import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/Sys_reg_hospital/Load',
    method: 'get',
    params
  })
}



export function add(data) {
  console.log(data)
  return request({
    url: '/Sys_reg_hospital/Add',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/Sys_reg_hospital/Update',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/Sys_reg_hospital/Delete',
    method: 'post',
    data
  })
}

