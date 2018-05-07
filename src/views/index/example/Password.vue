<template>
<modal>
  <div slot="header">
       <span class="fl">忘记密码</span>
        <span class="fr cursor" @click="close"><i class="el-icon-close"></i></span>
  </div>
  <div class="" slot="body" v-if="showInfo">
    <el-form status-icon :model="ruleForm" :rules="rules"  ref="ruleForm"  label-width="80px" label-position ="left">
      <el-form-item label="联系人" prop="contact">
        <el-input 
        v-model="ruleForm.contact" 
        placeholder="请输入联系人" 
        auto-complete="off"
        maxlength=15
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="tel">
        <el-input v-model="ruleForm.tel" placeholder="请输入手机号码" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="captcha">
        <el-input 
        class="captcha" 
        v-model="ruleForm.captcha" 
        placeholder="请输入6位验证码" 
        auto-complete="off"
        maxlength=6
        ></el-input>
        <captcha @click.native="getCaptcha" :countDown="countDown" @stop="stop"></captcha>
        <!-- <button class="code-btn">发送验证码</button> -->
      </el-form-item>
      <!--  <el-form-item label="验证码">
        <el-input v-model="form.captcha" placeholder="请确认验证码"></el-input>
        <button class="code-btn">发送验证码</button>
      </el-form-item> -->
      <el-form-item class="import-btn">
        <el-button type="primary"  class="info-btn" :disabled="isDisabled" :loading="loading" @click="goToConfirmPassword('ruleForm')">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="" slot="body" v-else>
    <el-form status-icon :model="ruleForm1" :rules="rules1"  ref="ruleForm1"  label-width="80px" label-position ="left">
       <el-form-item label="密码" prop="password">
        <el-input  type="password" v-model="ruleForm1.password" placeholder="请输入不少于8位密码" auto-complete="off"></el-input>
        </el-form-item>
       <el-form-item label="确认密码" prop="confirmPassword">
        <el-input type="password" v-model="ruleForm1.confirmPassword" placeholder="请确认密码" auto-complete="off"></el-input>
      </el-form-item>
        <el-button type="primary" class="info-btn" :disabled="isDisabled" :loading="loading" @click="submitForm('ruleForm1')">完成</el-button>
    </el-form>
  </div>
<!--   <div slot="footer" class="next">
    <el-button  class="info-btn" type="primary"  @click="goToConfirmPassword">
        下一步
      </el-button>
  </div> -->
</modal>
</template>
<script>
  // import formBase from './formBase'
  import Modal from 'components/Modal'
  import  Captcha from 'components/Captcha'
  import {getCaptchaForget,surePassword} from 'api/login'
  import {checkSMSCode} from "api/user"
  import {setPassMd5} from 'utils/help'
  import qs from 'qs'

  export default {
    data () {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if(value.length < 8) {
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
      var validatePass1 = (rule, value, callback) => {
        if (value==='') {
            callback(new Error('请输入联系人'))
          }else if(this.wrongContact){
            callback(new Error('联系人姓名不正确'))
          }else{
            callback()
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
        mobileNumber:"",
        // showPassword:false
          ruleForm: {
            tel: '',
            contact: '',
            captcha: '',
          },
          ruleForm1: {
            password: '',
            confirmPassword: '',
          },
          rules: {
            contact: [
              // { required: true, message: '请输入联系人', trigger: 'blur' },
              { required: true, validator: validatePass1, trigger: 'blur' },

            ],
            tel: [
              // { required: true, message: '请输入手机号码', trigger: 'blur' },
              // { pattern: /^1[345678]\d{9}$/, message: '手机号码输入不正确',trigger: 'blur' }
              { required: true, validator: validatePass4, trigger: 'blur' },
            ],
            captcha: [
              { required: true, validator: validatePass3, trigger: 'blur' },
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
        this.wrongContact = false
        this.$refs.ruleForm.validateField('tel' ,message => {
          if(!message) {
              this.$refs.ruleForm.validateField('contact' ,message1 => {
                if(!message1){
                  if(this.flag){
                    this.flag = false
                    this.countDown = false
                    //在这里post短信验证码，data mobileNumber
                    // console.log(this.ruleForm.tel);
                    let data = "phoneNumber=" +this.ruleForm.tel+"&contactName="+this.ruleForm.contact
                    // console.log(data);
                    getCaptchaForget(data).then((res)=>{
                      console.log('yanzheng', res);
                      if(res.data && res.data.code==='ok'){
                        // 证实后台已经发送验证码 开始倒计时
                        this.countDown = true;
                        this.mobileNumber = this.ruleForm.tel;
                      }else if(res.data.code != 'ok' && res.data.message==='手机号不正确'){  // 手机号码不正确
                        this.countDown = false;
                        // this.test = "手机号不正确";
                        // this.message == "手机号不正确";
                        this.flag = true;
                        this.wrongTel = true
                        this.$refs.ruleForm.validateField('tel' ,message1 => {

                        })
                      }
                      else if(res.data.code != 'ok' && res.data.message==='联系人姓名不正确'){
                        // 手机号码不正确
                        this.countDown = false;
                        // this.test = "手机号不正确";
                        // this.message == "手机号不正确";
                        this.flag = true;
                        this.wrongContact = true
                        this.$refs.ruleForm.validateField('contact' ,message2 => {

                        })
                      }
                      else{
                        this.flag = true;
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
          }
        })
      },
      goToConfirmPassword(formName) {
        this.wrongCaptha = false
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // let init = setPassMd5(['tel'], this.ruleForm);
            this.loading = true
            // 按钮禁止，防止重复提交
            this.isDisabled = true
            let init = this.ruleForm
            let data = "phoneNumber=" +init.tel+"&verCode="+init.captcha;
            // let data = "phoneNumber=" +this.ruleForm.tel+"&verCode="+this.ruleForm.captcha;
            checkSMSCode(data).then((res) => {   // 验证手机号验证码是否正确请求
              console.log('pass', res)
              // console.log(res);
              if(res.data.data === true && res.data.code=== "ok"){   //验证码正确
                this.showInfo = false;
                this.$refs[formName].resetFields();
              } else if(res.data.message ==='验证码错误'){  // 验证码错误
                this.wrongCaptha = true
                this.$refs.ruleForm.validateField('captcha' ,message => {
                })
              }
              this.loading = false
              this.isDisabled = false
            }).catch((err) => {
              this.isDisabled = false
              this.loading = false
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      close () {
        this.$emit('close')
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true
            // 按钮禁止，防止重复提交
            this.isDisabled = true

            let newForm = {
              mobileNumber:this.mobileNumber,
              password:this.ruleForm1.password,
              confirmPassword:this.ruleForm1.confirmPassword
            }
            let init = setPassMd5(['password','confirmPassword'], newForm);
            let data = qs.stringify(init)

            // let data = "mobileNumber=" + this.mobileNumber + "&password="+this.ruleForm1.password+"&confirmPassword=" + this.ruleForm1.confirmPassword;

            surePassword(data).then((res) => {
              // console.log('regis res', res)
              let data = res.data
              let message = res.data.message
              if(data.code === 'ok') {
                this.countDown = false
                // this.$store.dispatch('SignUp')
                // this.$notify({
                //   title: '成功',
                //   message: '注册成功',
                //   type: 'success',
                //   duration: 2000
                // })
                this.close()//这里注意顺序
                // 跳转到创建活动页面
                // 发出事件， 注册成功
                this.$emit('signUpSuccess')
              }
              else if(message==='验证码错误'){
                // this.
                //  this.$refs.ruleForm.validateField('contact' ,message => {

                //  })
                // this.$message({
                //   message: '验证码错误',
                //   type: 'error',
                //   duration: 2* 1000
                // });
                // 把提交按钮放开
                this.isDisabled = true;
              }else{
                this.$message({
                  message: '请稍后再试',
                  type: 'error',
                  duration: 2* 1000
                });
                // 把提交按钮放开
              }
              this.isDisabled = false
              this.loading = false
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
</style>