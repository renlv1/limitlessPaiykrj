<template>
  <div class="mybill-detail">
    <!--共享者订单--充值 详情-->
    <div class="router-navigation">
      <span class="link">共享者订单</span>
      <span class="icon">》</span>
      <span class="link">充值详情</span>
    </div>
    <h3 class="title-text">充值详情</h3>
    <div class="details-box">
      <h3 class="title-details">充值数额</h3>
      <h3 class="money">{{orderDetail.amount | formattingMoney}} <span class="curren-money">{{orderDetail.currency}}</span></h3>
      <ul class="order-uls">
        <li class="order-list">
          <span class="order-text">订单编号</span>
          <span class="order-text">{{orderDetail.id}}</span>
        </li>
        <li class="order-list">
          <span class="order-text">创建时间</span>
          <span class="order-text">{{$changeDate(orderDetail.createAt)}}</span>
        </li>
        <li class="order-list">
          <span class="order-text">类型</span>
          <span class="order-text order-type" @click="showDialog = true">{{orderDetail.typeTitle}} <i :class="{'active': activeFlag}"></i></span>
        </li>
        <li class="order-list">
          <span class="order-text">共享者</span>
          <span class="order-text">{{orderDetail.bossNick}}</span>
        </li>
        <li class="account-info-list">
          <div class="list-item" v-if="stepList2[3].finish">
            <p class="list-item-text">共享者收款信息</p>
            <div class="bank-box" v-html="parseString(stepList2[3].colorMsg)">
            </div>
          </div>
          <div class="list-item">
            <p class="list-item-text">我的付款信息</p>
            <div class="bank-box" v-html="parseString(stepList2[0].colorMsg)">
            </div>
          </div>
        </li>
        <!--按钮-->
        <li class="btn-click-box">
          <div class="btn-click" @click="$router.push('/account/sharerOrder/rechargeAppeal')" v-if="orderDetail.canHelp !== 0 ">申诉</div>
          <div class="btn-click" v-if="orderDetail.orderState === 2 && (orderDetail.payState===1 || orderDetail.payState===2 || orderDetail.payState===3)" @click="clickBtn(1)">取消订单</div>
          <div class="btn-click" v-if="orderDetail.orderState===2 && orderDetail.payState === 3" @click="clickBtn(2)">我已转账</div>
    </li>
      </ul>
    </div>
    <!-- 订单进程弹窗-->
    <div class="dialog-wrapper" v-show="showDialog" @click="showDialog = false">
      <div class="dialog-content" @click.stop>
        <div class="close-confirm" @click="showDialog = false">
          <div class="close-icon">
            <div class="line line1"></div>
            <div class="line line2"></div>
          </div>
        </div>
        <div class="dialog-box">
          <h3 class="dialog-title">订单进程</h3>
          <ul class="process">
            <li v-for="(item, index) in stepList" :key="index">
              <div class="process-left">
                <div>
                  <div class="circle"  :class="{'finish': index === 5}"></div>
                  <div class="line" v-if="index < 5"></div>
                </div>
                <span>{{item.title}}</span>
              </div>
              <div class="process-right" v-if="item.status===1">{{$changeDate(item.time)}}</div>
            </li>
            <li v-if="stepList.length < 6">
              <div class="process-left">
                <div>
                  <div class="circle" :class="{'undone':currentIndex < 6 && orderDetail.orderState !== 6, 'cancle': orderDetail.orderState === 6, 'cancle': orderDetail.orderState === 6}" ></div>
                </div>
                <span v-if="currentIndex < 6 && orderDetail.orderState !== 6 ">{{stepList2[currentIndex].title}}</span>
                <span v-if=" orderDetail.orderState === 6 ">订单取消</span>
              </div>
              <div class="process-right" v-if="orderDetail.orderState === 6 ">{{$changeDate(stepList2[currentIndex].time)}}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Dialog from '@/components/dialog/dialog'
export default {
  data () {
    return {
      id: this.$route.query.id,
      orderDetail: {},
      activeFlag: false,
      showDialog: false,
      stepListLen: 1,
      currentIndex: 0,
      stepList: [],
      stepList2: [
        {status: ''},
        {status: ''},
        {status: ''},
        {status: ''},
        {status: ''},
        {status: ''}
      ]
    }
  },
  created () {
    this.queryOrderDetail()
  },
  mounted () {

  },
  methods: {
    // deposit/queryOrderDetail
    queryOrderDetail () {
      let url = `${this.$api2}deposit/queryOrderDetail?orderId=${this.id}`
      this.$http.post(url).then(res => {
        if (res.data.status === 'success') {
          this.orderDetail = res.data.data
          this.stepListLen = this.orderDetail.stepList.length
          this.stepList2 = this.orderDetail.stepList
          for (let i in this.stepList2) {
            if (this.stepList2[i].status === 1) {
              this.stepList.push(this.stepList2[i])
              this.currentIndex = (i - 0) + 1
            }
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    parseString (str) {
      if (str) {
        let _str = str.replace(/\n/g, '<br>')
        return _str
      }
    },
    // 我已转账 2.5 充值订单充确认流程 /deposit/confirmByStep
    confirmDeposit () {
      this.$postAxios.post(`${this.$api2}deposit/confirmByStep`, {
        orderId: this.id,
        confirmState: 2
      }).then(res => {
        if (res.data.status === 'success') {
          this.queryOrderDetail()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    clickBtn (type) {
      if (type === 1) {
        Dialog({
          title: '提示',
          content: '是否取消订单',
          okFn: this.cancleOrder
        })
      } else if (type === 2) {
        Dialog({
          title: '提示',
          content: '确定您已经转账？',
          okFn: this.confirmDeposit
        })
      }
    },
    // 取消订单
    cancleOrder () {
      this.$postAxios.post(`${this.$api2}deposit/cancelOrder`, {
        id: this.id
      }).then(res => {
        if (res.data.status === 'success') {
          this.queryOrderDetail()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    showProcess () {

    }
  }
}
</script>

<style lang="less" type="text/less" scoped>
  .order-type{
    color: #4b84ff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    i{
      display: block;
      height: 0;
      width: 0;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
      border-left:6px solid #4b84ff;
      margin-right: 30px;
      transition: all 0.5s;
      transform: rotate(0deg);
      &.active{
        transform: rotate(90deg);
      }
    }
  }
</style>
