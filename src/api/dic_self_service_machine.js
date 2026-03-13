import request from '@/utils/request'

// 获取自助机字典
export function GetData(params) {
  return request({
    url: '/DicSelfService/GetData',
    method: 'GET',
    params
  })
}

// 修改自助机字典
export function UpdataSelfServiceData(data) {
  return request({
    url: '/DicSelfService/UpdataSelfServiceData',
    method: 'POST',
    data
  })
}
