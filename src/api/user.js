import http from 'utils/axios'
// 用户注册
//marketing/userClient/createUser 外网口
export function createUser(data) {
  return http({
    url: `/userClient/createUser?${data}`,
    method: 'post',
  })
}


//修改密码手机短信验证码 手机号码
// http://192.168.111.114:9999/api/updatePassword/send
export function getCaptcha(data) {
  return http({
    url: `/api/updatePassword/send?phoneNumber=${data}`,
    method: 'post',
  })
}
// 个人中心 修改联系人 需要对
// /userClient/editUser
export function updateContact(data) {
  return http({
    url: `/userClient/editUser?${data}`,
    method: 'post',
  })
}
// 个人中心 修改手机号码 需要对
// /userClient/updateMobile  线下测试地址
export function updateTel(data) {
  return http({
    url: `/userClient/updateMobile?${data}`,
    method: 'post',
  })
}

// 个人中心 修改登录密码 需要对
// /api/updatePassword/send
export function updatePassword(data) {
  return http({
    url: `/userClient/modifyPassword?${data}`,
    method: 'post',
  })
}


// 个人中心 修改登录密码 需要对
export function checkSMSCode(data) {
  return http({
    url: `/api/checkSMSCode?${data}`,
    method: 'post',
  })
}





//修改手机号手机短信验证码 手机号码
// /api/updateMobile/send
export function phoneGetCaptcha(data) {
  return http({
    url: `/api/updateMobile/send?${data}`,
    method: 'post',
  })
}
