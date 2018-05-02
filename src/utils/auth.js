import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
// const TokenKey = 'SESSION'

export function getToken() {
  let cookie = Cookies.getJSON(TokenKey)// 直接获取json 格式
  if(!cookie) {
    return false
  }
  return Cookies.getJSON(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function handleCookie(key) {
  let token = getToken()
  if(token) {
    // let obj = JSON.parse(token)
    return token[key]
  }
}