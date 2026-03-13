import request from '@/utils/request'

// 获取
export function Load(data) {
  return request({
    url: '/CustomerRegisterMouth/Load',
    method: 'post',
    data
  })
}

// 明细
export function Detail(params) {
  return request({
    url: '/CustomerRegisterMouth/Detail',
    method: 'get',
    params
  })
}
// 保存
export function Save(data) {
  return request({
    url: '/CustomerRegisterMouth/Save',
    method: 'post',
    data
  })
}

