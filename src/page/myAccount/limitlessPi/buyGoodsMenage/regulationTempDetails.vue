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
            <div v-show="creaedShow">
              <div class="field">
                <label for="">{{$t('buyGoodsMenage.text33')}}</label>
                <div class="input-wrap">
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
              <div class="default-temp">
                <el-checkbox v-model="defaultTemp" @change="defaultChange">{{$t('buyGoodsMenage.text77')}}</el-checkbox>
              </div>
            </div>
            <div class="field" v-if="defaultTemp">
              <label for="">{{$t('buyGoodsMenage.text69')}}</label>
              <div class="input-wrap">
                <input class="input" ref="panicSetName" :placeholder="$t('buyGoodsMenage.text78')" @focus="checkVal('panicSetName')" @blur="checkInput('panicSetName', $event)" v-model.trim="panicSetName" type="text">
                <span class="error-tips" :class="{active: panicSetNameTips}">{{panicSetNameTips}}</span>
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
              <div class="input-wrap">
                <input class="input" ref="startPanicPrice" :placeholder="$t('buyGoodsMenage.text80')" v-model="startPanicPrice" @focus="checkVal('startPanicPrice')" @blur="checkInput('startPanicPrice', $event)" type="text">
                <span class="error-tips" :class="{active: startPanicPriceTips}">{{startPanicPriceTips}}</span>
              </div>
            </div>
            <div class="field">
              <label for="">{{$t('buyGoodsMenage.text82')}}</label>
              <div class="input-wrap">
                <el-select v-model="addPriceType"  :placeholder="$t('buyGoodsMenage.text81')">
                  <el-option
                    v-for="item in addPriceTypeOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span class="error-tips" :class="{active: addPriceTypeTips}">{{addPriceTypeTips}}</span>
              </div>
            </div>
            <!--  根据百分比价格加价  -->
            <div v-if="addPriceType === 1" style="margin: 20px 0;">
              <div class="field">
                <label for="">{{$t('buyGoodsMenage.text83')}}</label>
                <div class="input-wrap">
                  <el-select v-model="calcPriceType" :placeholder="$t('buyGoodsMenage.text84')">
                    <el-option
                      v-for="item in calcPriceTypeOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <span class="error-tips" :class="{active: calcPriceTypeTips}">{{calcPriceTypeTips}}</span>
                </div>
              </div>
              <div class="field">
                <label for="">{{$t('buyGoodsMenage.text39')}}</label>
                <div class="input-wrap">
                  <input class="input" ref="priceRate" :placeholder="$t('buyGoodsMenage.text85')" v-model="priceRate" @focus="checkVal('priceRate')" @blur="checkInput('priceRate', $event)" type="text">
                  <span class="unit">%</span>
                  <span class="error-tips" :class="{active: priceRateTips}">{{priceRateTips}}</span>
                </div>
              </div>
            </div>
            <!--  根据固定价格加价  -->
            <div class="field" v-if="addPriceType === 2">
              <label for="">{{$t('buyGoodsMenage.text39')}}</label>
              <div class="input-wrap">
                <input class="input" :placeholder="$t('buyGoodsMenage.text85')" v-model="priceRate" @focus="checkVal('priceRate')" @blur="checkInput('priceRate', $event)" type="text">
                <span class="unit">π</span>
                <span class="error-tips" :class="{active: priceRateTips}">{{priceRateTips}}</span>
              </div>
            </div>
            <div class="field">
              <label for="">{{$t('buyGoodsMenage.text41')}}</label>
              <div class="input-wrap">
                <input class="input" ref="topHourTime" :placeholder="$t('buyGoodsMenage.text86')" v-model="topHourTime" @focus="checkVal('topHourTime')" @blur="checkInput('topHourTime', $event)" type="text">
                <span class="error-tips" :class="{active: topHourTimeTips}">{{topHourTimeTips}}</span>
              </div>
            </div>
            <div class="field">
              <label for="">{{$t('buyGoodsMenage.text42')}}</label>
              <div class="input-wrap">
                <input class="input" ref="addTime" :placeholder="$t('buyGoodsMenage.text87')" v-model="addTime" @focus="checkVal('addTime')" @blur="checkInput('addTime', $event)" type="text">
                <span class="error-tips" :class="{active: addTimeTips}">{{addTimeTips}}</span>
              </div>
            </div>
            <div class="field">
              <label for="">{{$t('buyGoodsMenage.text43')}}</label>
              <div class="input-wrap">
                <el-date-picker
                  v-model="startDate"
                  type="datetime"
                  :picker-options="pickerOptions"
                  :default-time="defaultTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @change="checkTime"
                  :placeholder="$t('buyGoodsMenage.text88')">
                </el-date-picker>
                <span class="error-tips" ref="startDate" :placeholder="$t('buyGoodsMenage.text89')" :class="{active: startDateTips}">{{startDateTips}}</span>
              </div>
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
              <div class="input-wrap">
                <input class="input" ref="panicMoreRate" :placeholder="$t('buyGoodsMenage.text90')" v-model="panicMoreRate" @focus="checkVal('panicMoreRate')" @blur="checkInput('panicMoreRate', $event)" type="text">
                <span class="unit">%</span>
                <span class="error-tips" :class="{active: panicMoreRateTips}">{{panicMoreRateTips}}</span>
              </div>
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
              <div class="input-wrap">
                <input class="input" ref="daiLiRate" :placeholder="$t('buyGoodsMenage.text90')" v-model="daiLiRate" @focus="checkVal('daiLiRate')" @blur="checkInput('daiLiRate', $event)" type="text">
                <span class="unit">%</span>
                <span class="error-tips" :class="{active: daiLiRateTips}">{{daiLiRateTips}}</span>
              </div>
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
                  <td width="40%">{{$t('buyGoodsMenage.text49')}}</td>
                  <td width="40%">{{$t('buyGoodsMenage.text45')}}（%）</td>
                  <td width="20%">{{$t('buyGoodsMenage.text71')}}</td>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in treeArray"
                  :key="index"
                >
                  <template v-if="item.state">
                    <td>{{item.algebra}}</td>
                    <td>{{item.scale}}%</td>
                    <td>
                      <a href="javascript:;" class="red-color" @click="execItem({type: 'delete', index: index, arr: 'treeArray'})">{{$t('buyGoodsMenage.text73')}}</a>
                    </td>
                  </template>
                  <template v-else-if="paincSetId > 0 && item.state === true">
                    <td>{{item.index}}</td>
                    <td>{{item.rate}}%</td>
                    <td>
                      <a href="javascript:;" class="red-color" @click="execItem({type: 'delete', index: item.index, arr: 'treeArray'})">{{$t('buyGoodsMenage.text73')}}</a>
                    </td>
                  </template>
                  <template v-else>
                    <td>
                      <div class="table-select">
                        <el-select v-model="item.algebra"  :placeholder="$t('buyGoodsMenage.text91')">
                          <el-option
                            v-for="item in 10"
                            :key="item"
                            v-if="checkOption(item)"
                            :value="item">
                          </el-option>
                        </el-select>
                      </div>
                    </td>
                    <td>
                      <input type="text" v-model="item.scale" class="table-input" :placeholder="$t('buyGoodsMenage.text90')">
                    </td>
                    <td>
                      <a href="javascript:;" class="blue-color" @click="execItem({type: 'save', index: index, arr: 'treeArray'})">{{$t('buyGoodsMenage.text93')}}</a>
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
            <a href="javascript:;" v-show="treeArray.length < 10" class="add" @click="addItem('treeArray')">+ {{$t('buyGoodsMenage.text94')}}</a>
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
                  <td width="40%">{{$t('buyGoodsMenage.text51')}}</td>
                  <td width="40%">{{$t('buyGoodsMenage.text45')}}（%）</td>
                  <td width="20%">{{$t('buyGoodsMenage.text71')}}</td>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in queueArray"
                  :key="index"
                >
                  <template v-if="item.state">
                    <td>{{$t('buyGoodsMenage.text52')}}{{index + 1}}{{$t('buyGoodsMenage.text53')}}</td>
                    <td>{{item.scale}}%</td>
                    <td>
                      <a href="javascript:;" class="red-color" @click="execItem({type: 'delete', index: index, arr: 'queueArray'})">{{$t('buyGoodsMenage.text73')}}</a>
                    </td>
                  </template>
                  <template v-else-if="paincSetId > 0 && item.state === true">
                    <td>{{$t('buyGoodsMenage.text52')}}{{item.index}}{{$t('buyGoodsMenage.text53')}}</td>
                    <td>{{item.rate}}%</td>
                    <td>
                      <a href="javascript:;" class="red-color" @click="execItem({type: 'delete', index: item.index, arr: 'queueArray'})">{{$t('buyGoodsMenage.text73')}}</a>
                    </td>
                  </template>
                  <template v-else>
                    <td>{{$t('buyGoodsMenage.text52')}}{{index + 1}}{{$t('buyGoodsMenage.text53')}}</td>
                    <td>
                      <input type="text" v-model="item.scale" class="table-input" :placeholder="$t('buyGoodsMenage.text90')">
                    </td>
                    <td>
                      <a href="javascript:;" class="blue-color" @click="execItem({type: 'save', index: index, arr: 'queueArray'})">{{$t('buyGoodsMenage.text93')}}</a>
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
            <a href="javascript:;" class="add" v-show="queueArray.length < 10" @click="addItem('queueArray')">+ {{$t('buyGoodsMenage.text95')}}</a>
            <div class="tips">{{$t('buyGoodsMenage.text97')}}</div>
            <div class="btn-wrap">
              <button class="cancle cursor" @click="gotoPre">{{$t('setSharePay.text10')}}</button>
              <button class="btn" @click="submit">{{$t('buyGoodsMenage.text93')}}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Dialog from '@/components/dialog/dialog'
export default {
  data () {
    return {
      creaedShow: true,
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
      ruleTemp: '',
      ruleTempOption: [],
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
      startDateTips: '',
      roundIdStr: '',
      tempId: 0
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
    if (this.$route.query.idArr) {
      this.startDate = this.$changeDate(new Date(new Date().getTime() + 60000), '-', 8)
      this.roundIdStr = JSON.parse(this.$route.query.idArr).join(',')
    }
    if (this.$route.query.rundId) {
      this.startDate = this.$changeDate(new Date(new Date().getTime() + 60000), '-', 8)
    }
    if (this.paincSetId > 0 || this.$route.query.myId) {
      this.paincSetId = this.$route.query.myId || this.paincSetId
      this.getpaincSetDetails()
    }
    if (this.$route.query.addFlag) {
      this.startDate = this.$changeDate(new Date(new Date().getTime() + 60000), '-', 8)
      this.creaedShow = false
      this.defaultTemp = true
    }
    this.gotoPage()
  },
  methods: {
    defaultChange () {
    },
    changeRule (val) {
      this.gotoPage()
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
    gotoPage () {
      this.$postAxios.post(`${this.$api2}infinite/queryInfinitePaincSetList`, {
        includeSys: '1',
        pageIndex: 1,
        pageSize: '10000'
      }).then(res => {
        if (res.data.status === 'success') {
          this.ruleTempOption = res.data.data.infinitePaniceSetList
//          let ruleTemp = this.ruleTempOption[this.ruleTempOption.length - 1]
//          if (this.$route.query.myId) {
//            this.tempId = ruleTemp.id
//            this.ruleTemp = ruleTemp.panicSetName
//            this.startPanicPrice = ruleTemp.startPanicPrice
//            this.priceRate = ruleTemp.priceRate
//            this.addTime = ruleTemp.addTime
//            this.topHourTime = ruleTemp.topHourTime
//            this.startDate = this.$changeDate(new Date(new Date().getTime() + 60000), '-', 8)
//            this.panicMoreRate = ruleTemp.panicMoreRate
//            this.daiLiRate = ruleTemp.daiLiRate
//            let queueArray = JSON.parse(ruleTemp.roundJson)
//            let queueArray2 = []
//            queueArray.forEach(item => {
//              let queueObj = {}
//              queueObj.state = true
//              queueObj.index = item.index
//              queueObj.scale = item.rate
//              queueArray2.push(queueObj)
//            })
//            this.queueArray = queueArray2
//            let treeArray = JSON.parse(ruleTemp.parentJson)
//            let treeArray2 = []
//            treeArray.forEach(item => {
//              let treeObj = {}
//              treeObj.state = true
//              treeObj.algebra = item.index
//              treeObj.scale = item.rate
//              treeArray2.push(treeObj)
//            })
//            this.treeArray = treeArray2
//          }
        }
      })
    },
    // 详情
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
    checkTime () {
      if (new Date(this.startDate).getTime() < Date.now()) {
        this.startDateTips = this.$t('buyGoodsMenage.text58')
      } else {
        this.startDateTips = ''
      }
    },
    // 增加一条item
    addItem (arr) {
      // 如果数组不为空，并且最后一条的state为false的话，说明未保存
      let len = this[arr].length
      if (len && !this[arr][len - 1].state) {
        Dialog({
          title: this.$t('buyGoodsMenage.text59'),
          content: this.$t('buyGoodsMenage.text98')
        })
      } else {
        let item = {
          scale: '', // 比列
          state: false // 状态
        }
        // 如果是树形奖励增加algebra字段
        if (arr === 'treeArray') {
          item.algebra = '' // 代数
        }
        this[arr].push(item)
      }
    },
    // 保存或删除item
    execItem ({type, index, arr}) {
      if (type === 'save') {
        // 保存记录
        let currentItem = this[arr][index]
        let scaleVal = currentItem.scale
        let algebraFlag = false
        if (currentItem.scale <= 0) {
          Dialog({
            title: this.$t('buyGoodsMenage.text59'),
            content: this.$t('transfer.text4')
          })
          return
        }
        if (!/^\d{1,2}$/.test(currentItem.scale)) {
          Dialog({
            title: this.$t('buyGoodsMenage.text59'),
            content: this.$t('header.text14')
          })
          return
        }
        // 如果是树形奖励需要检测algebra字段
        if (currentItem.hasOwnProperty('algebra')) {
          if (!currentItem.algebra) {
            Dialog({
              title: this.$t('buyGoodsMenage.text59'),
              content: this.$t('buyGoodsMenage.text61')
            })
            return
          }
          algebraFlag = true
        }
        if (!scaleVal) {
          Dialog({
            title: this.$t('buyGoodsMenage.text59'),
            content: this.$t('buyGoodsMenage.text62')
          })
        } else {
          let item = {
            scale: scaleVal,
            state: true
          }
          if (algebraFlag) {
            item.algebra = currentItem.algebra
          }
          // 修改数组对应index的记录
          this[arr].splice(index, 1, item)
        }
      } else {
        // 删除数组对应index的记录
        this[arr].splice(index, 1)
      }
    },
    checkInput (field, e) {
      let val = this[field]
      if (val === '') {
        this[field + 'Tips'] = e.target.getAttribute('placeholder')
        return
      }
      if (field === 'startPanicPrice') {
        let reg = /^[0-9]+\.?[0-9]{0,4}$/
        if (val > 10000000000) {
          this[field + 'Tips'] = this.$t('header.text12')
        } else if (!reg.test(val)) {
          this[field + 'Tips'] = this.$t('header.text13')
        }
      }
      // 加价增幅、所有奖励比例：只能填写两位整数
      if (field === 'priceRate' || field === 'panicMoreRate' || field === 'daiLiRate') {
        let reg = /^\d{1,2}$/
        if (this.addPriceType === 2) {
          let reg = /^[0-9]+\.?[0-9]{0,2}$/
          if (val > 10000000000) {
            this[field + 'Tips'] = this.$t('header.text12')
          } else if (!reg.test(val)) {
            this[field + 'Tips'] = this.$t('transfer.text11')
          }
        } else {
          if (!reg.test(val)) {
            this[field + 'Tips'] = this.$t('header.text14')
          }
        }
      }
      // 有效时间上限：只能填写整数
      if (field === 'topHourTime') {
        let reg = /^([1-9][0-9]*)$/
        if (!reg.test(val)) {
          this[field + 'Tips'] = this.$t('buyGoodsMenage.text65')
        }
      }
      // 每次出价增加时间：只能填写整数，不能大于有效时间上限
      if (field === 'addTime') {
        let reg = /^([1-9][0-9]*)$/
        if (!reg.test(val) || val > this.topHourTime * 60) {
          this[field + 'Tips'] = this.$t('buyGoodsMenage.text66')
        }
      }
    },
    checkVal (field) {
      this[field + 'Tips'] = ''
    },
    // 检查当前option能否显示
    checkOption (index) {
      // 如果当前option的值已经存在于已保存treeArray数组里algebra(代数)字段，不让其显示
      let result = this.treeArray.some(item => {
        return item.algebra === index
      })
      return !result
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
    gotoPre () {
      this.$router.go(-1)
    },
    submit () {
      this.checkAllFidld()
      let arrFlag = true
      if (this.queueArray.length > 0) {
        this.queueArray.forEach((item, index) => {
          if (!item.state) {
            Dialog({
              title: this.$t('buyGoodsMenage.text59'),
              content: this.$t('buyGoodsMenage.text98')
            })
            arrFlag = false
          }
          if (!item.scale) {
            Dialog({
              title: this.$t('buyGoodsMenage.text59'),
              content: this.$t('buyGoodsMenage.text62')
            })
            arrFlag = false
          }
        })
      }
      if (this.treeArray.length > 0) {
        this.treeArray.forEach((item, index) => {
          if (!item.algebra) {
            Dialog({
              title: this.$t('buyGoodsMenage.text59'),
              content: this.$t('buyGoodsMenage.text61')
            })
            arrFlag = false
          }
          if (!item.scale) {
            Dialog({
              title: this.$t('buyGoodsMenage.text59'),
              content: this.$t('buyGoodsMenage.text62')
            })
            arrFlag = false
          }
          if (!item.state) {
            Dialog({
              title: this.$t('buyGoodsMenage.text59'),
              content: this.$t('buyGoodsMenage.text98')
            })
            arrFlag = false
          }
        })
      }
//      if (new Date(this.startDate).getTime() < Date.now()) {
//        let el = this.$refs.startDate
//        this.scroll(this.elOffset(el))
//        this.startDateTips = this.$t('buyGoodsMenage.text58')
//      } else
      if (arrFlag === true) {
        this.startDateTips = ''
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
          // 批量编辑
          if ((this.$route.query.idArr || this.$route.query.rundId) && !this.$route.query.myId) {
            let formData2 = new FormData()
            if (this.$route.query.rundId) {
              formData2.append('roundIdStr', this.$route.query.rundId)
            } else {
              formData2.append('roundIdStr', this.roundIdStr)
            }
            if (this.defaultTemp === true) {
              formData2.append('createFlag', '1')
              formData2.append('startDate', this.startDate) // 抢购开始时间
              formData2.append('startPanicPrice', this.startPanicPrice) // 初始价格
              formData2.append('priceRate', this.priceRate) // 加价涨幅比例或固定价格
              formData2.append('addTime', this.addTime) // 抢购增加时间
              formData2.append('topHourTime', this.topHourTime) // 增加时间上限
              formData2.append('panicMoreRate', this.panicMoreRate) // 最高出价奖励
              formData2.append('daiLiRate', this.daiLiRate) // 代理商奖励比例
              formData2.append('addPriceType', this.addPriceType) // 加价方式 1百分比 2固定价格
              if (this.addPriceType === 1) {
                formData2.append('addPriceMode', this.calcPriceType) // 百分比加价计算方式 1根据初始价格 2根据最新价格
              }
              if (this.defaultTemp === true) {
                formData2.append('panicSetName', this.panicSetName) // 规则名称
              } else {
                formData2.append('panicSetName', this.ruleTemp) // 规则名称
              }
              if (roundJson.length > 0) {
                formData2.append('roundJson', JSON.stringify(roundJson)) // 轮循(队列)奖励json
              }
              if (parentJson.length > 0) {
                formData2.append('parentJson', JSON.stringify(parentJson)) // 上级(树形)奖励json
              }
            } else {
              if (this.$route.query.myId) {
                formData2.append('paincSetId', this.$route.query.myId)
              } else {
                formData2.append('paincSetId', this.tempId)
              }
            }
            this.$http.post(`${this.$api2}infinite/infiniteRoundAddPanicSet`, formData2).then(res => {
              if (res.data.status === 'success') {
                Dialog({
                  title: this.$t('buyGoodsMenage.text40'),
                  content: '',
                  okFn: () => {
                    this.$router.go(-1)
                  }
                })
              } else {
                Dialog({
                  title: res.data.msg,
                  content: ''
                })
              }
            })
          } else { // 抢购规则模版 进入 -- 保存
            let formData = new FormData() // panicSetName
            formData.append('startPanicPrice', this.startPanicPrice)
            formData.append('priceRate', this.priceRate)
            formData.append('addTime', this.addTime)
            formData.append('topHourTime', this.topHourTime)
            formData.append('startDate', this.startDate)
            formData.append('panicMoreRate', this.panicMoreRate)
            formData.append('daiLiRate', this.daiLiRate)
            formData.append('addPriceType', this.addPriceType)
            if (this.addPriceType === 1) {
              formData.append('addPriceMode', this.calcPriceType) // 百分比加价计算方式 1根据初始价格 2根据最新价格
            }
            if (this.defaultTemp === true) {
              formData.append('panicSetName', this.panicSetName) // 规则名称
            } else {
              formData.append('panicSetName', this.ruleTemp)
            }
            if (roundJson.length > 0) {
              formData.append('roundJson', JSON.stringify(roundJson))
            }
            if (parentJson.length > 0) {
              formData.append('parentJson', JSON.stringify(parentJson))
            }
            if (this.defaultTemp === true) {
              formData.append('flag', '1')
            } else {
              formData.append('flag', '2')
              formData.append('paincSetId', this.paincSetId)
            }
            this.$http.post(`${this.$api2}infinite/saveInfiniteSetInfo`, formData).then(res => {
              if (res.data.status === 'success') {
                let tempFlag = ''
                if (this.defaultTemp === true) { // 新创建
                  tempFlag = 1
                }
                Dialog({
                  title: this.$t('buyGoodsMenage.text40'),
                  content: '',
                  okFn: () => {
                    if (this.$route.query.myId) {
                      this.$router.push({
                        path: '/account/regulationTemp/ruleOptions',
                        query: {
                          myId: this.$route.query.myId,
                          rundId: this.$route.query.rundId,
                          mId: this.$route.query.mId,
                          tempFlag: tempFlag
                        }
                      })
                    } else {
                      this.$router.go(-1)
                    }
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
        }
      }
    },
    checkAllFidld () {
      // 需要验证的字段
      let fields = [
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
      if (this.defaultTemp === true) {
        fields.unshift('panicSetName')
      }
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
      padding-top: 9px;
      font-size: 20px;
      font-weight: bold;
      padding-left: 10%;
      margin-right: 80px;
      width: 280px;
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
    .btn-wrap{
      text-align: center;
      .btn{
        margin-left: 38px;
      }
    }
    .delete{
      color: @red;
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
    /deep/ .el-select {
      width: 100%;
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
      right: 63px;
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
