import http from 'utils/axios'

// 获取模板数据
export function getTemplates() {
  return http({
    url: `/templateClient/getTemplates`,
    method: 'post',
  })
}

// http://47.93.236.101:8888/marketing/activityClient/updateInfo
export function updateActivity(data) {
  return http({
    url: `/activityClient/updateInfo?${data}`,
    method: 'post',
  })
}
// 创建活动 192.168.31.241:9999/activityClient/createInfo?
export function createActivity(data) {
  return http({
    url: `/activityClient/createInfo?${data}`,
    method: 'post',
  })
}