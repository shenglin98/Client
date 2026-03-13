import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/ConfiguringPrinters/Load',
    method: 'get',
    params
  })
}

export function addorupdate(data) {
  return request({
    url: '/ConfiguringPrinters/AddorUpdate',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/Files/Delete',
    method: 'post',
    data
  })
}


