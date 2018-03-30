import request from 'utils/axios'

// http://192.168.31.241:8888/marketing/api/login?_loginName=13029499224&_password=123456&_verCode=888999
export function login(data) {
  return request({
    url: `/api/login?${data}`,
    method: 'post'
    // data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}
// http://192.168.31.241:8888/marketing/api/login?_loginName=13029499224&_password=123456&_verCode=888999
export function getCaptcha(data) {
  return request({
    url: `/api/login/send?phoneNumber=${data}`,
    method: 'post'
    // data
  })
}

//登录忘记密码的验证码
//  http://192.168.111.114:8888/marketing/api/forget/send
export function getCaptchaForget(data) {
  return request({
    url: `/api/forget/send?${data}`,
    method: 'post'
  })
}

// 忘记密码确认密码 http://192.168.111.114:8888/marketing/userClient/modifyPassword
export function surePassword(data) {
  return request({
    url: `/userClient/modifyPassword?${data}`,
    method: 'post',
  })
}

