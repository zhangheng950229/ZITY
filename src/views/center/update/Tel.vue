<template>
  <modal>
    <div slot="header">
      <span class="fl">更换手机号</span>
      <span class="fr cursor" @click="close"><i class="el-icon-close"></i></span>
    </div>
    <div class="" slot="body">
    <el-form status-icon :model="ruleForm" :rules="rules"  ref="ruleForm"  label-width="80px" label-position ="left">
       <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" type="password" 
placeholder="请输入登录密码" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="tel">
        <el-input v-model="ruleForm.tel" placeholder="请输入新手机号码" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="captcha">
        <el-input 
        class="captcha" 
        v-model="ruleForm.captcha" 
        placeholder="请输入6位验证码"
        maxlength=6
        ></el-input>
        <!-- <button class="code-btn">发送验证码</button> -->
        <captcha @click.native="getCaptcha" :countDown="countDown" @stop="stop"></captcha>
      </el-form-item>
        <el-button type="primary" class="info-btn" @click="submitForm" :disabled="isDisabled" :loading="loading">确认</el-button>
    </el-form>
  </div>
  </modal>
</template>
<script>
  import Modal from 'components/Modal'
  import  Captcha from 'components/Captcha'
  import {phoneGetCaptcha} from 'api/user'
  import {updateTel} from 'api/user'
  import {setPassMd5} from 'utils/help'
  import qs from 'qs'

   export default {
    props: {
      INFO: {
        type: Object
      }
    },
    data () {
      var validatePass = (rule, value, callback) => {
        if( value ==='') {
          callback(new Error('请输入登录密码'))
        } else if (this.falsePW) {
          // console.log('thhis', this.falsePW )
          callback(new Error('旧密码输入不正确'))
        } else {
          callback();
        }
       
      }
      var validatePass1 = (rule, value, callback) => {
        if (this.telHas) {
          callback(new Error('手机号已存在'));
        } else if (value === "") {
          callback(new Error('请输入手机号码'));
        } else if(!/^1(3|4|5|6|7|8)\d{9}$/.test(value)){
            callback(new Error('手机号码输入不正确'));
        }else {
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
      };
      return {
          countDown:false,
          flag: true,
          loading:false,
          isDisabled :false,
          ruleForm: {
            password:'',
            tel: '',
            captcha: ''
          },
          rules: {
            password: [
              { required: true, validator: validatePass, trigger: 'blur' },
            ],
            tel: [
              { required: true, validator: validatePass1, trigger: 'blur' }
              // { pattern: /^1[345678]\d{9}$/, message: '手机号码输入不正确',trigger: 'blur'}
            ],
            captcha: [
              { required: true,validator: validatePass3, trigger: 'blur' }
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
        this.falsePW = false
        this.telHas = false
        this.$refs.ruleForm.validateField('password' ,message => {
          if(!message){
              this.$refs.ruleForm.validateField('tel' ,message1 => {
                if(!message1) {
                  if(this.flag){
                    this.flag = false;
                    this.countDown = false;
                    //在这里post短信验证码，data 为后台需要的字段
                    // console.log("TelINFO",this.INFO);
                    let newForm = {
                      phoneletNumber:this.INFO.login_name,
                      newPhoneNumber:this.ruleForm.tel,
                      oldPassword:this.ruleForm.password
                    }
                    let init = setPassMd5(['oldPassword'], newForm)
                    let data = qs.stringify(init)
                    console.log('data===', data)

                    // let data = "phoneNumber="+this.INFO.login_name+"&newPhoneNumber="+this.ruleForm.tel+"&oldPassword="+this.ruleForm.password; 
                    phoneGetCaptcha(data).then((res)=>{
                      console.log('cap', res)
                      if(res.data.code == "ok" && res.data.data == true ){ // 成功发送请求
                        // 密码输入正确，手机号输入正确，后台已经发送验证码
                        // 证实后台已经发送验证码 开始倒计时
                        this.countDown = true;
                      }
                      else if(res.data.code == "remote call failed") { 
                        this.countDown = false
                        this.$message({
                          message: '系统维护请稍后尝试',
                          type: 'error',
                          duration:3* 1000
                        });
                        this.flag = true;
                      }
                      else if(res.data.message==='号码已存在'){
                        this.telHas = true
                        this.$refs.ruleForm.validateField('tel' ,message => {
                          if(message==='号码已存在'){
                          }
                      })
                        this.flag = true;
                      }else if(res.data.message==='旧密码输入错误'){
                        this.falsePW = true
                        this.$refs.ruleForm.validateField('password' ,message1 => {
                        })
                        this.flag = true;
                      }
                    })
                  }
                }
            })
         }
        })
      },
      close () {
        this.$emit('close')
        this.countDown = false
        this.$refs.ruleForm.resetFields();
        this.flag =true;
      },
      submitForm() {
        // this.$router.push({ path: '/create-project/index' })
        // this.test = "";
        this.telHas = false
        this.falsePW = false
        this.wrongCaptha = false
        this.$refs.ruleForm.validate(valid => {
          // console.log('rule', this.ruleForm)
          if (valid) {
            this.loading = true
            this.isDisabled = true
            let newForm = {
              mobileNumber:this.ruleForm.tel,
              verifyCode:this.ruleForm.captcha,
              id:this.INFO.id,
              password:this.ruleForm.password,
              oldMobile:this.INFO.mobile_number
            }
            let init = setPassMd5(['password'], newForm)
            let data = qs.stringify(init)
            // let data = "mobileNumber="+this.ruleForm.tel+"&verifyCode="+this.ruleForm.captcha + "&id=" + this.INFO.id + "&password=" + this.ruleForm.password + "&oldMobile=" + this.INFO.mobile_number;
            updateTel(data).then((res) =>{
              console.log('res====', res)
              // 重新获取一遍用户数据
              // console.log("udateTel",res);
              if(res.data.code === 'ok' ){
                this.countDown = false
                // this.loading = false;
                this.$emit("change_INFO",res.data.data);
                this.close();
              } else if(res.data.code == "remote call failed") { 
                        // this.countDown = false
                        this.$message({
                          message: '系统维护请稍后尝试',
                          type: 'error',
                          duration:3* 1000
                        });
                        // this.flag = true;
                      }
                      else if(res.data.message==='号码已存在'){
                        this.telHas = true
                        this.$refs.ruleForm.validateField('tel' ,message => {
                          if(message==='号码已存在'){
                          }
                      })
                        // this.flag = true;
                      }else if(res.data.message==='验证码错误'){
                        console.log(2222)
                        this.wrongCaptha = true
                        this.$refs.ruleForm.validateField('captcha' ,message1 => {
                        })
                        // this.flag = true;
                      }else if(res.data.message==='旧密码输入错误'){
                        this.falsePW = true
                        this.$refs.ruleForm.validateField('password' ,message2 => {
                        })
                        // this.flag = true;
                      }
                  this.loading = false
                  this.isDisabled = false
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