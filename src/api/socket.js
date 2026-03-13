import request from '@/utils/request'

export function LoadWebSockets(data) {
  return request({
    url: '/SysStationletter/LoadWebSockets',
    method: 'post',
    data
  })
}
export function CloseWebSockets(data) {
  return request({
    url: '/SysStationletter/CloseWebSockets',
    method: 'post',
    data
  })
}
