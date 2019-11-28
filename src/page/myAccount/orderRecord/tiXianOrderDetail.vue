<template>
  <div class="mybill-detail">
    <!--提现详情-->
    <div>
      <div class="router-navigation">
        <span class="link" @click="$router.go(-1)">{{$t('chongzhiTixian.text44')}}</span>
        <span class="icon">》</span>
        <span class="link" @click="$router.push('/account/withdraw')">{{$t('chongzhiTixian.text47')}}</span>
        <span class="icon">》</span>
        <span>{{$t('chongzhiTixian.text48')}}</span>
      </div>
      <h3 class="title-text">{{$t('chongzhiTixian.text48')}}</h3>
    </div>
    <div class="details-box">
      <h3 class="title-details">{{$t('chongzhiTixian.text49')}}</h3>
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
            <span class="order-text">{{$t('bill.text7')}}</span>
            <div class="order-text status-text">
              <span>{{$orderTipMsg(orderData.tipMsg, orderData.typeTitle, 1, orderData)}}</span>
              <div class="icon-sanjiao"></div>
            </div>
          </li>
          <li class="order-list" v-show="orderData.bossNick">
            <span class="order-text">{{$t('chongzhiTixian.text35')}}</span>
            <span class="order-text">{{orderData.bossNick}}</span>
          </li>
          <!-- 提现的收款信息-->
          <li class="account-info-list" v-if="orderData.drawAccount">
            <div class="list-item">
              <p class="list-item-text">{{$t('orderStatus.text4')}}</p>
              <div class="bank-box">
                <div class="bank-text">
                  <div class="bank-left">
                    <div class="circle"></div>
                    <p class="bankname">{{bankData.bankName}}</p>
                  </div>
                  <p class="bank-right">{{bankData.realName}}</p>
                </div>
                <p class="word-bread">{{bankData.accountNumber}}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="btn-click-box">
        <div class="btn-click" v-show="orderData.orderState === 1" @click="cancelOrder">{{$t('chongzhiTixian.text38')}}</div>
        <div class="btn-click" v-show="orderData.orderState === 1 && orderData.payState === 2" @click="gotoShare">{{$t('bill.text27')}}</div>
        <div class="btn-click" v-show="orderData.orderState === 1 && orderData.payState === 1" @click="payMoney">{{$t('shareOrder.text24')}}</div>
        <div class="btn-click" v-show="orderData.orderState === 3 && orderData.payState === 4" @click="comfimShouKuan">{{$t('chongzhiTixian.text36')}}</div>
        <div class="btn-click" v-show="orderData.canHelp === 1" @click="$router.push({path: '/account/sharerOrder/withdrawAppeal', query: {id: $route.query.id, isBoss: '0'}})">{{$t('chongzhiTixian.text40')}}</div>
        <div class="btn-click" v-show="orderData.canHelp === 3" @click="$router.push({path: '/account/sharerOrder/withdrawAppealDetail', query: {id: $route.query.id, isBoss: '0'}})">{{$t('chongzhiTixian.text41')}}</div>
      </div>
    </div>
    <!--支付弹窗-->
    <div class="myPopup" v-show="payPopupShow">
      <div class="myPopup-box">
        <div class="close" @click="closeIcon"><img src="../../../assets/images/home/Shutdown.png" alt=""></div>
        <div class="formDiv">
          <h3 class="title">{{$t('shareOrder.text24')}}</h3>
          <p class="pay-price">{{orderData.amount | fourNumber}} USD</p>
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
      <div class="myPopup-box" >
        <div class="close" @click="textDialog = false"><img src="../../../assets/images/home/Shutdown.png" alt=""></div>
        <p class="error-text">{{textMsg}}</p>
        <div class="pay-box">
          <button class="tradingCenter-btn" @click="textDialog = false">{{$t('chongzhiTixian.text24')}}</button>
        </div>
      </div>
    </div>
    <!-- 订单进程弹窗-->
    <order-process :step-data="stepData" :last-status="lastStatus" :order-data="orderData" ref="showOrderProcess"></order-process>
  </div>
</template>

<script type="text/ecmascript-6">
import Dialog from '@/components/dialog/dialog'
import orderProcess from '@/components/orderProcess.vue'
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      showDialog: false,
      stepData: [],
      lastStatus: 0,
      textMsg: '',
      payFailTip: '',
      payPassword: '',
      payCode: '',
      payPopupShow: false,
      setSafeVerific: false,
      textDialog: false,
      orderStep1: '',
      orderStep2: '',
      currentIndex: 0,
      stepListLen: 1,
      money: '',
      orderData: '',
      bankData: '',
      isChongzhi: Number(this.$route.query.isChongzhi)
    }
  },
  created () {
    this.getTixian()
  },
  methods: {
    // 跳转到 提现 选择共享者
    gotoShare () {
      this.$router.push({
        path: '/account/orderCashValue/switchShare',
        query: {
          id: this.$route.query.id,
          isChongzhi: 1
        }
      })
    },
    // 提现详情
    getTixian () {
      this.$postAxios.post(`${this.$api2}draw/queryOrderDetail`, {
        orderId: this.$route.query.id
      }).then(res => {
        if (res.data.status === 'success') {
          this.orderData = res.data.data
          this.lastStatus = res.data.data.stepList[res.data.data.stepList.length - 1].status
          this.bankData = JSON.parse(this.orderData.drawAccount)
          this.money = this.orderData.amount.toFixed(4).split('.')
          this.stepData = []
          this.stepData = this.stepData.concat(res.data.data.stepList)
          this.stepData.splice(this.stepData.length - 1, 1)
        }
      })
    },
    // 提现取消订单
    cancelOrder () {
      Dialog({
        title: this.$t('chongzhiTixian.text38'),
        content: this.$t('chongzhiTixian.text42'),
        okFn: () => {
          this.$postAxios.post(`${this.$api2}draw/cancelOrder`, {
            id: this.$route.query.id
          }).then(res => {
            if (res.data.status === 'success') {
              this.getTixian()
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
    // 提现用户确认收款
    comfimShouKuan () {
      Dialog({
        title: this.$t('shareOrder.text26'),
        content: this.orderData.confirmTip,
        okFn: () => {
          this.$postAxios.post(`${this.$api2}draw/confirmByStep`, {
            orderId: this.$route.query.id,
            confirmState: '3' //  3(用户)确认收款
          }).then(res => {
            if (res.data.status === 'success') {
              this.getTixian()
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
    // 提现支付保证
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
            this.getTixian()
            this.payPopupShow = false
            this.$router.push({
              path: '/account/orderCashValue/switchShare',
              query: {
                id: this.$route.query.id,
                isChongzhi: 1
              }
            })
          } else {
            this.payFailTip = res.data.msg
          }
        })
      }
    },
    showOrderPro () {
      this.$refs.showOrderProcess.show()
    },
    // 关闭弹窗、取消弹窗
    closeIcon () {
      this.setSafeVerific = false
      this.payPopupShow = false
      this.payFailTip = ''
      this.payPassword = ''
      this.payCode = ''
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
