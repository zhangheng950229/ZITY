<template>
  <div class="zi-content">
    <tab :tabData="tabData" @tabChange="setActiveName">
    </tab>
    <first-tab :giveUpVisible="dialogVisible" :activeName="activeName" :hasClickSave="hasClickSave" @close="close"></first-tab>
  </div>
</template>
<script>
let tabData = [
  {label:'首页', name:'first'},
  {label:'抽奖页', name:'second'},
  {label:'中奖页', name:'third'},
  {label:'未中奖', name:'four'},
  {label:'结束页', name:'five'},
]
import FirstTab from '../firstTab'
import Tab from 'components/Tab'
export default {
  name: '',
  props:{
    hasClickSave: {
      type: Boolean,
      defautl: false
    },
    dialogVisible: {
      type: Boolean,
      defautl: false
    }
  },
  data() {
    return {
      activeName: 'first',
      tabData:tabData
    };
  },
  methods:{
    setActiveName (index) {
      // this.jsIndex= index
      this.activeName = this.tabData[index].name
    },
    close(){
      this.$emit('close')
    }
  },
  components:{
    FirstTab,
    Tab
  }
}
</script>
<style lang="stylus" scoped>
.zi-content
  background:#fff
  min-height:610px

</style>