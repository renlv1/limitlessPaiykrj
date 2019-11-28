<template>
  <div class="mybill-detail">
    <!--共享者订单--提现 详情-->
    <div class="router-navigation">
      <span class="link" @click="$router.push({path: '/account/sharerOrder', query: {isChongzhi: 1}})">{{$t('shareOrder.text1')}}</span>
      <span class="icon">》</span>
      <span class="link">{{$t('chongzhiTixian.text48')}}</span>
    </div>
    <h3 class="title-text">{{$t('chongzhiTixian.text48')}}</h3>
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
            <span class="order-text">{{$t('chongzhiTixian.text34')}}</span>
            <div class="order-text status-text">
              <span>{{orderData.tipMsg}}</span>
              <div class="icon-sanjiao"></div>
            </div>
          </li>
          <li class="order-list">
            <span class="order-text">{{$t('orderStatus.text2')}}</span>
            <span class="order-text">{{orderData.userNick}}</span>
          </li>
          <!-- 提现的收款信息-->
          <li class="account-info-list" v-show="orderData.drawAccount">
            <div class="list-item">
              <p class="list-item-text">{{$t('orderStatus.text5')}}</p>
              <div class="bank-box">
                <div class="bank-text">
                  <div class="bank-left">
                    <div class="circle"></div>
                    <p class="bankname">{{drawAccount.bankName}}</p>
                  </div>
                  <p class="bank-right">{{drawAccount.realName}}</p>
                </div>
                <p class="word-bread">{{drawAccount.accountNumber}}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="btn-click-box">
        <div class="btn-click" v-if="(orderData.orderState === 2 && orderData.payState === 1) || (orderData.orderState === 2 && orderData.payState === 2)" @click="rejectOrder">{{$t('shareOrder.text22')}}</div>
        <div class="btn-click" v-if="(orderData.orderState === 2 && orderData.payState === 1) || (orderData.orderState === 2 && orderData.payState === 2)" @click="jiedanConfim">{{$t('shareOrder.text23')}}</div>
        <div class="btn-click" v-if="orderData.orderState === 3 && orderData.payState === 3" @click="daKuanConfim">{{$t('chongzhiTixian.text43')}}</div>
        <div class="btn-click" v-if="orderData.canHelp === 1"  @click="$router.push({path: '/account/sharerOrder/withdrawAppeal', query: {id: $route.query.id}})">{{$t('chongzhiTixian.text40')}}</div>
        <div class="btn-click" v-if="orderData.canHelp === 3" @click="$router.push({path: '/account/sharerOrder/withdrawAppealDetail', query: {id: $route.query.id}})">{{$t('chongzhiTixian.text41')}}</div>
      </div>
    </div>
    <!-- 订单进程弹窗-->
    <order-process :step-data="stepData" :last-status="lastStatus" :order-data="orderData" ref="showOrderProcess"></order-process>
  </div>
</template>

<script type="text/ecmascript-6">
import Dialog from '@/components/dialog/dialog'
import orderProcess from '@/components/orderProcess.vue'
export default {
  data () {
    return {
      stepData: [],
      lastStatus: 0,
      currentIndex: 0,
      showDialog: false,
      stepListLen: [],
      money: '',
      orderData: '',
      drawAccount: ''
    }
  },
  created () {
    this.getTixian()
  },
  methods: {
    // 提现详情
    getTixian () {
      this.$postAxios.post(`${this.$api2}draw/queryOrderDetail`, {
        orderId: this.$route.query.id
      }).then(res => {
        if (res.data.status === 'success') {
          this.orderData = res.data.data
          this.lastStatus = res.data.data.stepList[res.data.data.stepList.length - 1].status
          this.money = this.orderData.amount.toFixed(4).split('.')
          this.stepListLen = this.orderData.stepList
          this.currentIndex = this.orderData.onlineState - 1
          if (this.orderData.drawAccount) {
            this.drawAccount = JSON.parse(this.orderData.drawAccount)
          }
          this.stepData = []
          this.stepData = this.stepData.concat(res.data.data.stepList)
          this.stepData.splice(this.stepData.length - 1, 1)
        }
      })
    },
    // 共享者 拒绝 提现订单
    rejectOrder () {
      Dialog({
        title: this.$t('shareOrder.text22'),
        content: this.$t('shareOrder.text25'),
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
    // 共享者 确定 提现接单
    jiedanConfim () {
      Dialog({
        title: this.$t('shareOrder.text23'),
        content: this.orderData.confirmTip,
        okFn: () => {
          this.$postAxios.post(`${this.$api2}draw/confirmByStep`, {
            orderId: this.$route.query.id,
            confirmState: '1' // 1:(老板)确认接单
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
    // 共享者 确定 提现 打款
    daKuanConfim () {
      Dialog({
        title: this.$t('chongzhiTixian.text43'),
        content: this.orderData.confirmTip,
        okFn: () => {
          this.$postAxios.post(`${this.$api2}draw/confirmByStep`, {
            orderId: this.$route.query.id, // 2:(老板)确认打款
            confirmState: '2'
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
    showOrderPro () {
      this.$refs.showOrderProcess.show()
    }
  },
  components: {
    orderProcess
  }
}
</script>
