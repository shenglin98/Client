import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/SysConfig/HelpLoad',
    method: 'get',
    params
  })
}
