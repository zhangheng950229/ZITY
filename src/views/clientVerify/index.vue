<template>
  <div class="container">
    <div class="verify-header">
    <span><i class="el-icon-arrow-left
"></i></span>
    <span>客户审核</span></div>
    <div class="verify-lay">
      <div class="verify-content">
        <el-tabs v-model="activeName" @tab-click="tabChange">
          <el-tab-pane label="待审核" name="first">
            <el-table  fit highlight-current-row
               v-loading="listLoading" element-loading-text="拼命加载中"
               height="400"
              :data="ListByStatus" style="width: 100%">
                <el-table-column align="center" width="180"
                  v-for="{ prop, label } in colConfigs"
                  :key="prop"
                  :prop="prop"
                  :label="label">
                </el-table-column>
                <el-table-column label="操作" align="center" width="270">
                  <template slot-scope="scope">
                  <el-button
                      size="mini"
                      type="primary"
                      plain
                      @click="passVerify(scope.row.id, scope.row.status)"
                      >通过</el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      plain
                      @click="reject(scope.row.id)"
                      >拒绝</el-button>
                  </template>
                </el-table-column>
            </el-table>
            <div class="pagina">
               <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="fPageNum"
                :page-size="10"
                layout="total, prev, pager, next, jumper"
                :total="total">
              </el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane label="客户列表" name="second">
          <el-table fit highlight-current-row
            v-loading="listLoading" element-loading-text="拼命加载中"
            :data="clientList"
            height="400"
            style="width: 100%">
              <el-table-column align="center" width="180"
                v-for="{ prop, label } in colConfigs1"
                :key="prop"
                :prop="prop"
                :label="label">
              </el-table-column>
              <el-table-column
                label="有效期"
                align="center"
                width="180">
                 <template slot-scope="scope">
                  <p >{{ scope.row.start_time }}</p>
                  <p >{{ scope.row.expired_time }}</p>
                </template> 
              </el-table-column>
              <el-table-column
                label="全部状态"
                prop="status"
                align="center"
                width="180"
                :filters="filters"
                :filter-method="filterTag"
              >
                <template slot-scope="scope">
                  {{changeStatus(scope.row.status)}}
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="90">
                <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  plain
                  @click="startEdit(scope.row.id, scope.row.status,scope.row.start_time,scope.row.expired_time)"
                  :disabled="scope.row.status == '3'">编辑</el-button>
                </template>
              </el-table-column>
          </el-table>
          <div class="pagina" >
               <el-pagination
                @current-change="handleCurrentChange1"
                :current-page.sync="sPageNum"
                :page-size="10"
                layout="total, prev, pager, next, jumper"
                :total="total1">
              </el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <modal v-if="pass">
      <div slot="header">
        <span class="fl">请选择账号有效日期</span>
        <span class="fr cursor" @click="close"><i class="el-icon-close"></i></span>
      </div>
      <div slot="body">
        <el-form status-icon :model="ruleForm" :rules="rules"  ref="ruleForm"  label-width="80px" label-position ="left">
          <el-form-item label="开始日期" prop="startTime">
            <el-date-picker type="date" placeholder="选择日期" 
            v-model="ruleForm.startTime" style="width: 100%;"
            :picker-options="pickerBeginDateBefore"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期" prop="endTime">
            <el-date-picker type="date" placeholder="选择日期" 
            v-model="ruleForm.endTime" style="width: 100%;"
            :picker-options="pickerBeginDateAfter"
            ></el-date-picker>
          </el-form-item>
          <el-button type="primary"  class="info-btn" :loading="loading" @click="submitForm('ruleForm')">确定</el-button>
        </el-form>
      </div>
    </modal>
    <modal v-if="edit">
      <div slot="header">
        <span class="fl">编辑</span>
        <span class="fr cursor" @click="close"><i class="el-icon-close"></i></span>
      </div>
      <div slot="body">
        <el-form 
          status-icon 
          :model="ruleForm1" 
          :rules="rules1"  
          ref="ruleForm1"  
          label-width="80px" 
          label-position ="left">
          <el-form-item label="状态编辑" prop="status" >
            <el-select 
              v-model="ruleForm1.status" 
              style="width:100%" 
              placeholder="请选择状态">
            <el-option
                v-for="item in filters1"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="有效期" prop="time" v-show='this.ruleForm1.status !== "2"' >
            <el-date-picker type="date"
              placeholder="选择日期" 
              v-model="ruleForm1.time"
              :picker-options="pickerBeginDateBefore" 
              style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-button type="primary"  class="info-btn" :loading="loading" @click="submitEditForm('ruleForm1')">确定</el-button>
        </el-form>
      </div>
    </modal>
    <modal v-if="dialogVisible">
       <div slot="header">
        <span class="fl">提示</span>
        <span class="fr cursor" @click="close"><i class="el-icon-close"></i></span>
      </div>
      <div slot="body">
        <div class="confirm">确定拒绝吗？</div>
        <div>
           <el-button @click="calcelConfirm">取消</el-button>
           <el-button type="primary" @click="rejectConfirm" :loading="loading">确定</el-button>
        </div>
      </div>
    </modal>
  </div>
</template>
<script>
  import Modal from 'components/Modal'
  import { fetchUserList, userEdit, userReject ,fetchAllUser } from 'api/client'
  import qs from 'qs'
  import { mapGetters,mapMutations} from 'vuex'
  import { getToken, setToken} from 'utils/auth'


  export default {
    name: 'ziteng',
    data () {
      return {
        pickerBeginDateBefore:{
            disabledDate: (time) => {
              return time.getTime() < Date.now();
            }
        },
        pickerBeginDateAfter:{
            disabledDate: (time) => {
                return time.getTime() < Date.now();
            }
        },
        listLoading: false,
        colConfigs:[
          { prop: 'contract_name', label: '企业名称' },
          { prop: 'contact_name', label: '联系人' },
          { prop: 'mobile_number', label: '手机号' },
          { prop: 'start_time', label: '注册时间' },
        ],
        colConfigs1:[
          { prop: 'contract_name', label: '企业名称' },
          { prop: 'contact_name', label: '联系人' },
          { prop: 'mobile_number', label: '手机号' },
        ],
        loading:false,
        userList: [],
        userListAll: [],
        ruleForm: {
          startTime: '',
          endTime: ''
        },
        ruleForm1: {
          status: '',
          time: ''
        },
        rules: {
          startTime: [
            { required: true, message: '请输入日期', trigger: 'change' },
            // { pattern: /^1[34578]\d{9}$/, message: '手机号码输入不正确' }
          ],
          endTime: [
            { required: true,message: '请输入日期', trigger: 'change' }
          ]
        },
        rules1: {
          status: [
            { required: true, message: '请编辑状态', trigger: 'change' }
            // { pattern: /^1[34578]\d{9}$/, message: '手机号码输入不正确' }
          ],
          time: [
            { required: true,message: '请输入日期', trigger: 'change' }
          ]
        },
        pass:false,
        edit:false,
        activeName:'first',
        fPageNum:1,
        sPageNum:1,
        total:0,
        total1:0,
        // paginationShow:false,
        //注意此处的value设置为数字，对应的是后台返回数据的status字段
        // filters: [{text: '正常',value: '1'}, {text: '禁用',value: '2'}
        // ,{text: '未通过',value: '3'}],
        filters:[{text: '已启用',value: '1'}, {text: '暂停',value: '2'},{text: '已拒绝',value: '3'},{text: '已到期', value: '4'}],
        filters1:[{text: '已启用',value: '1'}, {text: '暂停',value: '2'}],
        // value: '',
        // value1:'',
        dialogVisible: false
        // tabHelp:true
      }
    },
    computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
      ...mapGetters([
        'ListByStatus',
        'clientList',
        'userInfo'
      ])
    },
    methods:{
      ...mapMutations([
      'setStatusList', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`
      'setClientList',
      'handleRemove',
      'handleUpdate',
      'SET_USERINTO'
    ]),
 
      // handleCurrentChange(val) {
      //   console.log(`当前页: ${val}`);
      // }
    handleCurrentChange(val) {
      this.fPageNum = val
      this.$router.replace({path:`/client-verify/index?tab=first&page=${this.fPageNum}`})
      this.fetchUserList()
      console.log(`当前页: ${val}`);
    },
    handleCurrentChange1(val) {
        this.sPageNum = val
        this.$router.replace({path:`/client-verify/index?tab=second&page=${this.sPageNum}`})
        this.fetchAllUser()
    },
    httpFn (flag, pageNum,fn, vuefn) {
      this.listLoading = true
        let pageSize = 10
        let data = `pageNum=${--pageNum}&pageSize=${pageSize}`
        fn(data).then((res) =>{
          let result = res.data
          if(result.code === 'ok') {
            vuefn(result.list)
            if(flag){
              this.total =result.meta.total_records
            }else{
              this.total1 =result.meta.total_records
            }
          }
          this.listLoading = false
        }).catch(()=>{
          this.listLoading = false
        })
    },
    fetchUserList () {
      this.httpFn(true, this.fPageNum, fetchUserList, this.setStatusList)
        // this.listLoading = true
        // // 处理pageNum 默认是0
        // let pageNum = this.fPageNum
        // let pageSize = 10
        // let data = `pageNum=${pageNum}&pageSize=${pageSize}`
        // fetchUserList(data).then((res) =>{
        //   let result = res.data
        //   if(result.code === 'ok') {
        //     this.setStatusList(res.data.list)
        //   }
        //   this.listLoading = false
        // }).catch(()=>{
        //   this.listLoading = false
        // })
      },
      fetchAllUser(){
        this.httpFn(false, this.sPageNum, fetchAllUser, this.setClientList)
      },
      filterTag(value, row) {
        // 在这里处理数据
        return row.status === value;
      },
      changeStatus (val) {
        let result
        switch(val)
          {
          case '1':
            result = '已启用'
            break;
          case '2':
            result = '暂停'
            break;
          case '3':
            result = '已拒绝'
            break;
          case '4':
            result = '已到期'
            break;  
          default:
            result = ''
          }
          return result
      },

      tabChange (tab) {
        // tab 切换的时候不需要 每次都拉取列表，只在待审核列表处理数据的情况下，第一次切换到”客户列表“ 才需要重新拉取
        // 第一次拉取客户列表
        // 
        // let p1 = localStorage.getItem('zi-fPageNum')
        // let p2 = localStorage.getItem('zi-sPageNum')
        // let sPageNum
        // let fPageNum
        // if(p1) {
        //   fPageNum = p1
        // }else{
        //    fPageNum = this.sPageNum
        // }
        // if(p2) {
        //   sPageNum = p2
        // }else{
        //    sPageNum = this.sPageNum
        // }
        // // this.currentPage = parseInt(fPageNum)
        // // this.currentPage1 =  parseInt(sPageNum)
        // console.log('p1', parseInt(localStorage.getItem('zi-sPageNum')))
        // console.log('thisppp', this.sPageNum)

        if(tab.name === 'first') {
          this.$router.replace({path:`/client-verify/index?tab=first&page=${this.fPageNum}`})
          this.fetchUserList()
        }else if(tab.name === 'second') {
            this.$router.replace({path:`/client-verify/index?tab=second&page=${this.sPageNum}`})
            this.fetchAllUser()
        }
        // 储存两个tab标签页的页数到localStorage
        // localStorage.setItem('zi-fPageNum', this.fPageNum)
        // localStorage.setItem('zi-sPageNum',this.sPageNum)
      },
      passVerify (id, status) {
        this.pass = true;
        status = "1";
        // 客户通过，待审核通过操作
        this.submitData  = {id, status};
      },
      reject (id) {
        this.dialogVisible = true
        this.currentId = id
      },
      calcelConfirm () {
        this.dialogVisible = false
      },
      rejectConfirm () {
        this.loading = true
        // 处理拒绝逻辑,处理完逻辑设置dialogVisible false
        let data = this.currentId
        userReject(data).then((res) =>{
          let data = res.data
          if(data.code === 'ok'){
            this.loading = false
            // this.dialogVisible = false
            // 重新拉取数据
            // this.fetchUserList1()
            // 不用重新拉取 用 vuex管理
            let id = data.data.id
            this.handleRemove(id)
            // this.tabHelp = true
            this.close()
          }else{
            this.$message({
              message: '请稍后尝试',
              type: 'error',
              duration: 2* 1000
            });
          }
        }).catch(()=>{
          this.loading = false
          // this.dialogVisible = false
          this.close()
        })
      },
      handleClose () {
        this.dialogVisible = false
      },
      close () {
        this.pass = false
        this.edit = false
        this.dialogVisible = false
        if(this.ruleForm.startTime && this.ruleForm.endTime) {
          this.$refs.ruleForm.resetFields();
        }
        if(this.ruleForm1.status || this.ruleForm1.time){
          this.$refs.ruleForm1.resetFields();
        }
      },
      startEdit (id, status,stTime, edTime) {
        this.edit = true
        let startTime = new Date(stTime).getTime()
        // 默认的startTime是现在
        // console.log('startTime',startTime)
        if(!stTime){
          startTime = Date.now()
        }
        // if(status == "1") {
        //   console.log(2222)
        this.ruleForm1.time = edTime;
        this.ruleForm1.status = status;
        // }
        this.submitData = {id,startTime}
      },
      setAlert(text) {
        this.$alert(text,'提示', {
          type:'error',
          lockScroll:true,
          showConfirmButton:false
        })
      },
      validateTime () {
        let diff = this.ruleForm.startTime.getTime() - this.ruleForm.endTime.getTime()
        if(diff > 0) {
          this.setAlert('开始日期不能大于结束日期')
          return false
        }
        return true
      },
      changeData () {
        let time1= this.ruleForm.startTime.getTime()
        let time2= this.ruleForm.endTime.getTime()
        this.$set(this.submitData, 'startTime', time1)
        this.$set(this.submitData, 'expiredTime', time2)
      },
      submitEditForm(formName) {
        this.$refs[formName].validate(valid => {
          if(valid) {
            this.loading = true
            let status = this.ruleForm1.status
            let expiredTime = new Date(this.ruleForm1.time).getTime()
            this.$set(this.submitData, 'expiredTime', expiredTime)
            this.$set(this.submitData, 'status', status)
            let data = qs.stringify(this.submitData)
            userEdit(data).then((res) =>{
              //更新cookie 
              let result = res.data
              if(result.code === 'ok') {
                let newObj = result.data
                let obj = Object.assign(newObj, this.userInfo)
                setToken(obj)
                this.SET_USERINTO(obj)
                this.handleUpdate(newObj)
                this.$refs[formName].resetFields();
                // 重新拉取列表 
                // 不用重新拉取，用vuex 管理
                // this.fetchAllUser1()
                this.close()
              }else{
                this.$message({
                  error: '请稍后尝试',
                  type: 'error',
                  duration: 2* 1000
                });
              }
              this.loading = false
            }).catch((res) =>{
                this.loading = false
              })
          }else {
            console.log('error submit!!')
            this.loading = false
            return false
          }
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          // 此处验证时间
          let timeResult = this.validateTime()
          if (valid && timeResult) {
              this.loading = true
              this.changeData();
              // 提交数据 this.submitData
              // 处理数据步骤 1. 提交对单一客户操作的结果 userEdit
              // 2. 重新拉取最新的待审核列表 fetchUserList
              let data = qs.stringify(this.submitData)
              userEdit(data).then((res) =>{
                let data = res.data
                if(data.code === 'ok') {
                  let newObj = data.data
                  let id = newObj.id
                  this.handleRemove(id)
                  this.$refs[formName].resetFields();
                  // 重新拉取待审核列表 此处不用table 加载图标，
                  // 开启 客户列表拉取数据 开关
                  // this.tabHelp = true
                  this.close()
                }else{
                  let timer = setInterval(function(){
                    this.listLoading = false;
                  },2000)
                  clearInterval(timer)
                  alert('请稍后处理')
                }
                this.loading = false
              }).catch((res) =>{
                this.loading = false
              })
          } else {
            console.log('error submit!!')
            this.loading = false
            return false
          }
        })
      }
    },
    created () {
      // 处理
      // console.log('activated') 处理query
      // let p1 = parseInt(localStorage.getItem('zi-fPageNum'))
      // let p2 = parseInt(localStorage.getItem('zi-sPageNum'))
      // if(p1) {
      //     this.fPageNum = p1
      // }
      // if(p2) {
      //    this.sPageNum = p2
      // }
      // this.handleCurrentChange(p1)
      // this.handleCurrentChange1(p2)
      // this.currentPage = parseInt(fPageNum)
      // this.currentPage1 =  parseInt(sPageNum)
      let query = this.$route.query.tab
      console.log('query', query)
      let tabObj
      if(query) {
        if( query=== 'second'){
          tabObj = {active:true,name:'second'}
          this.activeName = 'second'
        }else if(query=== 'first'){
          tabObj = {active:true,name:'first'}
          this.activeName = 'first'
        }
        this.tabChange(tabObj)
      }else{
        this.fetchUserList()
      }
    },
    components:{
      Modal
    }
  }
</script>
<style lang="stylus" scoped>
@import "~common/stylus/modal"
</style>