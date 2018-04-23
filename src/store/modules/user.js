import { login, logout } from 'api/login'
import { getToken, setToken, removeToken , handleCookie} from 'utils/auth'
import { stringify } from 'querystring';


// setToken({name:'cui',code:'1',status:'login',roles:['admin'],nick_name: 'zity_123456',})
// let data = {
//         "id": "7317106a-b6f6-4193-81a3-bf5b1b3aa081",
//         "login_name": "18863025806",
//         "mobile_number": "18863025806",
//         "contract_name": "天津支行",
//         "contact_name": "张霄峰",
//         "status": "1",
//         "password": "123456",
//         "start_time": "2018-03-03 14:38:30",
//         "expired_time": "2018-03-14 00:00:00",
//         "authorities": [
//             {
//                 "authority": "AUTHORITY_ADMIN"
//             }
//         ]
//     }
// localStorage.setItem('USER_INFO', JSON.stringify(data))

handleCookie()
const user = {
  state: {
    user: '',
    status: handleCookie('status'),
    // status: 'noRegister',
    code: handleCookie('code'),
    token: getToken(),
    name: handleCookie('name'),
    roles: handleCookie('roles') || [],
    // flag: true,
    info:{},
    userID : handleCookie('id'),
    start_time : handleCookie('start_time'),
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_ID: (state, ID) => {
      state.userID = ID;
    },
    SET_START_TIME : (state, start_time) => {
      state.start_time = start_time
    }
  },

  actions: {
    // setFlag({ commit }, flag) {
    //   commit('SET_FLAG', flag)
    // },
    setRouters({ commit }, role){
      commit('SET_ROLES', role)

    },

    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
          login(userInfo).then(res => {
            console.log('userres', res) 
            let result = res.data
            if(result.code === 'ok') {
              let data = result.data
              // 获取token 如果token 中code的值是1正常，那么
              // 用户登录之后获取status  设置
              console.log("userINfo_store/user.js",data);
              commit('SET_STATUS', 'login')
              commit('SET_CODE', data.status)
              // let  initRole = authorities[0].authority
              let  initRole = data.authorities[0].authority
              let role
              let arr
              if(initRole) {
                role = initRole.split('_')[1].toLowerCase();//测试
                // console.log("role",role)
                arr = [];
                arr.push(role);
                // console.log(arr)
                commit('SET_ROLES',arr);
                // console.log("roles login",arr)
              }
              setToken({id:data.id,nick_name:data.nick_name,name:data.contact_name,code:data.status,status:"login",roles:arr,start_time:data.start_time})
              localStorage.setItem('USER_INFO', JSON.stringify(data));
              commit('SET_TOKEN', {id:data.id,name:data.contact_name,nick_name:data.nick_name,start_time:data.start_time});
              commit('SET_ID',data.id);
              console.log(data.start_time)
              commit('SET_START_TIME',data.start_time);
            } else {
              this.loading = false
            }
            // 数据传到页面中
            resolve(res)
          })
      });
    },
    SignUp({commit,status}){
      commit('SET_STATUS', 'register')
    },

    // // 获取用户信息
    // GetUserInfo({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     getUserInfo(state.token).then(response => {
    //       if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
    //         reject('error')
    //       }
    //       const data = response.data
    //       // commit('SET_ROLES', data.roles)
    //       // commit('SET_NAME', data.name)
    //       commit('SET_AVATAR', data.avatar)
    //       commit('SET_INTRODUCTION', data.introduction)
    //       //处理role 数据格式
    //       let initRole = data.authorities.authority && data.authorities.authority.toLowerCase()
    //       let roleArr = initRole.split('_')
    //       let roles
    //       if(roleArr.length > 1) {
    //         roles = roleArr.slice(-1)
    //       }
    //       commit('SET_ROLES',roles)
    //       commit('SET_NAME', data.name)
    //       resolve(response)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
      })
    }
  }
}

export default user
