<template>
  <span class="code-btn" :countDown="countDown" :disabled="countDown">
    {{countDown ? (time+'s') : text}}
  </span>
</template>
<script>
export default {
  name:'',
  props:{
    countDown:{
      type:Boolean,
      default:false
    }
  },
  data () {
    return{
      text:'发送验证码',
      time: 60
    }
  },
  methods:{
  },
  watch: {
    countDown: function (val) {
      clearInterval(timer);
      if(val){
        console.log(val)
        var timer = setInterval(()=>{
          if(this.time >0){
            this.time--
            return
          }
          if(this.time===0){
            this.time = 60
            this.$emit('stop',true)
            clearInterval(timer)
          }
        },1000);
        this.time = 60;
      }else{
        clearInterval(timer)
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.code-btn
    display:inline-block
    width:90px
    height:40px
    background:#adadad
    border:none
    outline:none
    color:#fff
    border-radius:4px
    vertical-align :middle
    cursor :pointer
    text-align:center
</style>