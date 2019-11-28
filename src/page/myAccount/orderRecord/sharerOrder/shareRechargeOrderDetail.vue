<template>
  <div class="mybill-detail">
    <!--共享者订单--充值 详情-->
    <div class="router-navigation">
      <span class="link" @click="$router.push('/account/orderCashValue')" v-if="isBoss === 0">{{$t('chongzhiTixian.text44')}}</span>
      <span class="link" @click="$router.push('/account/sharerOrder')" v-else>{{$t('shareOrder.text1')}}</span>
      <span class="icon">》</span>
      <span class="link">{{$t('chongzhiTixian.text46')}}</span>
    </div>
    <h3 class="title-text">{{$t('chongzhiTixian.text46')}}</h3>
    <div class="details-box">
      <h3 class="title-details">{{$t('chongzhiTixian.text50')}}</h3>
      <h3 class="money" v-show="money"><span>{{money[0]}}</span>.<span class="xiaoshu">{{money[1]}}</span><span class="curren-money">{{orderData.currency}}</span></h3>
      <div class="order-box">
        <ul class="order-uls">
          <li class="order-list">
            <span class="order-text">{{$t('chongzhiTixian.text4')}}</span>
            <span class="order-text">{{orderData.id}}</span>
          </li>
          <li class="order-list">
            <span class="order-text">{{$t('chongzhiTixian.text5')}}</span>
            <span class="order-text" v-show="orderData.createAt">{{$changeDate(orderData.createAt)}}</span>
          </li>
          <li class="order-list" @click="showOrderPro">
            <span class="order-text">{{$t('chongzhiTixian.text34')}}</span>
            <div class="order-text status-text">
              <span>{{orderTypes(orderData, orderData.tipMsg)}}</span>
              <div class="icon-sanjiao"></div>
            </div>
          </li>
          <li class="order-list">
            <span class="order-text">{{$t('orderStatus.text2')}}</span>
            <span class="order-text">{{orderData.userNick}}</span>
          </li>
          <li class="account-info-list">
            <!-- 他的付款信息-->
            <div class="list-item" v-if="orderData.givemoneybank">
              <p class="list-item-text">{{$t('orderStatus.text3')}}</p>
              <div class="bank-box">
                <div class="bank-text">
                  <div class="bank-left">
                    <div class="circle"></div>
                    <p class="bankname">{{orderData.givemoneybank}}</p>
                  </div>
                  <p class="bank-right">{{orderData.givemoneyname}}</p>
                </div>
                <p class="word-bread">{{orderData.givemoneyaccount}}</p>
              </div>
            </div>
            <!--我的收款信息-->
            <div class="list-item" v-if="bossAccount.bankName">
              <p class="list-item-text">{{$t('orderStatus.text4')}}</p>
              <div class="bank-box">
                <div class="bank-text">
                  <div class="bank-left">
                    <div class="circle"></div>
                    <p class="bankname">{{bossAccount.bankName}}</p>
                  </div>
                  <p class="bank-right">{{bossAccount.realName}}</p>
                </div>
                <p class="word-bread">{{bossAccount.accountNumber}}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="btn-click-box">
        <div class="btn-click" v-if="orderData.orderState === 2 && orderData.payState === 1" @click="rejectOrder">{{$t('shareOrder.text22')}}</div>
        <div class="btn-click" v-if="orderData.orderState === 2 && orderData.payState === 1" @click="jiedanConfim">{{$t('shareOrder.text23')}}</div>
        <div class="btn-click" @click="payMoney" v-if="orderData.orderState === 2 && orderData.payState === 2">{{$t('shareOrder.text24')}}</div>
        <div class="btn-click" v-if="orderData.canHelp === 1" @click="$router.push({path: '/account/sharerOrder/rechargeAppeal', query: {id: orderId}})">{{$t('chongzhiTixian.text40')}}</div>
        <div class="btn-click" @click="comfimShoKuan" v-if="orderData.orderState === 3 && orderData.payState === 4">{{$t('chongzhiTixian.text36')}}</div>
        <div class="btn-click" @click="$router.push({path: '/account/sharerOrder/rechargeAppealDetail', query: {id: orderId}})" v-if="orderData.canHelp === 3">{{$t('chongzhiTixian.text41')}}</div>
      </div>
    </div>
    <!-- 订单进程弹窗-->
    <order-process :step-data="stepData" :last-status="lastStatus" :order-data="orderData" ref="showOrderProcess"></order-process>
    <!--支付弹窗-->
    <div class="myPopup" v-show="payPopupShow">
      <div class="myPopup-box">
        <div class="close" @click="closeIcon"><img src="../../../../assets/images/home/Shutdown.png" alt=""></div>
        <div class="formDiv">
          <h3 class="title">{{$t('chongzhiTixian.text33')}}</h3>
          <p class="pay-price">{{$t('chongzhiTixian.text45')}}{{orderData.amount | fourNumber}} USD</p>
          <h5 class="trade-password">{{$t('chongzhiTixian.text19')}}</h5>
          <input class="payPassword tradingCenter-input" type="password" v-model.trim="payPassword" :placeholder="$t('chongzhiTixian.text20')">
          <h5 class="trade-password">{{$t('chongzhiTixian.text21')}}</h5>
          <!--谷歌-->
          <div class="shortMsg">
            <div class="payMsg-box">
              <input class="payMsg tradingCenter-input" v-model.trim="payCode" :placeholder="$t('chongzhiTixian.text22')" type="number">
            </div>
          </div>
          <div class="errmsg-tips errmsg2-tips">{{payFailTip}}</div>
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
        <div class="close" @click="setSafeVerific = false"><img src="../../../../assets/images/home/Shutdown.png" alt=""></div>
        <p class="error-text">{{$t('chongzhiTixian.text25')}}</p>
        <div class="pay-box">
          <button class="pay-btn" @click="closeIcon()">{{$t('chongzhiTixian.text23')}}</button>
          <button class="tradingCenter-btn" @click="$router.push('/account/googleAuthenticator')">{{$t('chongzhiTixian.text26')}}</button>
        </div>
      </div>
    </div>
    <!-- 文字弹窗-->
    <div class="myPopup" v-if="textDialog">
      <div class="myPopup-box" >
        <div class="close" @click="textDialog = false"><img src="../../../../assets/images/home/Shutdown.png" alt=""></div>
        <p class="error-text">{{textMsg}}</p>
        <div class="pay-box">
          <button class="tradingCenter-btn" @click="textDialog = false">{{$t('chongzhiTixian.text24')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Dialog from '@/components/dialog/dialog'
import orderProcess from '@/components/orderProcess.vue'
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      stepData: [],
      lastStatus: 0,
      isBoss: this.$route.query.isBoss,
      bossAccount: '',
      textMsg: '',
      payFailTip: '',
      payPassword: '',
      payCode: '',
      payPopupShow: false,
      setSafeVerific: false,
      textDialog: false,
      money: '',
      orderId: this.$route.query.id,
      orderData: ''
    }
  },
  created () {
    this.getChongzhi()
  },
  methods: {
    orderTypes (item, msg) {
      if (item.payState === 1 && item.orderState === 2) {
        return this.$t('orderStatus.text1')
      } else {
        if (msg && msg.indexOf(',') === 0) {
          return msg.splice(0, 1)
        } else {
          return msg
        }
      }
    },
    // 充值详情
    getChongzhi () {
      this.$postAxios.post(`${this.$api2}deposit/queryOrderDetail`, {
        orderId: this.$route.query.id
      }).then(res => {
        if (res.data.status === 'success') {
          this.orderData = res.data.data
          this.lastStatus = res.data.data.stepList[res.data.data.stepList.length - 1].status
          this.money = this.orderData.amount.toFixed(4).split('.')
          if (this.orderData.bossReceiveAccount) {
            this.bossAccount = JSON.parse(this.orderData.bossReceiveAccount)
          }
          this.stepData = []
          this.stepData = this.stepData.concat(res.data.data.stepList)
          this.stepData.splice(this.stepData.length - 1, 1)
        }
      })
    },
    // 共享者 拒绝 充值订单
    rejectOrder () {
      Dialog({
        title: this.$t('shareOrder.text22'),
        content: this.$t('shareOrder.text25'),
        okFn: () => {
          this.$postAxios.post(`${this.$api2}deposit/cancelOrder`, {
            id: this.$route.query.id
          }).then(res => {
            if (res.data.status === 'success') {
              this.getChongzhi()
            } else {
              Dialog({
                title: '',
                content: res.data.msg
              })
            }
          })
        }
      })
    },
    // 共享者确认  充值收款
    comfimShoKuan () {
      Dialog({
        title: this.$t('shareOrder.text26'),
        content: this.orderData.confirmTip,
        okFn: () => {
          this.$postAxios.post(`${this.$api2}deposit/confirmByStep`, {
            orderId: this.$route.query.id,
            confirmState: '3' // 老板确认收款
          }).then(res => {
            if (res.data.status === 'success') {
              this.getChongzhi()
            } else {
              Dialog({
                title: '',
                content: res.data.msg
              })
            }
          })
        }
      })
    },
    // 共享者 确定 充值接单
    jiedanConfim () {
      Dialog({
        title: this.$t('shareOrder.text23'),
        content: this.orderData.confirmTip,
        okFn: () => {
          this.$postAxios.post(`${this.$api2}deposit/confirmByStep`, {
            orderId: this.$route.query.id,
            confirmState: '1' // 老板确认接单
          }).then(res => {
            if (res.data.status === 'success') {
              this.getChongzhi()
            } else {
              Dialog({
                title: '',
                content: res.data.msg
              })
            }
          })
        }
      })
    },
    // 充值共享者支付保证金
    payMoney () {
      if (this.userData.openGoogleCode !== 2) {
        this.setSafeVerific = true
      } else {
        this.payPopupShow = true
      }
    },
    // 二次支付保证金
    confirmPay () {
      this.payFailTip = ''
      if (this.payPassword === '') {
        this.payFailTip = this.$t('chongzhiTixian.text20')
      }
      if (this.payCode === '') {
        this.payFailTip = this.$t('chongzhiTixian.text22')
      }
      if (this.payPassword !== '' && this.payCode !== '') {
        this.$postAxios.post(`${this.$api2}pay/payOrder`, {
          id: this.orderData.cashPaymentOrder.payId,
          tradePwd: this.payPassword,
          mobileCode: this.payCode
        }).then(res => {
          if (res.data.status === 'success') {
            this.getChongzhi()
            this.payPopupShow = false
          } else {
            this.payFailTip = res.data.msg
          }
        })
      }
    },
    // 关闭弹窗、取消弹窗
    closeIcon () {
      this.setSafeVerific = false
      this.payPopupShow = false
      this.payFailTip = ''
      this.payPassword = ''
      this.payCode = ''
    },
    showOrderPro () {
      this.$refs.showOrderProcess.show()
    }
  },
  computed: {
    ...mapGetters([
      'userData'
    ])
  },
  components: {
    orderProcess
  }
}
</script>
