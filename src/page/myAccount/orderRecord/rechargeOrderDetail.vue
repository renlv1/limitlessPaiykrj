<template>
  <div class="mybill-detail">
    <!--充值详情-->
    <div>
      <div class="router-navigation">
        <span class="link"  @click="$router.go(-1)">{{$t('chongzhiTixian.text44')}}</span>
        <span class="icon">》</span>
        <router-link to="/account/recharge" class="link">{{$t('chongzhiTixian.text45')}}</router-link>
        <span class="icon">》</span>
        <span>{{$t('chongzhiTixian.text46')}}</span>
      </div>
      <h3 class="title-text">{{$t('chongzhiTixian.text46')}}</h3>
    </div>
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
            <span class="order-text">{{$t('bill.text7')}}</span>
            <div class="order-text status-text">
              <span>{{$orderTipMsg(orderData.tipMsg, orderData.typeTitle, isChongzhi, orderData)}}</span>
              <div class="icon-sanjiao"></div>
            </div>
          </li>
          <li class="order-list" v-show="orderData.bossNick">
            <span class="order-text">{{$t('chongzhiTixian.text35')}}</span>
            <span class="order-text">{{orderData.bossNick}}</span>
          </li>
          <!-- 充值的收款信息-->
          <li class="account-info-list">
            <!--我的付款信息-->
            <div class="list-item" v-if="orderData.givemoneyname">
              <p class="list-item-text">{{$t('orderStatus.text7')}}</p>
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
            <!--他的收款信息-->
            <div class="list-item" v-if="bossAccount">
              <p class="list-item-text">{{$t('orderStatus.text5')}}</p>
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
        <div class="btn-click" v-show="orderData.orderState === 1" @click="cancelOrder">{{$t('chongzhiTixian.text38')}}</div>
        <div class="btn-click" v-show="orderData.orderState === 1" @click="gotoShare">{{$t('bill.text27')}}</div>
        <div class="btn-click" v-show="orderData.orderState === 3 && orderData.payState === 3" @click="cnofirmMoney">{{$t('chongzhiTixian.text39')}}</div>
        <div class="btn-click" v-show="orderData.canHelp === 2" @click="$router.push({path: '/account/sharerOrder/rechargeAppeal', query: {id: $route.query.id, isBoss: '0'}})">{{$t('chongzhiTixian.text40')}}</div>
        <div class="btn-click" v-show="orderData.canHelp === 3" @click="$router.push({path: '/account/sharerOrder/rechargeAppealDetail', query: {id: $route.query.id, isBoss: '0'}})">{{$t('chongzhiTixian.text41')}}</div>
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
      showDialog: false,
      money: '',
      orderData: '',
      bossAccount: '',
      isChongzhi: Number(this.$route.query.isChongzhi)
    }
  },
  created () {
    this.getChongzhi()
  },
  methods: {
    // 跳转到 充值 选择共享者
    gotoShare () {
      this.$router.push({
        path: '/account/orderCashValue/switchShare',
        query: {
          id: this.$route.query.id,
          isChongzhi: 0
        }
      })
    },
    // 充值详情
    getChongzhi () {
      this.$postAxios.post(`${this.$api2}deposit/queryOrderDetail`, {
        orderId: this.$route.query.id
      }).then(res => {
        if (res.data.status === 'success') {
          this.orderData = res.data.data
          if (this.orderData.bossReceiveAccount) {
            this.bossAccount = JSON.parse(res.data.data.bossReceiveAccount)
          }
          this.money = this.orderData.amount.toFixed(4).split('.')
          this.lastStatus = res.data.data.stepList[res.data.data.stepList.length - 1].status
          this.stepData = []
          this.stepData = this.stepData.concat(res.data.data.stepList)
          this.stepData.splice(this.stepData.length - 1, 1)
        }
      })
    },
    // 充值取消订单
    cancelOrder () {
      Dialog({
        title: this.$t('chongzhiTixian.text38'),
        content: this.$t('chongzhiTixian.text42'),
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
    // 充值 用户确定打款
    cnofirmMoney () {
      Dialog({
        title: this.$t('chongzhiTixian.text43'),
        content: this.orderData.confirmTip,
        okFn: () => {
          this.$postAxios.post(`${this.$api2}deposit/confirmByStep`, {
            orderId: this.$route.query.id,
            confirmState: '2' //  2:(用户)确认打款
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
    showOrderPro () {
      this.$refs.showOrderProcess.show()
    }
  },
  components: {
    orderProcess
  }
}
</script>
