import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/DicDataValidation/Load',
    method: 'post',
    data
  })
}

export function detail() {
  return request({
    url: '/DicDataValidation/Detail',
    method: 'get',
  })
}

export function save(data) {
  console.log(data)
  return request({
    url: '/DicDataValidation/Save',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/DicDataValidation/Update',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/DicDataValidation/Delete',
    method: 'post',
    data
  })
}

