<template>
  <div class="myaccount-bill">
    <!--数字货币交易-->
    <h3 class="my-title">{{$t('chongzhiTixian.text6')}}</h3>
    <div class="flex-form">
      <span class="bold">{{$t('chongzhiTixian.text16')}}</span>
      <div class="input-box">
        <el-date-picker
          v-model="startTime"
          :picker-options="pickerBeginDateBefore"
          format="yyyy-MM-dd"
          type="date"
          :placeholder="$t('bill.text3')">
        </el-date-picker>
      </div>
      <span class="text-l">{{$t('bill.text4')}}</span>
      <div class="input-box">
        <el-date-picker
          v-model="endTime"
          type="date"
          :picker-options="pickerBeginDateAfter"
          format="yyyy-MM-dd"
          :placeholder="$t('bill.text3')">
        </el-date-picker>
      </div>
      <div class="line"></div>
      <span class="bold">{{$t('chongzhiTixian.text34')}}</span>
      <div class="select-w">
        <div class="select-box" @click="isSelectBox = !isSelectBox">
          <div>{{currentStatus}}</div>
          <div class="icon" :class="{'rotate-icon': isSelectBox}"></div>
        </div>
        <ul class="select-uls" :class="{'hidden-box': isSelectBox}">
          <li class="select-list" v-for="(item, index) in statusArr" :key="index" @click="checkOne(item, index)">{{item}}</li>
        </ul>
      </div>
      <div class="line"></div>
      <div class="send-cha" @click="sendPageOne()">{{$t('bill.text5')}}</div>
    </div>
    <div class="table-wrapper">
      <ul class="table-uls">
        <li class="table-list">{{$t('bill.text35')}}</li>
        <li class="table-list">{{$t('bill.text2')}}</li>
        <li class="table-list">{{$t('chongzhiTixian.text34')}}</li>
        <li class="table-list">{{$t('bill.text16')}}</li>
        <li class="table-list">{{$t('chongzhiTixian.text12')}}</li>
        <li class="table-list">{{$t('bill.text17')}}</li>
        <li class="table-list">{{$t('bill.text18')}}</li>
        <li class="table-list">{{$t('bill.text7')}}</li>
        <li class="table-list">{{$t('bill.text8')}}</li>
      </ul>
      <v-loading v-show="loadingShow"></v-loading>
      <div class="no-result" v-show="noResult">
        <div class="load-more-box">
          <div class="loading-img">
            <img src="../../../assets/images/home/nodata.png" alt="">
          </div>
          <p class="desc">{{$t('myAccount.text1')}}</p>
        </div>
      </div>
      <ul class="table-uls" v-for="(item, index) in orderData" :key="index">
        <li class="table-list">{{item.id}}</li>
        <li class="table-list">{{$changeDate(item.createAt, '-', 8)}}</li>
        <li class="table-list">{{orderEtype(item.etype)}}</li>
        <li class="table-list">{{item.buyCurrency}}/{{item.sellCurrency}}</li>
        <li class="table-list">{{item.price | fourNumber}}</li>
        <li class="table-list">{{item.amount}}</li>
        <li class="table-list">{{item.tradeAmount}}</li>
        <li class="table-list">{{finishState(item.finishState)}}</li>
        <li class="table-list" v-if="item.finishState === 1">
          <span class="btn-shuzi cursor" @click="gotoInfo(item.id, item.orderState)">{{$t('bill.text19')}}</span>|<span class="btn-shuzi cursor" @click="cancelEntrust(item.id)">{{$t('bill.text20')}}</span>
        </li>
        <li class="table-list point-info red-color" @click="gotoInfo(item.id, item.orderState)" v-else>{{$t('bill.text19')}}</li>
      </ul>
      <v-turn-page :propsPage="totalPage" @orderLogTrunPage="parentTurnPage" ref="turnPage1"></v-turn-page>
    </div>
    <!--账户解锁弹窗-->
    <div class="myPopup" v-show="payPopupShow">
      <div class="myPopup-box">
        <div class="close" @click="closeIcon"><img src="../../../assets/images/home/Shutdown.png" alt=""></div>
        <div class="formDiv">
          <h3 class="title">{{$t('chongzhiTixian.text18')}}</h3>
          <p class="pay-price"></p>
          <h5 class="trade-password">{{$t('chongzhiTixian.text19')}}</h5>
          <input class="payPassword tradingCenter-input" type="password" v-model.trim="payPassword" :placeholder="$t('chongzhiTixian.text20')">
          <h5 class="trade-password">{{$t('chongzhiTixian.text21')}}</h5>
          <!--谷歌-->
          <div class="shortMsg">
            <div class="payMsg-box">
              <input class="payMsg tradingCenter-input" v-model.trim="payCode" :placeholder="$t('chongzhiTixian.text22')" type="number">
            </div>
          </div>
          <div class="errmsg-tips">{{payFailTip}}</div>
          <div class="pay-box">
            <button class="pay-btn" @click="closeIcon()">{{$t('chongzhiTixian.text23')}}</button>
            <button class="tradingCenter-btn" @click="confirmPay()">{{$t('chongzhiTixian.text24')}}</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 未设置验证码-->
    <div class="myPopup" v-if="setSafeVerific">
      <div class="myPopup-box" >
        <div class="close" @click="setSafeVerific = false"><img src="../../../assets/images/home/Shutdown.png" alt=""></div>
        <p class="error-text">{{$t('chongzhiTixian.text25')}}</p>
        <div class="pay-box">
          <button class="pay-btn" @click="closeIcon()">{{$t('chongzhiTixian.text23')}}</button>
          <button class="tradingCenter-btn" @click="$router.push('/account/googleAuthenticator')">{{$t('chongzhiTixian.text26')}}</button>
        </div>
      </div>
    </div>
    <!-- 文字弹窗-->
    <div class="myPopup" v-if="textDialog">
      <div class="myPopup-box">
        <div class="close" @click="textDialog = false"><img src="../../../assets/images/home/Shutdown.png" alt=""></div>
        <p class="error-text">{{textMsg}}</p>
        <div class="pay-box">
          <button class="tradingCenter-btn" @click="textDialog = false">{{$t('chongzhiTixian.text24')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      totalPage: 0,
      loadingShow: true,
      orderId: '',
      textMsg: '',
      textDialog: false,
      setSafeVerific: false,
      payPopupShow: false,
      payFailTip: '',
      payPassword: '',
      payCode: '',
      current_page: 0,
      orderData: [],
      pend: false,
      etypeOrder: '',
      noResult: false,
      currentStatus: this.$t('bill.text11'),
      isSelectBox: false,
      //        日期控件
      pickerBeginDateBefore: {
        disabledDate: (time) => {
          let beginDateVal = this.endTime
          if (beginDateVal) {
            return time.getTime() > beginDateVal
          }
        }
      },
      pickerBeginDateAfter: {
        disabledDate: (time) => {
          let beginDateVal = this.startTime
          if (beginDateVal) {
            return time.getTime() < beginDateVal
          }
        }
      },
      statusArr: [this.$t('bill.text11'), this.$t('chongzhiTixian.text28'), this.$t('chongzhiTixian.text29')],
      startTime: '',
      endTime: ''
    }
  },
  created () {
    this.gotoPage(1)
  },
  methods: {
    sendPageOne () {
      if (this.$refs.turnPage1) {
        this.$refs.turnPage1.resetPage(1)
      }
      this.gotoPage(1)
    },
    parentTurnPage (page) { // 页码
      this.current_page = page
      this.gotoPage(page)
    },
    // 订单列表
    gotoPage (page) {
      this.current_page = page
      let dataObj = {
        pageIndex: page,
        pageSize: '20'
      }
      if (this.etypeOrder) {
        dataObj.etype = this.etypeOrder
      }
      if (this.startTime) {
        dataObj.startDate = this.$changeDate(this.startTime, '-')
      }
      if (this.endTime) {
        dataObj.endDate = this.$changeDate(this.endTime, '-', 3)
      }
      this.$postAxios.post(`${this.$api}coinentrust/queryCoinEntrustList`, dataObj).then(res => {
        this.loadingShow = false
        if (res.data.status === 'success') {
          this.orderData = res.data.data
          this.totalPage = res.data.mapData.totalPage
        }
      })
    },
    gotoInfo (id) {
      this.$router.push({path: '/account/digicashOrder/digicashOrderDetail', query: {id: id}})
    },
    checkOne (item, index) {
      if (index === 0) {
        this.etypeOrder = ''
      } else {
        this.etypeOrder = index
      }
      this.currentStatus = item
      this.isSelectBox = false
    },
    orderEtype (status) { // 1: 买入  2:卖出
      if (status === 1) {
        return this.$t('chongzhiTixian.text28')
      } else if (status === 2) {
        return this.$t('chongzhiTixian.text29')
      }
    },
    // 关闭图标
    closeIcon () {
      this.setSafeVerific = false
      this.payPopupShow = false
      this.payFailTip = ''
      this.payPassword = ''
      this.payCode = ''
    },
    // 取消委托弹窗
    cancelEntrust (id) {
      this.orderId = id
      if (this.userData.openGoogleCode !== 2) {
        this.setSafeVerific = true
      } else {
        this.payPopupShow = true
      }
    },
    // 取消委托二次弹窗
    confirmPay () {
      this.payFailTip = ''
      if (this.payPassword === '') {
        this.payFailTip = this.$t('chongzhiTixian.text20')
      }
      if (this.payCode === '') {
        this.payFailTip = this.$t('chongzhiTixian.text22')
      }
      if (this.payPassword !== '' && this.payCode !== '') {
        this.$postAxios.post(`${this.$api}tx/unlock`, {
          tradePwd: this.payPassword,
          mobileCode: this.payCode,
          codeType: '1'
        }).then(res => {
          if (res.data.success === true) {
            this.$postAxios.post(`${this.$api}coinentrust/coinEntrustCancel`, {
              coinEntrustId: this.orderId
            }).then(res => {
              this.payPopupShow = false
              this.textDialog = true
              this.gotoPage(1)
              if (res.data.success === true) {
                this.textMsg = this.$t('chongzhiTixian.text27')
              } else {
                this.textMsg = res.data.msg
              }
            })
          } else {
            this.payFailTip = res.data.msg
          }
        })
      }
    },
    // 订单是否完成 1: 未完成 2:已完成
    finishState (status) {
      if (status === 1) {
        return this.$t('bill.text22')
      } else if (status === 2) {
        return this.$t('bill.text23')
      }
    }
  },
  computed: {
    ...mapGetters([
      'userData'
    ])
  },
  components: {
    vLoading: resolve => require(['@/components/loading.vue'], resolve),
    vTurnPage: resolve => require(['@/components/turnPage.vue'], resolve)
  }
}
</script>
