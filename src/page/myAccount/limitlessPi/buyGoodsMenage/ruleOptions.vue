<template>
  <div class="page-limit">
    <div class="location">
      <router-link to="/account/regulationTemp">{{$t('buyGoodsMenage.text30')}}</router-link><span>》</span>{{$t('buyGoodsMenage.text31')}}
    </div>
    <div class="title">{{$t('buyGoodsMenage.text30')}}</div>
    <div class="content">
      <div class="section">
        <div class="flex">
          <div class="sub-title">{{$t('buyGoodsMenage.text32')}}</div>
          <div class="sub-content from">
            <!--<div class="field">-->
              <!--<label for="">{{$t('buyGoodsMenage.text33')}}</label>-->
              <!--<div class="input-wrap">{{$t('buyGoodsMenage.text34')}}</div>-->
            <!--</div>-->
            <div class="field">
              <label for="">{{$t('buyGoodsMenage.text35')}}</label>
              <div class="input-wrap input-select">
                <el-select v-model="ruleTemp"  placeholder="" @change="changeRule">
                  <el-option
                    v-for="(item, index) in ruleTempOption"
                    :key="index"
                    :label="item.panicSetName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="flex">
          <div class="sub-title">{{$t('buyGoodsMenage.text36')}}</div>
          <div class="sub-content from">
            <div class="field">
              <label for="">{{$t('buyGoodsMenage.text37')}}</label>
              <div class="input-wrap">{{startPanicPrice}} π</div>
            </div>
            <!--  根据百分比价格加价  -->
            <div v-if="addPriceType === 1" style="margin: 20px 0;">
              <div class="field">
                <label for="">{{$t('buyGoodsMenage.text38')}}</label>
                <div class="input-wrap">{{calcPriceTypeOption[calcPriceType - 1].label}}</div>
              </div>
              <div class="field">
                <label for="">{{$t('buyGoodsMenage.text39')}}</label>
                <div class="input-wrap">{{priceRate}}</div>
              </div>
            </div>
            <!--  根据固定价格加价  -->
            <div class="field" v-if="addPriceType === 2">
              <label for="">{{$t('buyGoodsMenage.text39')}}</label>
              <div class="input-wrap">{{priceRate}}</div>
            </div>
            <div class="field">
              <label for="">{{$t('buyGoodsMenage.text41')}}</label>
              <div class="input-wrap">{{topHourTime}}</div>
            </div>
            <div class="field">
              <label for="">{{$t('buyGoodsMenage.text42')}}</label>
              <div class="input-wrap">{{addTime}}</div>
            </div>
            <div class="field">
              <label for="">{{$t('buyGoodsMenage.text43')}}</label>
              <div class="input-wrap">{{startDate}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="flex">
          <div class="sub-title">{{$t('buyGoodsMenage.text44')}}</div>
          <div class="sub-content from">
            <div class="field">
              <label for="">{{$t('buyGoodsMenage.text45')}}</label>
              <div class="input-wrap">{{panicMoreRate}} %</div>
            </div>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="flex">
          <div class="sub-title">{{$t('buyGoodsMenage.text46')}}</div>
          <div class="sub-content from">
            <div class="field">
              <label for="">{{$t('buyGoodsMenage.text45')}}</label>
              <div class="input-wrap">{{daiLiRate}} %</div>
            </div>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="flex">
          <div class="sub-title">{{$t('buyGoodsMenage.text47')}}</div>
          <div class="sub-content table">
            <div class="fr">{{$t('buyGoodsMenage.text48')}}：<span>{{totalTreeReward}}%</span></div>
            <table>
              <thead>
              <tr>
                <td width="50%">{{$t('buyGoodsMenage.text49')}}</td>
                <td width="50%">{{$t('buyGoodsMenage.text45')}}（%）</td>
              </tr>
              </thead>
              <tbody>
              <tr
                v-for="(item, index) in treeArray"
                :key="index"
              >
                <template>
                  <td>{{item.algebra}}</td>
                  <td>{{item.scale}}%</td>
                </template>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="flex">
          <div class="sub-title">{{$t('buyGoodsMenage.text50')}}</div>
          <div class="sub-content table">
            <div class="fr">{{$t('buyGoodsMenage.text48')}}：<span>{{totalQueueReward}}%</span></div>
            <table>
              <thead>
              <tr>
                <td width="50%">{{$t('buyGoodsMenage.text51')}}</td>
                <td width="50%">{{$t('buyGoodsMenage.text45')}}（%）</td>
              </tr>
              </thead>
              <tbody>
              <tr
                v-for="(item, index) in queueArray"
                :key="index"
              >
                <template>
                  <td>{{$t('buyGoodsMenage.text52')}}{{index + 1}}{{$t('buyGoodsMenage.text53')}}</td>
                  <td>{{item.scale}}%</td>
                </template>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="btn-wrap">
        <button class="btn" @click="confimTemp">{{$t('addAccount.text24')}}</button>
        <button class="btn confim" @click="editorTemp">{{$t('compon.text4')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
  import Dialog from '@/components/dialog/dialog'
  export default {
    data () {
      return {
        ruleTemp: '',
        ruleTempOption: [],
        paincSetId: this.$route.query.id,
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 8.64e7 // 禁选当前以前的日期
          }
        },
        panicSetName: '', // 规则名称
        startPanicPrice: '', // 初始价格
        priceRate: '', // 加价涨幅比例或固定价格
        addTime: '', // 抢购增加时间
        topHourTime: '', // 增加时间上限
        startDate: '', // 抢购开始时间
        defaultTemp: false, // 是否设置为默认模板
        panicMoreRate: '', // 最高出价奖励
        daiLiRate: '', // 代理商奖励比例
        addPriceType: 1, // 加价方式
        addPriceTypeOption: [{ // 加价方式选项
          label: this.$t('buyGoodsMenage.text54'),
          value: 1
        }, {
          label: this.$t('buyGoodsMenage.text55'),
          value: 2
        }],
        calcPriceType: 1, // 加价计算方式
        calcPriceTypeOption: [{ // 加价计算选项
          label: this.$t('buyGoodsMenage.text56'),
          value: 1
        }, {
          label: this.$t('buyGoodsMenage.text57'),
          value: 2
        }],
        treeArray: [], // 树形奖励
        queueArray: [], // 队列奖励
        formFlag: false,
        // 表单验证提示
        panicSetNameTips: '',
        startPanicPriceTips: '',
        priceRateTips: '',
        addTimeTips: '',
        topHourTimeTips: '',
        addPriceTips: '',
        panicMoreRateTips: '',
        daiLiRateTips: '',
        calcPriceTypeTips: '',
        addPriceTypeTips: '',
        startDateTips: ''
      }
    },
    computed: {
      defaultTime () {
        let d = new Date()
        let time = ''
        time = `${d.getHours()}:${d.getMinutes() + 30}:00`
        return time
      },
      totalTreeReward () {
        return this.calcReward(this.treeArray)
      },
      totalQueueReward () {
        return this.calcReward(this.queueArray)
      }
    },
    created () {
      if (this.$route.query.myId && !this.$route.query.tempFlag) {
        this.paincSetId = this.$route.query.myId
        this.getpaincSetDetails()
      }
      this.gotoPage()
    },
    methods: {
      // 保存模板
      confimTemp () {
        let formData2 = new FormData()
        if (this.$route.query.rundId) {
          let roundIdStr2 = JSON.parse(this.$route.query.rundId)
          if (roundIdStr2.length > 1) {
            roundIdStr2 = JSON.parse(this.$route.query.rundId).join(',')
          }
          formData2.append('roundIdStr', roundIdStr2)
        }
        if (this.$route.query.idArr) {
          let roundIdStr = JSON.parse(this.$route.query.idArr).join(',')
          formData2.append('roundIdStr', roundIdStr)
        }
        if (Number(this.$route.query.tempFlag) === 1) {
          this.tempId = this.ruleTempOption[0].id
        } else if (this.$route.query.myId) {
          this.tempId = this.$route.query.myId
        }
        formData2.append('paincSetId', this.tempId)
        this.$http.post(`${this.$api2}infinite/infiniteRoundAddPanicSet`, formData2).then(res => {
          if (res.data.status === 'success') {
            let mid = this.$route.query.mId
            Dialog({
              title: this.$t('buyGoodsMenage.text40'),
              content: '',
              okFn: () => {
                this.$router.push({
                  path: '/account/buyGoodsMenage/buyGoodsMenageDetail',
                  query: {id: mid}
                })
              }
            })
          } else {
            Dialog({
              title: res.data.msg,
              content: ''
            })
          }
        })
      },
      // 编辑模板
      editorTemp () {
        let roundid
        if (this.$route.query.rundId) {
          roundid = this.$route.query.rundId
        }
        if (this.$route.query.idArr) {
          roundid = this.$route.query.idArr
        }
        this.$router.push({
          path: '/account/regulationTemp/regulationTempDetails',
          query: {
            myId: this.tempId,
            rundId: roundid,
            mId: this.$route.query.mId
          }
        })
      },
      // 详情
      gotoPage () {
        this.$postAxios.post(`${this.$api2}infinite/queryInfinitePaincSetList`, {
          includeSys: '1',
          pageIndex: 1,
          pageSize: '10000'
        }).then(res => {
          if (res.data.status === 'success') {
            this.ruleTempOption = res.data.data.infinitePaniceSetList
            if (!this.$route.query.myId && !this.$route.query.guizhiId) {
              let ruleTemp = this.ruleTempOption[this.ruleTempOption.length - 1]
              this.tempId = ruleTemp.id
              this.ruleTemp = ruleTemp.panicSetName
              this.startPanicPrice = ruleTemp.startPanicPrice
              this.priceRate = ruleTemp.priceRate
              this.addTime = ruleTemp.addTime
              this.topHourTime = ruleTemp.topHourTime
              this.startDate = this.$changeDate(ruleTemp.startDate, '-', 8)
              this.panicMoreRate = ruleTemp.panicMoreRate
              this.daiLiRate = ruleTemp.daiLiRate
              let queueArray = JSON.parse(ruleTemp.roundJson)
              let queueArray2 = []
              queueArray.forEach(item => {
                let queueObj = {}
                queueObj.state = true
                queueObj.index = item.index
                queueObj.scale = item.rate
                queueArray2.push(queueObj)
              })
              this.queueArray = queueArray2
              let treeArray = JSON.parse(ruleTemp.parentJson)
              let treeArray2 = []
              treeArray.forEach(item => {
                let treeObj = {}
                treeObj.state = true
                treeObj.algebra = item.index
                treeObj.scale = item.rate
                treeArray2.push(treeObj)
              })
              this.treeArray = treeArray2
            } else if (Number(this.$route.query.tempFlag) === 1) {
              let ruleTemp0 = this.ruleTempOption[0]
              this.tempId = ruleTemp0.id
              this.ruleTemp = ruleTemp0.panicSetName
              this.startPanicPrice = ruleTemp0.startPanicPrice
              this.priceRate = ruleTemp0.priceRate
              this.addTime = ruleTemp0.addTime
              this.topHourTime = ruleTemp0.topHourTime
              this.startDate = this.$changeDate(ruleTemp0.startDate, '-', 8)
              this.panicMoreRate = ruleTemp0.panicMoreRate
              this.daiLiRate = ruleTemp0.daiLiRate
              let queueArray = JSON.parse(ruleTemp0.roundJson)
              let queueArray2 = []
              queueArray.forEach(item => {
                let queueObj = {}
                queueObj.state = true
                queueObj.index = item.index
                queueObj.scale = item.rate
                queueArray2.push(queueObj)
              })
              this.queueArray = queueArray2
              let treeArray = JSON.parse(ruleTemp0.parentJson)
              let treeArray2 = []
              treeArray.forEach(item => {
                let treeObj = {}
                treeObj.state = true
                treeObj.algebra = item.index
                treeObj.scale = item.rate
                treeArray2.push(treeObj)
              })
              this.treeArray = treeArray2
            }
          }
        })
      },
      changeRule (val) {
        this.paincSetId = val
        this.queueArray = []
        this.treeArray = []
        this.getpaincSetDetails()
        this.ruleTempOption.forEach(item => {
          if (item.id === val) {
            this.tempId = item.id
            this.ruleTemp = item.panicSetName
          }
        })
      },
      // 计算总奖励
      calcReward (arr) {
        let sum = 0
        arr.forEach(item => {
          if (item.scale) {
            sum += parseInt(item.scale) || 0
          } else {
            sum += parseInt(item.rate) || 0
          }
        })
        return sum
      },
      getpaincSetDetails () {
        this.$postAxios.post(`${this.$api2}infinite/infinitePaincSetDetail`, {
          paincSetId: this.paincSetId
        }).then(res => {
          if (res.data.status === 'success') {
            let ret = res.data.data.infinitePaniceSet
            this.panicSetName = ret.panicSetName // 规则名称
            this.startPanicPrice = ret.startPanicPrice // 初始价格
            this.priceRate = ret.priceRate // 加价涨幅比例或固定价格
            this.addTime = ret.addTime // 抢购增加时间
            this.topHourTime = ret.topHourTime // 增加时间上限
            this.startDate = this.$changeDate(ret.startDate, '-', 8) // 抢购开始时间
            this.panicMoreRate = ret.panicMoreRate // 最高出价奖励
            this.daiLiRate = ret.daiLiRate // 代理商奖励比例
            this.addPriceType = ret.addPriceType // 加价方式 1百分比 2固定价格
            this.calcPriceType = ret.addPriceMode // 百分比加价计算方式 1根据初始价格 2根据最新价格
            this.ruleTemp = ret.panicSetName
//          if (this.panicSetName !== '默认模板') {
//            this.defaultTemp = true
//            this.ruleTemp = 2
//          } else {
//            this.defaultTemp = false
//            this.ruleTemp = 1
//          }
            if (ret.roundJson) { // 轮循(队列)奖励json
              let roundData = JSON.parse(ret.roundJson)
              roundData.forEach((item) => {
                let obj = {}
                obj.state = true
                obj.scale = item.rate
                obj.index = item.index
                this.queueArray.push(obj)
              })
            }
            if (ret.parentJson) { // 上级(树形)奖励json
              let parentData = JSON.parse(ret.parentJson)
              parentData.forEach((item) => {
                let obj = {}
                obj.state = true
                obj.algebra = item.index
                obj.scale = item.rate
                this.treeArray.push(obj)
              })
            }
          }
        }).catch(err => {
          console.log(err)
        })
      },
      submit () {
        this.checkAllFidld()
        if (this.formFlag) {
          let roundJson = []
          this.queueArray.forEach((item, index) => {
            let obj = {}
            obj.index = index + 1
            obj.rate = item.scale
            roundJson.push(obj)
          })
          let parentJson = []
          this.treeArray.forEach((item, index) => {
            let obj = {}
            obj.index = item.algebra
            obj.rate = item.scale
            parentJson.push(obj)
          })
          let dataObj = {
            panicSetName: this.panicSetName, // 规则名称
            startPanicPrice: this.startPanicPrice, // 初始价格
            priceRate: this.priceRate, // 加价涨幅比例或固定价格
            addTime: this.addTime, // 抢购增加时间
            topHourTime: this.topHourTime, // 增加时间上限
            startDate: this.startDate, // 抢购开始时间
            panicMoreRate: this.panicMoreRate, // 最高出价奖励
            daiLiRate: this.daiLiRate, // 代理商奖励比例
            roundJson: JSON.stringify(roundJson), // 轮循(队列)奖励json
            parentJson: JSON.stringify(parentJson), // 上级(树形)奖励json
            addPriceType: this.addPriceType, // 加价方式 1百分比 2固定价格
            addPriceMode: this.calcPriceType // 百分比加价计算方式 1根据初始价格 2根据最新价格
          }
          if (this.paincSetId > 0) {
            dataObj.flag = 2
            dataObj.paincSetId = this.paincSetId
          } else {
            dataObj.flag = 1
          }
          this.$postAxios.post(`${this.$api2}infinite/saveInfiniteSetInfo`, dataObj).then(res => {
            if (res.data.status === 'success') {
              Dialog({
                title: this.$t('buyGoodsMenage.text40'),
                content: '',
                okFn: () => {
                  this.$router.push('/account/regulationTemp')
                }
              })
            } else {
              Dialog({
                title: res.data.msg,
                content: ''
              })
            }
          })
        }
      },
      checkAllFidld () {
        // 需要验证的字段
        let fields = [
          'panicSetName',
          'startPanicPrice',
          'startPanicPriceTips',
          'priceRate',
          'priceRateTips',
          'topHourTime',
          'topHourTimeTips',
          'addTime',
          'addTimeTips',
          'startDate',
          'startDateTips',
          'panicMoreRate',
          'panicMoreRateTips',
          'daiLiRate',
          'daiLiRateTips'
        ]

        fields.every(field => {
          let res = false
          let str = this[field]

          if (field.includes('Tips')) {
            // 验证格式要求
            if (str) {
              let cutField = field.replace('Tips', '')
              let el = this.$refs[cutField]
              this.scroll(this.elOffset(el))
            } else {
              res = true
            }
          } else {
            // 验证是否非空
            if (!str) {
              let el = this.$refs[field]
              this[field + 'Tips'] = el.getAttribute('placeholder')
              this.scroll(this.elOffset(el))
            } else {
              res = true
            }
          }
          this.formFlag = res
          return res
        })
      },
      scroll (offset) {
        document.documentElement.scrollTop = offset
      },
      elOffset (el) {
        return el.getBoundingClientRect().top + document.documentElement.scrollTop - 200
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../../../../assets/css/limitlessPi';
  .content{
    background: #fff;
  }
  .section{
    line-height: 20px;
    padding: 40px 0;
    & + .section{
      border-top: 1px solid #e7e8ec;
    }
    .flex{
      display: flex;
    }
    .sub-title{
      font-size: 20px;
      font-weight: bold;
      padding-left: 10%;
      margin-right: 80px;
      width: 280px;
      @media screen and (max-width: 1400px){
        padding-left: 20px;
        width: 200px;
        margin-right: 40px;
      }
    }
    .sub-content{
      width: 580px;
    }
    .field{
      .justify;
      & + .field{
        margin-top: 20px;
      }
      position: relative;
      /deep/ .el-input__inner{
        font-size: 16px;
        padding-left: 30px;
      }
    }
    label{
      width: 140px;
      padding-right: 36px;
    }
    .input{
      padding: 10px 30px;
      height: 42px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      width: 440px;
      font-size: 16px;
      transition: border-color .2s;
      &:hover{
        border-color: #c0c4cc;
      }
      &:focus{
        border-color: #409EFF;
      }
    }
    .unit{
      position: absolute;
      top: 0;
      right: 14px;
      line-height: 44px;
    }
    td{
      border: 1px solid #e7e8ec;
      height: 44px;
      text-align: center;
      a{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }
    }
    thead td{
      color: #666;
    }
    .fr{
      text-align: right;
      margin-bottom: 30px;
      span{
        font-size: 20px;
        font-weight: bold;
      }
    }
    .add{
      border: 1px solid @yellow;
      color: @yellow;
      font-size: 16px;
      text-align: center;
      display: block;
      line-height: 48px;
      border-radius: 4px;
      margin-top: 20px;
    }
    .cancle{
      border: 1px solid @yellow;
      color: @yellow;
      font-size: 20px;
      text-align: center;
      line-height: 48px;
      border-radius: 4px;
      width: 200px;
      display: inline-block;
    }
    .gray-tips{
      font-size: 14px;
      color: #999;
      padding-top: 8px;
    }
    .tips{
      background: url('../../../../assets/images/limitlessPai/icon_wran.png') no-repeat left 0;
      padding-left: 30px;
      margin: 30px 0;
    }
    .delete{
      color: @red;
    }
  }
  .btn-wrap{
    margin-left: 360px;
    padding-bottom: 100px;
    .btn{
      margin-right: 38px;
      &.confim{
        border: 1px solid #ffba14;
        background-color: #fff;
        color: #ffba14;
      }
    }
  }
  .default-temp{
    margin: 5px 0 20px 142px;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 440px;
  }
  .no-data{
    text-align: center;
  }
  .input-wrap{
    position: relative;
    width: 440px;
    text-align: right;
    /deep/ .el-select {
      width: 100%;
    }
    &.input-select{
      width: 300px;
    }
    .error-tips{
      position: absolute;
      top: 40px;
      left: 0;
      color: @red;
      font-size: 14px;
      line-height: 1;
      background: url('../../../../assets/images/limitlessPai/icon_wran.png') no-repeat left center;
      background-size: 12px;
      padding-left: 18px;
      transition: .3s;
      &.active{
        top: 46px;
      }
    }
  }
  .table-input{
    text-align: center;
    line-height: 36px;
    font-size: 16px;
  }
  .table-select{
    // deep: 穿透子组件
    /deep/ .el-input__inner{
      text-align: center;
      border: none;
      text-align: center;
    }
    /deep/ ::-webkit-input-placeholder {
      color: #000;
    }
    /deep/ .el-input__inner{
      font-size: 16px;
    }
    /deep/ .el-input__suffix{
      right: 75px;
    }
    /deep/ .el-select .el-input .el-select__caret {
      color: #333;
    }
  }
</style>
<style>
  .el-checkbox__inner{
    border-color: #666;
    color: #333;
  }
  .el-input__inner{
    color: #000000;
  }
</style>
