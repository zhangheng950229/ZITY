<template>
<div>
  <el-row :gutter="20" style="margin-bottom:140px">
    <el-col class="margin-col" :xs="{span: 12}" :sm="{span: 12}" :md="{span: 6}"  v-for="(item,index) in list" :key="index">
      <el-card :body-style="{ padding: '0px' }">
        <img class="example-img" :src="'/static/images/' + item.num + '.jpg'">
        <div class="example-text">
          <span class="dot">.</span>
          <span>{{item.text}}</span>
          <span class="dot">.</span>
        </div>
      </el-card>
      <el-button type="primary" class="example-btn" @click="openModel(item)">创建活动</el-button>
    </el-col>
  </el-row>
  <!-- <modal v-if="showModal">
    <div slot="body">
      <div class="close-tep"><span>请您先登录</span><span class="fr" @click="close">X</span></div>
    </div>
  </modal> -->
  <zi-dialog
  :imgUrl=currentLotteryItem.num
  :title=currentLotteryItem.text
  v-if="showModal"
  @close="showModal = false" 
  >
  </zi-dialog>
</div>

</template>
<script>
import Dialog from 'components/Dialog'
import Modal from 'components/Modal'
import { mapGetters, mapMutations} from 'vuex'
import { getTemplates } from 'api/activity'


export default {
  name: 'example',
  data() {
    return {
      showModal:false,
      list:[]
    }
  },
   methods: {
    ...mapMutations([
      'setCurrentLottery',
      'initLotteryData'
    ]),
    changeTemplateData (arr) {
      let result = []
      arr.forEach((item,index) =>{
        if(item.template_no === '123456') {
          result[index] = {num:'01',text:'超级大转盘',type:'slyder',templateNo:item.template_no}
        }else if(item.template_no === '234567'){
          result[index] = {num:'02',text:'抽红包',type:'envelope',templateNo:item.template_no}
        }
      })
      return result
    },
    getTemplates () {
      this.setLoading()

      // var that = this ;
      // var xmlhttp;
      // if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
      //     xmlhttp=new XMLHttpRequest();
      // }else{// code for IE6, IE5
      //   xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
      // }
      // application/json;charset=UTF-8
    
      // xmlhttp.onreadystatechange=function(res){
      //   let data = res.data
      //   if (xmlhttp.readyState==4 && xmlhttp.status==200){
      //     // document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
      //     console.log(JSON.parse(xmlhttp.responseText));
      //     // console.log(str)
      //     let data1 = JSON.parse(xmlhttp.responseText) 
      //     let data = res.data
      //     if(data1.code === 'ok') {
      //       console.log(data1.list)
      //       let result = that.changeTemplateData(data1.list)
      //       that.list = result
      //       that.initLotteryData(result)
      //       that.loading.close()
      //       console.log(res)
      //     }
      //   }
      // }
      // xmlhttp.open("POST","http://192.168.111.114:8888/marketing/templateClient/getTemplates",true);
      // xmlhttp.withCredentials = true
      // xmlhttp.send();

      getTemplates().then((res,req) =>{
        console.log(document.getcookie("Admin-Token"));
        console.log("telplate",res)
        console.log("header",res.headers)
        let data = res.data
        if(data.code === 'ok') {
          let result = this.changeTemplateData(data.list)
          this.list = result
          // 将异步获取的数据 放到vuex全局
          this.initLotteryData(result)
          console.log('template', result)

          this.loading.close()
        } else {
          let timer = setInterval(function() {
            this.loading.close();
          })
          clearInterval(timer);
        }
      }).catch((res) =>{
        this.loading.close()
      })



    },
    setLoading () {
      this.loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    },
    openModel (item) {
      this.showModal = true
      this.setCurrentLottery(item)
    },
    close () {
      this.showModal = false
    }
  },
  created () {
    this.getTemplates()
  },
  computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'lotteryData',
      'currentLotteryItem'
    ])
  },
  components:{
   ziDialog:Dialog
   // Modal
  }
}
</script>
<style lang="stylus" scoped>
.example-img
  width:100%
  display:block
.example-text
  height:50px
  line-height:50px
  font-size:14px
  color:#424242
  span
    vertical-align :middle
  .dot
    font-size: 35px
    position: relative
    top: -9px
.grid-content
  line-height:0
.example-btn
  margin-top:30px
  width:130px
.el-row
    margin-bottom: 20px
    &:last-child
      margin-bottom: 0
.close-tep
  height:25px
  line-height:35px
.margin-col
  margin-bottom:20px
</style>

