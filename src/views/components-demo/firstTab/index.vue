<template>
  <div class="slyder-first">
    <div class="tab-img">
      <!-- <img :src=" '/static/images/slyder-' + activeName + '.jpg' "> -->
      <img :src=" '/static/images/' + currentItemFromRouter + '-' + activeName + '.png' ">
      <pre 
      v-show=" this.$route.meta.type == 'slyder' && activeName==='second' || activeName==='first'" 
      class="rule-content" v-html="ruleForm.activityRule" 
      >
      </pre>
      <div v-show="this.$route.meta.type == 'slyder' ? activeName==='second' : ''" class="rule-area">
        <ul class="lottery-area">
          <li v-for="(item,index) in lotteryList" v-show="item.price && item.category" :key=index>
            <p class="lottery-deno"><span>{{item.price}}</span></p><p class="lottery-category">{{item.category}}</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="slyder-first-wrapper">
      <el-form  :model="ruleForm"  ref="ruleForm"  label-width="80px" label-position ="left">
        <el-tabs v-model="activeName2" type="card">
          <el-tab-pane label="基础设置" name="first" class="tag-base">
                <el-form-item label="活动名称">
                 <el-input 
                 v-model="ruleForm.activityName" 
                 placeholder="请输入活动名称" 
                 auto-complete="off"
                 maxlength="10"
                 ></el-input>
                </el-form-item>
                <el-form-item label="开始时间">
                  <el-date-picker type="date" placeholder="选择日期" 
                    v-model="ruleForm.startTime" 
                    style="width: 100%;"
                   :picker-options="pickerBeginDateBefore"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                  <el-date-picker type="date" placeholder="选择日期" 
                  v-model="ruleForm.expiredTime" 
                  style="width: 100%;"
                  :picker-options="pickerBeginDateAfter"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="活动规则">
                  <el-input 
                  :autosize='{ minRows: 5}' 
                  resize='none' 
                  type="textarea"  
                  v-model="ruleForm.activityRule"
                  maxlength="200"
                  ></el-input>
                </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="限制条件" name="second" class="mytag">
              <div class="input-item">
                <span>手机号地域</span>
                <distpicker
                hide-area id="distpicker"
                :province="select.province.value" 
                :city="select.city.value"
                @province="selectProvince"
                @city="selectCity"
                @allCity="getAllCities"
                ></distpicker>
              </div>
              <div class="input-item">
                <span>手机号次数</span>
                <div class="mobile">
                  <span id="reduce" @click="reduce">-</span>
                  <input class="input-self" v-model="ruleForm.settings[1].value"  id="input-self" maxlength="3" />
                  <span id="plus" @click="plus">+</span>
                </div>
              </div>
          </el-tab-pane>
          <el-tab-pane label="奖项设置" name="third" class="mytag">
            <el-button v-show="autoDefinie" @click="addLottery">添加</el-button>
            <table id="six-table">
                <tr class="tr-head">
                  <th v-show="autoDefinie">操作</th>
                  <th>奖品名称</th>
                  <th>奖品种类</th>
                  <th>奖品面额</th>
                  <th>奖品数量</th>
                  <th>中奖概率</th>
                  <!-- <th>奖品估算</th> -->
                </tr>
                <tr v-for="(item,index) in ruleForm.prizeSettings" :key="index" @click="setPosition(index,item.name)">
                  <td class="spc-width-select" v-if="autoDefinie" @click="deleteLottery(index)">
                  {{index===0 ? '' : '删除'}}
                  </td>
                  <td class="spc-width-select">
                    <el-input 
                    v-if="autoDefinie" 
                    class="td-six" 
                    placeholder="奖项名称" 
                    v-model="item['name']"
                    maxlength="5" 
                    >
                    </el-input>
                    <span v-else>{{item.name}}</span>
                  </td>
                  <td class="spc-width-select" >
                    <el-select
                      v-show="item.name!=='谢谢参与'" 
                      v-model="item['category']"  
                      placeholder="请选择" 
                      @change="change($event,index)">
                      <el-option
                        v-for="item1 in tableData.type"
                        :key="item1.value"
                        :label="item1.label"
                        :value="item1.value"
                        >
                      </el-option>
                    </el-select>
                  </td>
                  <td class="spc-width">
                  <el-select :disabled="item['category'] ? false : true" v-show="item.name!=='谢谢参与'" v-model="item['price']" placeholder="请选择" @change="change1">
                    <el-option
                        v-for="item2 in tableData.denomination[currentSelectOption[index]]"
                        :key="item2.value"
                        :label="item2.value"
                        :value="item2"
                        >
                      </el-option>
                    </el-select>
                  </td>
                  <td class="spc-width">
                    <el-input type="number" min="0" class="td-six" placeholder="数量" v-model="item['number']">
                    </el-input>
                  </td>
                  <td class="spc-width">
                      <el-input  type="number" min="0" v-model="item['weight']" class="td-six" placeholder="概率"></el-input>
                  </td>
                  <!-- <td class="spc-width"><span class="estimate"></span></td> -->
                </tr>
                <tr>
                  <td v-if="autoDefinie"></td>
                  <td>合计</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>100%</td>
                  <!-- <td><span class="estimate"></span></td> -->
                </tr>
              </table>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
    <modal v-if="giveUpVisible">
       <div slot="header">
        <span class="fl">提示</span>
        <span class="fr cursor" @click="close"><i class="el-icon-close"></i></span>
      </div>
      <div slot="body">
        <div class="confirm">{{this.queryId ? '确定放弃修改表格吗？' : '确定放弃创建表格吗？'}}</div>
        <div>
           <el-button @click="calcelConfirm">取消</el-button>
           <el-button type="primary" @click="confirmGiveUp">确定</el-button>
        </div>
      </div>
    </modal>
  </div>
</template>
<script>
import Distpicker from 'components/Distpicker/src/Distpicker'
import { mapGetters,mapMutations} from 'vuex'
import Tab from 'components/Tab'
import Modal from 'components/Modal'
import {  createActivity,updateActivity, initPrizeSet} from 'api/activity'
import {activityEdit} from 'api/manage_activity'
import qs from 'qs'


// let tableData = {
//   type:[{value: '流量'}, {value: '话费'}
//   // {value: '视频券'}
//   ],
//   denomination:{
//     // '视频券': [{value: '200元'},{value: '180元'},{value: '100元'}],
//     '话费': [{value: '1元'},{value: '2元'},{value: '5元'},{value: '10元'},{value: '20元'},{value: '30元'},{value: '50元'},{value: '100元'}],
//     '流量': [{value: '10M'},{value: '20M'},{value: '30M'},{value: '50M'},{value: '100M'},{value: '200M'},{value: '500M'},{value: '1024M'}]
//   }
// }
let slyderData = [
            {name:'奖项一',category:'',price:'',number:'',weight:'',sort:1,priceCategoryId:0},
            {name:'奖项二',category:'',price:'',number:'',weight:'',sort:2,priceCategoryId:0},
            {name:'奖项三',category:'',price:'',number:'',weight:'',sort:3,priceCategoryId:0},
            {name:'奖项四',category:'',price:'',number:'',weight:'',sort:4,priceCategoryId:0},
            {name:'奖项五',category:'',price:'',number:'',weight:'',sort:5,priceCategoryId:0},
            {name:'谢谢参与',number:'',weight:'',sort:6}
          ]
let lotteryBaseLine =  {name:'',category:'',price:'',number:'',weight:''}

export default {
  // name: 'slyderAPP',
  props:{
    activeName:{
      type:String,
      default:'first'
    },
    giveUpVisible:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      // 日期 控制之后，只差一种情况，即当开始时间大于 结束时间
      pickerBeginDateBefore:{
          disabledDate: (time) => {
            return time.getTime() < Date.now();
          }
      },
      pickerBeginDateAfter:{
          disabledDate: (time) => {
              let beginDateVal = this.ruleForm.startTime;
              if (beginDateVal) {
                  return time.getTime() < beginDateVal;
              }else{
                  return time.getTime() < Date.now();
              }
          }
      },
      ruleForm: {
          activityName: '',
          templateNo:'',
          startTime: '',
          expiredTime: '',
          activityRule:'',
          settings:[
            {key:'areaCode', value:{code:'', province:'' ,city:''}},
            {key:'takeNum', value:'1'},
            {key:'verifyCodeType', value:'IMAGE'},
          ],
          prizeSettings:[]
      },
      tableData:{type:[], denomination:{}},
      activeName2: 'first',
      textarea: '',
      currentSelectOption: [],  // 奖品种类数组
      lotteryList:null,  // 自定义奖品所有字段数组
      position:0,//默认从一等奖开始选择
      help:0,
      tep :[],//因为“奖项设置行数是不固定的，所以tep的长度不要固定住”
      aid :[true,true,true,true,true],
      // select: { province: '', city: '', area: '' },
      select: { province: {}, city: {}, area: '' },
      cityArr:[],
      resultSelect:'',
      autoDefinie: false,
      currentItemFromRouter:'',
      dialogVisible: false,
      once:true,
      middle:false,
      start: false
    }
  },
  watch: {
    hasClickSave: function (value) {
     //提交表格 先进行验证
     if(value) {
       this.submitForm('ruleForm')
       this.setClickSave(false)
     }
    }
  },
  computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'currentLotteryItem',
      'hasClickSave',
      'isCreate',
      'preparePath',
      'pass'
    ])
  },

  methods:{
    ...mapMutations([
      'setClickSave', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`
      'setLotteryStatus',
      'setIsSubmit',
      'setPass'
    ]),
    close () {
      // this.dialogVisible = false
      this.$emit('close')
    },
    calcelConfirm () {
      this.close()
    },
    confirmGiveUp () {
      let url = this.preparePath
      if(url) {
        this.setLotteryStatus(true)
        setTimeout(()=>{
          this.close()
          // 在这里重置表单
          // this.resetForm('ruleForm')
          this.$router.push({path:url})
        },500)
      }
      this.close()
    },
    selectProvince(value) {
      if(this.start){
        this.middle = true //开启省市变化
      }
      this.select.province = value
      // console.log('province', value)
    },
    selectCity(value) {
      this.select.city = value
      // console.log('city', value)
    },
    getAllCities (cities) {
      for (let key in cities) {
        this.cityArr.push(key)
      }
    },
    plus (){
      this.ruleForm.settings[1].value++
    },
    reduce (){
      this.ruleForm.settings[1].value--
      if(this.ruleForm.settings[1].value<0){
        this.ruleForm.settings[1].value = 0
      }
    },
    showLottery () {
      this.lotteryList = this.ruleForm.prizeSettings;
      let item = this.lotteryList[this.position]
      let {category,price} = item
      if(this.aid[this.position]) {
        if(category && price) {
          this.help++
          this.aid[this.position] = false
        }
      }
      if(this.help === 5) {
        this.lotteryList[this.help].category = '参与'
        this.lotteryList[this.help].price = '谢谢'
      }
    },
    setTepData (len) {
      this.tep = []
      for(let i=0;i<len;i++) {
        if(this.queryId) {
          this.tep[i] = true
        }else{
         this.tep[i] = false
        }
      }
    },
    validate (len,item) {
      for(let i=0;i<len;i++){
        // len-1如果是大转盘的话，‘谢谢参与’是最后一行，只需要判断是否有number ,和 weight即可，
        // 如果不是大转盘的话，自动输入‘谢谢参与’就不一定是最后一行了,所以此处的条件需要再处理
          if(this.autoDefinie) { //奖项名称自己定义
            let {name,category, price, number, weight} = item[i]
            if(name && category && price && number && weight ) {
                this.tep[i] = true
              }
          }else{
            if(i===len-1){//大转盘最后一行谢谢参与只需要验证两项
              let {number, weight} = item[i]
              if( number && weight ) {
                this.tep[i] = true
              }
            }else{
              let { category, price, number, weight} = item[i]
              if( category && price && number && weight ) {
                this.tep[i] = true
              }
            }
        }
      }
    },
    setlotteryData () {
      //获取最终“奖项设置”的行数
      let item = this.ruleForm.prizeSettings
      let len = item.length
      this.setTepData(len)
      this.validate(len, item)
    },
    change (value,index) {
      this.position = index;
      // 根据种类 设置奖品面额 的type
      // 每次点击种类，清空 面额数据 重新选择面额
      // this.position 索引
      if(this.position || this.position===0) {
        this.ruleForm.prizeSettings[this.position].price = '';
      }
      // 根据选择的key 值 找出索引

      this.currentSelectOption[this.position] = value
      if(value){
        //在这里处理奖品 种类
        this.category = value
      }
    },
    change1 (value) {
      // 这里确定奖品的面额
      console.log('value', value);

      this.price = value
      this.showLottery()
    },
    setPosition (index,name) {
      // 确定是几等奖
      this.position = index
    },
    switchKeyName (value) {
      let result
      switch(value)
        {
        case 'activityName':
          result = '活动名称'
          break;
        case 'startTime':
          result = '开始时间'
          break;
        case 'expiredTime':
          result = '结束时间'
          break;
        case 'number':
          result = '手机号次数'
          break;
        case 'activityRule':
          result = '活动规则'
          break;
        case 'templateNo':
          result = '模板编号'
          break;
        default:
          result = '暂无'
        }
        return result
    },
    setAlert(text) {
      this.$alert(text,'提示', {
        type:'error',
        lockScroll:true,
        showConfirmButton:false
      });
    },
    addLottery () {
      // 先验证第一行数据是否填写完整
      // this.add = true
      this.setlotteryData()
      let len = this.tep.length
      if(this.tep[len-1]){
        let baseData = JSON.parse( JSON.stringify(lotteryBaseLine))
        this.ruleForm.prizeSettings.push(baseData)
      }else{
        this.setAlert(`请将奖项设置第${len}行填写完整`)
      }
    },
    deleteLottery (index){
      if(index===0) {
        return
      }
      this.ruleForm.prizeSettings && this.ruleForm.prizeSettings.splice(index,1)
      // 删除数据之后重新获取 tep的值
      this.setlotteryData()
    },
    resetForm(formName) {
      // this.$refs[formName].resetFields();
      Object.assign(this[formName], this.$options.data()[formName])
      // this[formName] = {};
    },
    submitForm(formName) {
        let valid = false
        // 用路由获取templateNo  vuex获取会随着页面刷新而变化
        let templateNo = this.$route.params.no
        if(templateNo) {
           this.ruleForm.templateNo = templateNo
        }
        // this.ruleForm.templateNo = this.currentLotteryItem.templateNo
        // this.$refs[formName].validate((valid) => {
        let data = this.ruleForm
        //除”奖项设置“之外区域的验证
        for (var prop in data) {
          if(!data[prop]){
            let label = this.switchKeyName(prop)
            // if(label===!'暂无'){
            //   this.setAlert(`${label}未填写`)
            //   return
            // }
            this.setAlert(`${label}未填写`)
            return
          }
        }
        // 判断日期填写是否正确
        if(this.ruleForm.startTime > this.ruleForm.expiredTime){
          this.setAlert(`开始时间不能大于结束时间`)
          return
        }
        //不选默认是全国
        if(!this.select.province){
          this.setAlert('手机号区域未填写')
          return
        }
        //”奖项设置“ 验证，借助 this.tep的值
        this.setlotteryData()
        let len = this.tep.length
        let changeData = this.ruleForm.prizeSettings
        let changeAll = 0
        for(let i=0; i<len ;i++){
          if(!this.tep[i]){
            this.setAlert(`"奖项设置"第${i+1}行未填写完整======`)
            return
          }
          // changeAll += parseInt(changeData[i].weight)
        }
        // 填写完整了，验证数量是否输入负数，数量最小值为1
        for(let i=0; i<len ;i++){
          if(this.tep[i] && !(/^\+?[1-9][0-9]*$/.test(changeData[i].number)))  {
            this.setAlert(`奖项设置第${i+1}行"奖品数量"必须为大于0的整数`)
            return
          }
          // 验证概率是否是正数并且可以是小数
          if(this.tep[i] && changeData[i].weight <=0)  {
            console.log('test', changeData[i].weight)
            console.log('type', typeof changeData[i].weight)
            this.setAlert(`奖项设置第${i+1}行"中奖概率"必须大于0`)
            return
          }
          // if(this.tep[i] && !((changeData[i].number)%1===0)){
          //   this.setAlert(`奖项设置第${i+1}行奖品数量必须为整数`)
          //   return
          // }
          changeAll += parseFloat(changeData[i].weight)
        }
        //验证概率之和
        if(changeAll!==100){
          this.setAlert(`"中奖概率"之和必须是100`)
          return
        }
        //验证数据完毕，开始提交数据
        valid = true
        if(valid) {
          this.setLoading('正在提交,请勿离开...')
            //处理城市选择区域数据
            // console.log('省',this.select)
            // console.log('市',this.select.city)
            let code
            let province
            let city
            if(!this.queryId || this.start || (this.start && this.middle) ) {  // 有省有市
              if(this.select.province.code && this.select.city.code){
                // console.log('省 + 市')
                code = this.select.province.code + ',' + this.select.city.code
                // 只有市的code
                // code = this.select.city.code

                province = this.select.province.value
                city = this.select.city.value
              }
              if(this.select.province.code && !this.select.city.code){  // 有省没市
                //没有选择城市的时候，this.select.city是undefined
                // console.log('省')

                // let cityString = this.cityArr.join(',') // 省下的是市code
                // 省code + 市code
                // code = this.select.province.code + ',' + cityString
                code = this.select.province.code
                // 只有市code
                // code =  cityString

                province = this.select.province.value
                city = ''
              }
              // 说明是全国
              if(!this.select.province.code){
                code = ''
                province = ''
                city = ''
              }
              this.ruleForm.settings[0].value = {code,province,city}
            }
            //处理时间区域数据
            if(this.once) {
              this.ruleForm.startTime = this.ruleForm.startTime.getTime()
              this.ruleForm.expiredTime = this.ruleForm.expiredTime.getTime()
              this.once = false
            }

            // 将settings, prizeSettings 数组转化为字符串
            console.log('this.ruleForm',this.ruleForm)
            const object = Object.assign({}, this.ruleForm);
            console.log('obj', object);
            object.settings = JSON.stringify(object.settings)
            // 在字符串化之前先对prizeSettings的sort进行处理 ，如果类型不是slyder的话
            let addSortArr = object.prizeSettings
            // prizeSettings所有子项处理price 对象
            addSortArr.forEach((item, index) =>{
              let newItem = item.price
              item.price = newItem.value
              item.priceCategoryId = newItem.id
              if(this.currentItemFromRouter !== 'slyder') {
                item.sort = index + 1
              }
            })
            // if(this.currentItemFromRouter !== 'slyder') {
            //   addSortArr.forEach((item, index) =>{
            //     item.sort = index + 1
            //   })
            // }
            console.log('addSortArr', addSortArr)
            object.prizeSettings = JSON.stringify(addSortArr)
            // 处理模板标号 templateNo
            let data = qs.stringify(object)

            // console.log('创建活动数据', object)
            // console.log("data",data)
            // 判断是新建还是更新用
            if(this.queryId) {
              this.handle(updateActivity,data,formName)
            }else{
              this.handle(createActivity,data,formName)
            }
        }
      },
    handle (fun,data,formName) {
        fun(data).then((res) =>{
          let data = res.data
          if(data.code==='ok'){
            this.setIsSubmit(true)
            // alert('创建成功')
            this.resetForm(formName)
            this.loading.close()
            this.$router.push({ path: `/management/`,})
          }else{
            // alert('请稍后处理')
            this.loading.close()
          }
      })
    },
    setLoading (text) {
      this.loading = this.$loading({
          lock: true,
          text: text,
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
    }
  },
  components:{
    Distpicker,
    Tab,
    Modal
  }
}
</script>
<style lang="stylus" scoped>
.confirm
  padding:5px 0 25px
.slyder-first
  padding:20px 30px
  position:relative
  height:100%
.slyder-first-wrapper
  margin: 30px 0 0 350px;
.slyder-form
  text-align :center
  padding-top:20px
.input-item
  height:40px
  // line-height:40px
  font-size :0
  margin-bottom:20px
  text-align:left
  span
    display:inline-block
    width:70px
    vertical-align :middle
    text-align:justify
    font-size :12px
    height:40px
    line-height:40px
.input-self
  font-size:14px
  color:#606266
  width:80px
  -webkit-appearance: none;
  color: #606266;
  display: inline-block;
  vertical-align:middle
  height: 39px;
  line-height: 39px;
  padding: 0 15px;
  border:1px solid #ccc
  text-align:center
  -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
.input-self:focus
  border-color: #409EFF;
  outline: 0;
.code-btn
  width:110px
  height:30px
  background:#adadad
  border:none
  color:#fff
  border-radius:4px
  vertical-align :middle
  margin-right:5px
#distpicker
  display:inline-block
  height:30px
  vertical-align :middle
.mobile
  display:inline-block
  height:40px
.mobile span
  width:30px
  text-align :center
  height: 39px
  line-height:39px
#reduce
  float:left
  border-top:1px solid #ccc
  border-left:1px solid #ccc
  border-bottom:1px solid #ccc
#plus
  float:right
  border-top:1px solid #ccc
  border-right:1px solid #ccc
  border-bottom:1px solid #ccc
#refresh
  text-decoration:underline
  color:#08c0ed
#base-form
  .input-self
    width:250px
#rule-area
  height:300px
  span
    vertical-align:top
#six-table
  min-width:610px
#six-table tr
  height:40px
  line-height:40px
  font-size:14px
  td
    padding: 8px
  td.spc-width
    min-width:80px
  td.spc-width-select
    min-width:100px
.tr-head
  color:#13b9f4
.estimate
  display:inline-block
  width:80px
  height:30px
  line-height:30px
  background:#ccc
  position:relative
  top:10px
.tag-base
 max-width:400px
.tab-img
  position:absolute
  top:30px
  // width:375px
  // height:756px
  bottom:0
  img
    width:250px
    height:510px
  .rule-content
    position :absolute
    padding:5px
    top: 350px;
    width: 190px;
    margin-left: 30px;
    height:74px
    color:#fff
    text-align:left
    font-size:12px
    overflow-x:hidden
    white-space: pre-wrap; /*css-3*/ 
    white-space: -moz-pre-wrap; /*Mozilla,since1999*/ 
    white-space: -pre-wrap; /*Opera4-6*/ 
    white-space: -o-pre-wrap; /*Opera7*/ 
    word-wrap: break-word; /*InternetExplorer5.5+*/ 
  .rule-area
    position:absolute
    left:55px
    top:163px
    height:144px
    width:144px
    z-index:1000
    ul > li > span
      font-size:16px
    ul > li
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      padding-top: 8px;
      transform-origin: 50% 72px 0px;
      font-size: 11px;
      color: red;
      line-height:12px
    .lottery-sort
      line-height:22px
    .lottery-area>li:nth-child(1)
      transform: rotate(0deg);
    .lottery-area>li:nth-child(2)
      transform: rotate(-60deg);
    .lottery-area>li:nth-child(3)
      transform: rotate(-120deg);
    .lottery-area>li:nth-child(4)
      transform: rotate(-180deg);
    .lottery-area>li:nth-child(5)
      transform: rotate(-240deg);
    .lottery-area>li:nth-child(6)
      transform: rotate(-300deg);
.lottery-deno
  font-size:15px
  margin-top:2px
.lottery-category
  margin-top:6px
</style>