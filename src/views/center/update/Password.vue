<template>
  <modal>
    <div slot="header">
      <span class="fl">更换密码</span>
      <span class="fr cursor" @click="close"><i class="el-icon-close"></i></span>
    </div> 
    <div class="" slot="body" v-if= "showInfo"> <!--  showInfo -->
      <el-form status-icon :model="ruleForm" :rules="rules"  ref="ruleForm"  label-width="80px" label-position ="left">
        <el-form-item label="手机号" prop="contact">
          <el-input v-model="ruleForm.contact" placeholder="请输入手机号" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="captcha">
          <el-input class="captcha" v-model="ruleForm.captcha" placeholder="请输入6位验证码"></el-input>
          <!-- <button class="code-btn">发送验证码</button> -->
         <captcha @click.native="getCaptcha" :countDown="countDown" @stop="stop"></captcha>
        </el-form-item>
        <el-button type="primary"  class="info-btn" :disabled="isDisabled" :loading="loading" @click="goToConfirmPassword('ruleForm')">下一步</el-button>
      </el-form>
    </div>
    <div class="" slot="body" v-else>
    <el-form status-icon :model="ruleForm1" :rules="rules1"  ref="ruleForm1"  label-width="80px" label-position ="left">
       <el-form-item label="密码" prop="password">
        <el-input  type="password" v-model="ruleForm1.password" placeholder="请输入不少于8位的密码" auto-complete="off"></el-input>
        </el-form-item>
       <el-form-item label="确认密码" prop="confirmPassword">
        <el-input type="password" v-model="ruleForm1.confirmPassword" placeholder="请确认密码" auto-complete="off"></el-input>
      </el-form-item>
        <el-button type="primary" class="info-btn" :disabled="isDisabled" :loading="loading" @click="submitForm('ruleForm1')">完成</el-button>
    </el-form>
  </div>
  </modal>
</template>
<script>
  // import formBase from './formBase'
  import Modal from 'components/Modal'
  import  Captcha from 'components/Captcha'
  import {getCaptcha} from 'api/user'
  import {updatePassword,checkSMSCode} from 'api/user'
  import {setPassMd5} from 'utils/help'

  export default {
    props:{
      INFO: Object
    },
    data () {
      var validatePass0 = (rule, value, callback) => {
        if(value !== "" && value !== this.INFO.login_name) {
          callback(new Error('手机号码输入不正确'));
        }else if (value==='') {
            callback(new Error('请输入手机号码'));
        }else{
          callback()
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (value.length < 8) {
          callback(new Error('请输入不少于8位的密码'));
        } else {
          // if (this.ruleForm1.confirmPassword !== '') {
          //   this.$refs.ruleForm1.validateField('confirmPassword');
          // }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm1.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var validatePass3 = (rule, value, callback) => {
          if (value==='') {
            callback(new Error('请输入验证码'))
          }else if(this.wrongCaptha){
            callback(new Error('验证码错误'))
          }else{
            callback()
          }
        // this.$refs.ruleForm.validateField('contact' ,message => {
        //   if (message==='请输入手机号码') {
        //     callback(new Error('请先输入手机号码'));
        //   }else if (message==='手机号码输入不正确') {
        //     callback(new Error(message));
        //   }else if (this.test == "验证码错误") {
        //     callback(new Error('验证码不正确，请重新输入'))
        //   }else if (value==='') {
        //     callback(new Error('请输入验证码'));
        //   }else {
        //     callback();
        //   }
        // })
      };
      var validatePass4 = (rule, value, callback) => {
        if (this.wrongTel) {
          callback(new Error('手机号不正确'));
        } else if (value === "") {
          callback(new Error('请输入手机号码'));
        } else if(!/^1(3|4|5|6|7|8)\d{9}$/.test(value)){
            callback(new Error('手机号码输入不正确'));
        }else {
          callback();
        }
      };
      return {
        countDown:false,
        showInfo:true,
        flag:true,
        loading:false,
        isDisabled: false,
        // isTrue: false,  // 更改手机号验证码错误
        // showPassword:false
          ruleForm: {
            contact: '',
            captcha: ''
          },
          ruleForm1: {
            password: '',
            confirmPassword: '',
          },
          rules: {
            contact: [
              // { required: true,validator: validatePass0, trigger: 'blur' },
              // { pattern: /^1[345678]\d{9}$/, message: '手机号码输入不正确',trigger: 'blur'}
              { required: true, validator: validatePass4, trigger: 'blur' },

            ],
            captcha: [
              { required: true,validator: validatePass3, trigger: 'blur' }
            ]
          },
          rules1: {
            password: [
              { required: true,validator: validatePass, trigger: 'blur' }
            ],
            confirmPassword: [
              { required: true, validator: validatePass2, trigger: 'blur' }
            ]
          }
        }
    },
    methods: {
      stop (flag) {
        this.countDown = false
        this.flag = flag
      },
      getCaptcha () {
        this.wrongTel = false
         this.$refs.ruleForm.validateField('contact' ,message => {
          if(!message) {
              if(this.flag){
              this.flag = false;
              this.countDown = false;
              //在这里post短信验证码，data mobileNumber
              let data = this.ruleForm.contact  //手机号
              console.log('tel', data)
              getCaptcha(data).then((res)=>{
                console.log('pas res===', res)
                // console.log("更改密码验证码请求", res)
                if(res.data.code === 'ok'&& res.data.data){
                  // 证实后台已经发送验证码 开始倒计时
                  this.countDown = true
                }
                else if(res.data.code === 'bad request' && res.data.message == "手机号不正确"){
                  this.countDown = false;
                  this.flag = true;
                  this.wrongTel = true
                  this.$refs.ruleForm.validateField('contact' ,message => {

                  })
                }
                else{
                  this.countDown = false;
                  this.flag = true;
                  this.$message({
                    message: '系统维护请稍后尝试',
                    type: 'error',
                    duration: 3 * 1000
                  });
                }
              })
            }
          }
         })
        // this.$refs.ruleForm.validateField('captcha' ,message => {
        //   // 说明有错误字段
        //   if(message ==='请输入验证码'){
        //     if(this.flag){
        //       this.flag = false;
        //       this.countDown = false;
        //       //在这里post短信验证码，data mobileNumber
        //       let data = this.ruleForm.contact  //手机号
        //       getCaptcha(data).then((res)=>{
        //         console.log('pas res===', res)
        //         // console.log("更改密码验证码请求", res)
        //         if(res.data.code === 'ok'&& res.data.data){
        //           // 证实后台已经发送验证码 开始倒计时
        //           this.countDown = true
        //         }
        //         else if(res.data.code === 'bad request' && res.data.message == "手机号不正确"){
        //           this.countDown = false;
        //           this.flag = true;
        //           // this.$message({
        //           //   message: "手机号不正确",
        //           //   type: 'error',
        //           //   duration: 3 * 1000
        //           // });
        //           this.wrongTel = true
        //           this.$refs.ruleForm.validateField('contact' ,message => {

        //           })
        //         }
        //         else{
        //           this.countDown = false;
        //           this.flag = true;
        //           this.$message({
        //             message: '系统维护请稍后尝试',
        //             type: 'error',
        //             duration: 3 * 1000
        //           });
        //         }
        //       })
        //     }
        //   }
        // })
      },
      goToConfirmPassword(formName) {
        this.wrongCaptha = false
        this.$refs[formName].validate((valid) => {
          if(valid) {
          this.loading = true
          this.isDisabled = true
          let data = "phoneNumber="+this.ruleForm.contact+"&verCode="+this.ruleForm.captcha;
            checkSMSCode(data).then((res) => {   // 验证手机号验证码是否正确请求
              if(res.data.data && res.data.code=== "ok"){   //验证码正确
                this.showInfo = false;
                this.$refs[formName].resetFields();
              } else {  // 验证码错误
                this.wrongCaptha = true
                this.$refs.ruleForm.validateField('captcha' ,message => {
                  })
              }
              this.isDisabled = false
              this.loading = false
            }).catch(()=>{
              this.isDisabled = false
              this.loading = false
            })
          }
        })
      },
      close () {
        this.$emit('close')
        this.countDown = false
        this.$refs.ruleForm.resetFields();
        this.flag = true;
      },
      submitForm(formName) {
        // this.$router.push({ path: '/create-project/index' })
        this.$refs.ruleForm1.validate((valid) => {
          if (valid) {
        console.log('for', formName)
            this.loading = true
            this.isDisabled = true
            //md5密码加密
            // let newForm = Object.assign({}, this.ruleForm1)
            let init = setPassMd5(['password','confirmPassword'], this.ruleForm1)
            console.log('init', init)
            // 后台需要的字段
            let data = "password=" +init.password+"&confirmPassword="+init.confirmPassword+"&id="+this.INFO.id;
            // let data = "password=" +this.ruleForm1.password+"&confirmPassword="+this.ruleForm1.confirmPassword+"&id="+this.INFO.id;
            updatePassword(data).then((res) =>{
              // 重新获取一遍用户数据 
               console.log('更改数据密码',res.data.data)
              if(res.data.code === 'ok'){
                // 通知父组件更改localstorage
                this.countDown = false;
                this.$emit("change_INFO",res.data.data)
                this.loading = false;
                this.isDisabled = false
                this.close();
              }else{
                this.loading = false
                this.isDisabled = false
              }
            }).catch(() =>{
              this.loading = false
              this.isDisabled = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    components:{
     Modal,
     Captcha
    }
  }
</script>
<style scoped lang="stylus">
@import "~common/stylus/modal"
</style>