<template>
<modal>
  <div slot="header">
       <span class="fl">注册</span>
        <span class="fr" @click="close"><i class="el-icon-close"></i></span>
  </div>
  <div class="" slot="body">
    <el-form status-icon :model="ruleForm" :rules="rules"  ref="ruleForm"  label-width="80px" label-position ="left">
      <el-form-item label="企业名称" prop="contractName">
        <el-input 
        v-model.trim="ruleForm.contractName" 
        placeholder="请输入购买合同中的企业名称" 
        auto-complete="off"
        maxlength=20
        ></el-input>
      </el-form-item>
       <el-form-item label="联系人" prop="contactName" >
        <el-input 
        v-model.trim="ruleForm.contactName" 
        placeholder="请输入联系人" 
        auto-complete="off" 
        maxlength=15></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobileNumber">
        <el-input v-model.trim="ruleForm.mobileNumber" placeholder="请输入手机号码" auto-complete="off" maxlength= 11></el-input>
      </el-form-item>
       <el-form-item label="密码" prop="password">
        <el-input  
        type="password" 
        v-model.trim="ruleForm.password" 
        placeholder="请不少于8位密码" 
        auto-complete="off"
        ></el-input>
      </el-form-item>
       <el-form-item label="确认密码" prop="confirmPassword">
        <el-input type="password" v-model.trim="ruleForm.confirmPassword" placeholder="请确认密码" auto-complete="off"></el-input>
      </el-form-item>
       <el-form-item label="验证码" prop="verifyCode">
        <el-input 
        class="captcha" 
        v-model.trim="ruleForm.verifyCode" 
        placeholder="请输入6位验证码" 
        maxlength=6 ></el-input>
        <captcha @click.native="getCaptcha" :countDown="countDown" @stop="stop"></captcha>
        <!-- <button class="code-btn" @click="getCaptcha">发送验证码</button> -->
      </el-form-item>
       <el-form-item class="import-btn">
        <el-button type="primary" :disabled="isDisabled" :loading="loading" class="info-btn" @click="submitForm('ruleForm')">注册</el-button>
      </el-form-item>
    </el-form>
      <div class="skip">已有账号,<span href="" @click="$emit('close','login')">去登录</span></div>
  </div>
  <!-- <div slot="footer"> -->
    <!-- <el-button  class="sign-btn info-btn" type="primary">
        注册
      </el-button>
      <div class="skip">已有账号,<span href="" @click="$emit('close','login')">去登录</span></div> -->
  <!-- </div> -->
</modal>
</template>
<script>
  import Modal from 'components/Modal'
  import  Captcha from 'components/Captcha'
  import { createUser, getCaptcha } from 'api/user'
  import { loginGetCaptcha } from 'api/login'
  import qs from 'qs'
  // import md5 from 'js-md5';
  import {setPassMd5} from 'utils/help'

  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if(value.length < 8) {
          callback(new Error('请输入不少于8位密码'));
        }else {
          if (this.ruleForm.confirmPassword !== '') {
            this.$refs.ruleForm.validateField('confirmPassword');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      // 验证码
      var validatePass3 = (rule, value, callback) => {
        if (value==='') {
          callback(new Error('请输入验证码'))
        }else if(this.wrongCaptha){
          callback(new Error('验证码错误'))
        }else{
          callback()
        }
        // this.$refs.ruleForm.validateField('mobileNumber' ,message => {
        //   if (message) {

        //     callback('');
        //   }
        //   if (message==='请输入手机号码') {
        //     callback(new Error('请先输入手机号码'));
        //   }else if (message==='手机号码输入不正确') {
        //     callback(new Error(''));
        //   }else if (value==='') {
        //     if(this.helpBtn) {
        //       callback(new Error('请输入验证码'))
        //     }
        //     callback(new Error(''))
        //   }else {
        //     callback();
        //   }
        // })
      };
      // 手机号码
      var validatePass4 = (rule, value, callback) => {
        if (this.telHasExist) {
          callback(new Error('号码已存在'));
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
        captchaValue:null,
        isDisabled:false,
        loading:false,
        flag:true,
        ruleForm: {
          contractName: '',
          contactName: '',
          mobileNumber: '',
          password: '',
          confirmPassword: '',
          verifyCode: '',
        },
        rules: {
          contractName: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
          ],
          contactName: [
            { required: true, message: '请输入联系人', trigger: 'blur' },
          ],
          mobileNumber: [
            // { required: true, message: '请输入手机号码', trigger: 'blur' },
            { required: true, validator: validatePass4, trigger: 'blur' },
            // { pattern: /^1[345678]\d{9}$/, message: '手机号码输入不正确',trigger: 'blur' }
          ],
          password: [
            { required: true,validator: validatePass, trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true, validator: validatePass2, trigger: 'blur' }
          ],
          verifyCode: [
            { required: true, validator: validatePass3, trigger: 'blur' },
          ],
        }
      }
    },
    methods:{
      stop (flag) {
        this.countDown = false
        this.flag = flag
      },
      getCaptcha () {
        this.telHasExist = false;
        this.wrongCaptha  = false;
        this.$refs.ruleForm.validateField('mobileNumber' ,message => {
          if(!message){
            if(this.flag){
              this.flag = false
              this.countDown = true
              //在这里post短信验证码，data mobileNumber
              let data = this.ruleForm.mobileNumber
              loginGetCaptcha(data).then((res)=>{
                if(res.data && res.data.code==='ok'){
                  // 证实后台已经发送验证码 开始倒计时
                  this.countDown = true
                }else{
                  this.countDown = false
                  this.$message({
                    message: '请稍后尝试',
                    type: 'error',
                    duration: 2* 1000
                  });
                }
              })
            }
          }
        })
      },
      close () {
        this.$emit('close')
      },
      submitForm(formName) {
        this.telHasExist = false;
        this.wrongCaptha  = false;
        this.countDown = false
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // this.countDown = false
            // console.log('valid', this.$refs[formName].model)
            this.loading = true
            // 按钮禁止，防止重复提交
            this.isDisabled = true
            // let pass1 = md5(this.ruleForm.password)
            // let pass2 = md5(this.ruleForm.confirmPassword)
            // var newObj = Object.assign({}, this.ruleForm);
            // newObj.password = pass1
            // newObj.confirmPassword = pass2
            let init = setPassMd5(['password','confirmPassword'], this.ruleForm)
            let data = qs.stringify(init)
            console.log('data', init)

            // this.$store.dispatch('LoginByUsername', data)
            createUser(data).then((res) => {
              let data = res.data
              let message = res.data.message
              if(data.code === 'ok') {
                // this.$store.dispatch('SignUp')
                this.$notify({
                  title: '成功',
                  message: '注册成功',
                  type: 'success',
                  duration: 2000
                })
                this.close()//这里注意顺序
                // 跳转到创建活动页面
                // 发出事件， 注册成功
                this.$emit('signUpSuccess')
              }else if(message==='验证码错误'){//message===验证码错误
                this.wrongCaptha = true
                this.$refs.ruleForm.validateField('verifyCode' ,message => {
                  if(message==='验证码错误'){
                  }
                })
                // this.$message({
                //   message: '验证码错误',
                //   type: 'error',
                //   duration: 2* 1000
                // });

              }else if(message==='号码已存在'){//message==='号码已存在'
                this.telHasExist = true
                this.$refs.ruleForm.validateField('mobileNumber' ,message => {
                if(message==='号码已存在'){
                }
              })
                // this.$message({
                //   message: '号码已存在',
                //   type: 'error',
                //   duration: 2* 1000
                // });

              }else{
                this.$message({
                  message: '请稍后再试',
                  type: 'error',
                  duration: 2* 1000
                });
              }
            })
            this.isDisabled = false
            this.loading = false
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    components:{
      Modal,
      Captcha
    }
  }
</script>
<style lang="stylus" scoped>
@import "~common/stylus/modal"
.captcha input
  width:100px
</style>