<template>
  <header class="navbar">
    <div class="fl">
        <a href="/login"><img id="background" src="../../../common/images/logo.png"></a>
    </div>
    <div class="fr client-management">
      <span class="client-name"><svg-icon style="color:#1aadf0" :icon-class="iconName.user"></svg-icon><i>{{name}}</i></span>
      <span @click="logOut" class="client-out"><svg-icon style="color:#ccc" :icon-class="iconName.tuichu"></svg-icon><i>退出</i></span>
    </div>
    <!-- <modal v-if="isPublish">
       <div slot="header">
        <span class="fl">提示</span>
        <span class="fr cursor" @click="close"><i class="el-icon-close"></i></span>
      </div>
      <div slot="body">
        <div class="confirm">确定发布吗？</div>
        <div>
           <el-button @click="close">取消</el-button>
           <el-button type="primary" @click="publish" :loading="loading">确定</el-button>
        </div>
      </div>
    </modal> -->
  </header>
  
</template>
<script>
import svgIcon from 'components/Icon'
import { mapGetters } from 'vuex'
import Modal from 'components/Modal'

export default {
  name: 'Navbar',
  data () {
    return {
      iconName:{
        user: 'user',
        tuichu: 'tuichu',
        // isPublish:false,
      },
      name:''
    }
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
      ...mapGetters([
        'token'
      ])
  },
  methods:{
    logOut() {
      
      // this.isPublish = true;
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    }
  },
  created () {
    if(this.token){
      if(typeof this.token === 'string'){
        let obj = JSON.parse(this.token);
        console.log("headbar",obj)
        this.name = obj.nick_name
      }else{
        this.name = this.token.name
      }
    }
  },
  components:{
    svgIcon
  }
}
</script>
<style lang="stylus" scoped>
.navbar
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 80px;
  font-size: 22px;
  line-height: 80px;
  color: #fff;
  padding:0 15px
.client-management i
  color:#000
  font-size:13px
  font-style:normal
  margin-left:5px
.client-management i,.client-management span
  vertical-align:middle
.client-name
  margin-right: 12px
.client-name,.client-out
  cursor :pointer
</style>