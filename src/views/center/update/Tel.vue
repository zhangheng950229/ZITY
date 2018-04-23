<template>
  <modal>
    <div slot="header">
      <span class="fl">更换手机号</span>
      <span class="fr cursor" @click="close"><i class="el-icon-close"></i></span>
    </div>
    <div class="" slot="body">
    <el-form status-icon :model="ruleForm" :rules="rules"  ref="ruleForm"  label-width="80px" label-position ="left">
       <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" placeholder="请输入登录密码" auto-complete="off"></el-input>
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
        <el-button type="primary" class="info-btn" @click="submitForm">确认</el-button>
    </el-form>
  </div>
  </modal>
</template>
<script>
  import Modal from 'components/Modal'
  import  Captcha from 'components/Captcha'
  import {phoneGetCaptcha} from 'api/user'
  import {updateTel} from 'api/user'

   export default {
    props: {
      INFO: {
        type: Object
      }
    },
    data () {
      var validatePass = (rule, value, callback) => {   // password
        if( value ==='') {
          callback(new Error('请输入登录密码'))
        } else if (this.test === "旧密码输入错误") {
          callback(new Error('密码输入错误，请重新输入'))
          this.test = '';
        } else {
          callback();
        }
       
      }
      var validatePass1 = (rule, value, callback) => {   // tel
        this.$refs.ruleForm.validateField('password' ,message => {
          if (message === '请输入登录密码') {
            callback(new Error('请输入登录密码'))
          } else {
              if(value === "") {
                callback(new Error("请输入手机号"))
              } else if(this.test == "号码已存在") {
                callback(new Error("新手机号已存在"));
                this.test = '';
              }else {
                callback()
              }
          }
        });
        
      }
      var validatePass3 = (rule, value, callback) => {
        this.$refs.ruleForm.validateField('password' ,message => {
          if (message === '请输入登录密码') {
            callback(new Error('请输入登录密码'))
          }else if( this.test == "密码输入错误，请重新输入") {
            callback(new Error('密码输入错误，请重新输入'))
            this.test = '';
          } 
          else if (this.test == "验证码错误") {
            callback(new Error('验证码错误，请重新输入'))
            this.test = '';
          } 
          else {
            this.$refs.ruleForm.validateField('tel' ,message => {
              if (message==='请输入手机号码') {
                callback(new Error('请先输入手机号码'));
              }
              else if (message==='手机号码输入不正确') {
                callback(new Error(message));
              }
              // else if (value==='') {
              //   callback(new Error('请输入验证码'))
              // }
              // else if (this.test == "旧密码输入错误") {
              //   callback(new Error('密码输入错误，请重新输入'))
              // }
              
              else {
                callback();
              }
            })
          }
        })
        
        
      };
      return {
          countDown:false,
          flag: true,
          loading:false,
          verCode:'',
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
              { required: true, validator: validatePass1, trigger: 'blur' },
              { pattern: /^1[34578]\d{9}$/, message: '手机号码输入不正确',trigger: 'blur'}
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
        // console.log("USERIFO",this.INFO)     
        this.$refs.ruleForm.validateField('tel',(message) => {
           this.$refs.ruleForm.validateField('password', (message) => {
            // 说明有错误字段
            // console.log("arguments",arguments)
            // console.log("message",message)
            if(this.ruleForm.password != "" && this.ruleForm.tel != ''){
              if(this.flag){
                this.flag = false;
                this.countDown = false;
                //在这里post短信验证码，data 为后台需要的字段
                // console.log("TelINFO",this.INFO);
                let data = "phoneNumber="+this.INFO.login_name+"&newPhoneNumber="+this.ruleForm.tel+"&oldPassword="+this.ruleForm.password; 
                phoneGetCaptcha(data).then((res)=>{
                  if(res.data.code == "ok" && res.data.data == true ){ // 成功发送请求
                    // 密码输入正确，手机号输入正确，后台已经发送验证码
                    // 证实后台已经发送验证码 开始倒计时
                    this.countDown = true;
                  }else if(res.data.code == "remote call failed") {
                    this.countDown = false
                    this.$message({
                      message: '网络延时请稍后尝试',
                      type: 'error',
                      duration: 3* 1000
                    });
                    this.flag = true;
                  }else{
                    // alert()
                    console.log(res.data.message);
                    this.test = res.data.message;
                    this.$refs.ruleForm.validateField('password');
                    this.$refs.ruleForm.validateField('tel');
                    this.flag = true;
                  }
                })
              }
            }
          })
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
        this.$refs.ruleForm.validate((valid,obj) => {
          if (valid) {
            this.countDown = false
            this.loading = true
            let data = "mobileNumber="+this.ruleForm.tel+"&verifyCode="+this.ruleForm.captcha + "&id=" + this.INFO.id + "&password=" + this.ruleForm.password + "&oldMobile=" + this.INFO.mobile_number;
            updateTel(data).then((res) =>{
              // 重新获取一遍用户数据
              // console.log("udateTel",res);
              if(res.data.code === 'ok' ){
                this.loading = false;
                this.$emit("change_INFO",res.data.data);
                this.close();
              } else {
                // alert()
                // callback(new Error('res.data.message'))
                this.test = res.data.message;
                this.$refs.ruleForm.validateField('captcha')

                // this.$message({
                //   message: res.data.message,
                //   type: 'error',
                //   duration: 3 * 1000
                // });
              }
            }).catch(() =>{
              this.loading = false
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