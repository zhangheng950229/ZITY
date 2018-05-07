<template>
  <modal :styleObject="styleObject">
    <!-- <div slot="header"></div> -->
    <div slot="body" class="index-dialog" v-if="showMainPop">
        <span class="close-icon" @click="close">
          <i class="el-icon-close"></i>
        </span>
      <div class="index-tep">
        <div class="index-img">
          <img class="item-img" :src="'/static/images/' + (detail? list.templateCode :list.template_name) + '-scan.jpg' ">
          <img class="arrow" src="/static/images/arrow.jpg ">
        </div>
        <div class="qrcode-wrapper">
          <div class="index-title">活动名称：{{detail ? list.activityName : list.template_label}}</div>
          <div class="qrcode">
            <qrcode
              :value="qrcode.val"
              :options="{ size: 130 }">
            </qrcode>
            <div class="qrcode-text">微信扫一扫体验活动</div>
          </div>
          <div v-if="!hasCreated">
            <el-button  id="create-btn" type="primary" :loading="loading" @click='createProject'>创建活动</el-button>
          </div>
        </div>
        <div v-if="hasCreated" class="url-item">
            <input id="url-input" v-model="qrcode.val">
             <el-tooltip :disabled="disabled" content="链接已复制" placement="bottom">
              <el-button
              type="primary"
              v-clipboard:copy="url"
              v-clipboard:success="onCopy"
              style="height:35px;display:inline-block;width:60px;padding:0">复制</el-button>
            </el-tooltip>
         </div>
      </div>
    </div>
    <div slot="body" v-if="showLoginPop">
      <div class="close-tep"><span>请您先登录</span><span class="fr" @click="close"><i class="el-icon-close"></i></span></div>
    </div>
    <div slot="body" v-if="showCodePop">
      <div class="close-tep"><span>{{codeStr}}</span><span class="fr" @click="close"><i class="el-icon-close"></i></span></div>
    </div>
  </modal>
</template>
<script>
  import Modal from '../Modal'
  import { mapGetters,mapMutations} from 'vuex'
  import Qrcode from '@xkeshi/vue-qrcode';
  import { getToken, setToken} from 'utils/auth'
  import {getUserInfo} from 'api/user'


  export default {
    props:{
      hasCreated:{
        type:Boolean,
        default:false
      },
      currentActivity:{
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data () {
      return {
        //通过设置不同的数据，返回不同的二维码,最好是通过 lottery 的当前模板对象获取网址
        qrcode:{val: "",size: 130},
        disabled:true,
        url:'http://www.ziteng.com',
        styleObject:{
          height:'0',
        },
        showLoginPop:false,
        showMainPop:true,
        showCodePop:false,
        codeStr:'',
        list:[],
        detail:false,
        loading:false
      }
    },
    computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
      ...mapGetters([
        'currentLotteryItem',
        // 'status',
        // 'code',
        // 'start_time',
        'userInfo'
      ])
    },
    methods:{
      ...mapMutations([
        'SignUp',
        'SET_USERINTO'
      ]),
      onCopy: function (e) {
        this.disabled = false
      },
      copyUrl () {
      },
      close () {
        this.$emit('close')
      },
      createProject () {
        // 判断用户是否已经登录，未登录，弹窗提示登录
        // 首页未注册时候
        this.showCodePop = false
        this.showLoginPop = false
        const TokenKey = 'Admin-Token'
        // let userInfo = getToken(TokenKey)
        let userList = this.userInfo
        let {isLogin, status, mobile_number} = userList
          console.log('isLogin', isLogin)
        if(isLogin !== 'login'){ // 没有登陆的状态
          this.showLoginPop = true
          this.showMainPop = false
        }
        if(isLogin=== 'login'){
          // 判断是否是正常状态
          if(status !== '1') {
            let data = `_loginName=${mobile_number}`
            this.loading = true
            getUserInfo(data).then((res) => {
                let result = res.data
                if(result.code === 'ok') {
                  let data = result.data
                  userList = data
                  let {status, start_time} = userList
                  let _ST = start_time;
                  let d = new Date();
                  if(_ST > d) { // 不在用户有效时间内,用户有效期时间没有到
                    this.codeStr = "您未在有效期时间，请联系管理员";
                    this.showCodePop = true;
                    this.showMainPop = false
                  }
                  if(status==='0') {//审核中
                    this.codeStr = '您的账户未经管理员审核，请审核后进行操作'
                    this.showCodePop = true
                    this.showMainPop = false
                  }else if(status==='2'){  // 禁用
                    this.codeStr = '您账户已被禁用，请联系管理员'
                    this.showCodePop = true
                    this.showMainPop = false
                  }else if(status==='3'){  //您的账户未经管理员通过，请联系管理员   // 未通过
                    this.codeStr = '您的账户审核未通过，请尽快联系管理员'
                    this.showCodePop = true
                    this.showMainPop = false
                  } else if(status ==='1'){
                    this.showCodePop = false
                    this.codeStr = '正常'
                    let name = this.currentLotteryItem.template_name
                    let templateNo = this.currentLotteryItem.template_no
                    if(name){
                      this.$router.push({ path: `/create-project/${name}/${templateNo}`,})
                    }
                    this.close()
                  }
                  this.loading = false
                  // 将最新个人数据写到cookie 中 
                  // 更新到vuex 中
                  let obj = Object.assign(data, this.userInfo)
                  setToken(obj)
                  this.SET_USERINTO(obj)
                }else{
                  this.loading = false
                  this.$message({
                    message: '请稍后尝试',
                    type: 'error',
                    duration: 2* 1000
                  });
                }
              }).catch((err) =>{
                  this.loading = false
                  this.$message({
                    message: '请稍后尝试',
                    type: 'error',
                    duration: 2* 1000
                  });
              })
          }else{
                this.codeStr = '正常'
                let name = this.currentLotteryItem.template_name
                let templateNo = this.currentLotteryItem.template_no
                if(name){
                  this.$router.push({ path: `/create-project/${name}/${templateNo}`,})
                }
                this.close()
          }
            // let {status, start_time} = userList
            // let _ST = start_time;
            // let d = new Date();
            // if(_ST > d) { // 不在用户有效时间内,用户有效期时间没有到
            //   this.codeStr = "您未在有效期时间，请联系管理员";
            //   this.showCodePop = true;
            // }
            // if(status==='0') {//审核中
            //   console.log('hh')
            //   this.codeStr = '您的账户未经管理员审核，请审核后进行操作'
            //   this.showCodePop = true
            // }else if(status==='2'){  // 禁用
            //   this.codeStr = '您账户已被禁用，请联系管理员'
            //   this.showCodePop = true
            // }else if(status==='3'){  //您的账户未经管理员通过，请联系管理员   // 未通过
            //   this.codeStr = '您的账户审核未通过，请尽快联系管理员'
            //   this.showCodePop = true
            // } else{
            //   this.showCodePop = false
            //   this.codeStr = '正常'
            //   let name = this.currentLotteryItem.template_name
            //   console.log('nr', status)
            //   let templateNo = this.currentLotteryItem.template_no
            //   if(name){
            //     this.$router.push({ path: `/create-project/${name}/${templateNo}`,})
            //   }
            //   this.close()
            // }
        }
      }
    },
    created () {
      // console.log('uuu', this.currentActivity)
      // console.log('uuu=====', this.currentLotteryItem)
      // 预览已经创建的活动
      if(this.hasCreated){
        this.detail = true
        this.list = this.currentActivity
        this.qrcode.val = this.list.url
      }else{
        this.list = this.currentLotteryItem
        this.qrcode.val = this.list.category_path
      }
      console.log('lis', this.list)
      // console.log('dailog-list',this.list)
      // 拉取用户信息 判断当前的code 代码
      // if(this.code !==1){
      //   // 获取用户信息
      // }
    },
    activated () {
    },
    components:{
      Modal,
      qrcode: Qrcode
    }
  }
</script>
<style lang="stylus" scoped>
.index-header
  height:30px
  line-height:30px
.close-icon
  position :absolute
  right:-10px
  cursor :pointer
  width: 50px;
  text-align: right;
.index-tep
  position :absolute
  top:15px
.index-img
  position:absolute
  top:0
  font-size:12px
  // background:url('/static/images/arrow.jpg') no-repeat 
  .item-img
    width:150px
    height:300px
  .arrow
    position :absolute
    width:46px
    height:46px
    top:127px
    left:150px
    margin: 0 10px
.index-dialog
  height:310px
  position:relative
  // top:-30px
.index-img
  position:absolute
  top:0px
  // left:200px
  font-size:12px
.qrcode-wrapper
  position:absolute
  top:0px
  left:216px
  font-size:12px
.index-title
  margin: 25px 0
.qrcode-img
    width:130px
    height:130px
    display:block
.qrcode-text
  margin: 20px 0 30px
#create-btn
  width:100%
.close-tep
  height:25px
  line-height:35px
#url-input
  border-radius:4px
  font-size:14px
  color:#606266
  width:110px
  -webkit-appearance: none;
  // -webkit-box-sizing: border-box;
  // box-sizing: border-box;
  color: #606266;
  display: inline-block;
  vertical-align:middle
  height: 35px;
  line-height: 35px;
  // outline: 0;
  padding: 0 15px;
  border:1px solid #ccc
  -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
.url-item
  position :absolute
  top: 240px;
  left: 180px;
  width:180px
</style>