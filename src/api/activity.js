import http from 'utils/axios'


// 初始化活动 奖品设置的 下拉选项数据
export function initPrizeSet() {
  return http({
    url: `/activityClient/getPrizeCategory`,
    method: 'post',
  })
}
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