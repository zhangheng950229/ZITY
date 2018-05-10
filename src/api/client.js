import http from 'utils/axios'

// 获取user列表 只是注册过的用户 客户审核->待审核
//http://192.168.31.241:8888/marketing/userClient/getUserByStatus
export function fetchUserList(data) {
  return http({
    url: `/userClient/getUserByStatus?${data}&status=0`,
    method: 'post'
  })
}
// http://192.168.31.241:8888/marketing/userClient/getUserWithStatus
// 获取所有状态的客户列表
export function fetchAllUser(data) {
  return http({
    url: `/userClient/getUserWithStatus?status=1,2,3&${data}`,
    method: 'post'
  })
}

// http://192.168.31.241:8888/marketing/userClient/editUser
//data{startTime=2012-10-22 00:00:00  status=0 expiredTime=2012-10-23 00:00:00  id=}
export function userEdit(data) {
  return http({
    url: `/userClient/editUser?${data}`,
    method: 'post',
  })
}

// http://192.168.31.241:8888/marketing/userClient/rejectUser
export function userReject(id) {
  return http({
    url: `/userClient/rejectUser?_userId=${id}`,
    method: 'post'
  })
}



