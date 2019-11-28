<template>
  <div class="mybill-detail">
    <!--共享者订单--提现 申诉 详情-->
    <div class="router-navigation">
      <span class="link" @click="$router.push('/account/orderCashValue')" v-if="isBoss === 0">{{$t('chongzhiTixian.text44')}}</span>
      <span class="link" @click="$router.push('/account/sharerOrder')" v-else>{{$t('shareOrder.text1')}}</span>
      <span class="icon">》</span>
      <span class="link">{{$t('chongzhiTixian.text41')}}</span>
    </div>
    <h3 class="title-text">{{$t('chongzhiTixian.text41')}}</h3>
    <div class="shensu-box">
      <h3 class="title-details">{{$t('chongzhiTixian.text49')}}</h3>
      <h3 class="money" v-show="money"><span>{{money[0]}}</span>.<span class="xiaoshu">{{money[1]}}</span><span class="curren-money">{{orderData.currency}}</span></h3>
      <div class="order-box order-box-shensu">
        <ul class="order-uls">
          <li class="order-list">
            <span class="order-text">{{$t('chongzhiTixian.text4')}}</span>
            <span class="order-text">{{orderData.id}}</span>
          </li>
          <li class="order-list">
            <span class="order-text">{{$t('chongzhiTixian.text5')}}</span>
            <span class="order-text" v-show="orderData.createAt">{{$changeDate(orderData.createAt)}}</span>
          </li>
          <li class="order-list"  @click="showOrderPro">
            <span class="order-text">{{$t('orderStatus.text0')}}</span>
            <div class="order-text status-text">
              <span>{{orderData.typeTitle}}</span>
              <div class="icon-sanjiao"></div>
            </div>
          </li>
        </ul>
      </div>
      <div class="shensu-yuan">
        <div class="title-label">{{$t('shareOrder.text2')}}</div>
        <ul class="check-uls">
          <li class="check-list checked">
            <div class="circle">
              <span class="gou1 icon-gou"></span>
              <span class="gou2 icon-gou"></span>
            </div>
            <span>{{problemData.reqType}}</span>
          </li>
        </ul>
      </div>
      <!--申诉内容-->
      <!--req 提供的描述-->
      <div v-if="problemData.reqMessage">
        <div class="shensu-cont">
          <div class="title-label">
            <span v-if="problemData.reqUserType === 'Boss' && !isBoss">{{orderData.bossNick}}</span>
            <span v-else>{{orderData.userNick}}</span>
            {{$t('chongzhiTixian.text0')}}</div>
          <div class="shensu-text-box">
            <div class="textarea min-textarea">{{problemData.reqMessage}}</div>
          </div>
        </div>
        <div  class="upload-wrapper">
          <div class="img-lis" v-for="(item, index) in imgDataObj" :key="index" @click="showBigImg(item)">
            <img :src="'http://ofydu65mj.bkt.clouddn.com/' + item" alt="">
          </div>
        </div>
        <div class="text-look">{{$t('shareOrder.text18')}}</div>
      </div>
      <!--des 提供的描述-->
      <div v-if="problemData.desMessage">
        <div>
          <div class="shensu-cont">
            <div class="title-label">
              <span v-if="problemData.reqUserType === 'Boss' && !isBoss">{{orderData.userNick}}</span>
              <span v-else>{{orderData.bossNick}}</span>
              {{$t('chongzhiTixian.text0')}}</div>
            <div class="shensu-text-box">
              <div class="textarea min-textarea">{{problemData.desMessage}}</div>
            </div>
          </div>
          <div  class="upload-wrapper">
            <div class="img-lis" v-for="(item, index) in imgDataObj2" :key="index" @click="showBigImg(item)">
              <img :src="'http://ofydu65mj.bkt.clouddn.com/' + item" alt="">
            </div>
          </div>
        </div>
        <div class="text-look">{{$t('shareOrder.text18')}}</div>
      </div>
      <div class="shensu-cont" v-show="problemData.result">
        <div class="title-label">{{$t('shareOrder.text20')}}：{{orderData.tipMsg}}</div>
      </div>
      <div class="button-w">
        <!--<div class="button button-color">关闭申诉</div>-->
      </div>
    </div>
    <!-- 订单进程弹窗-->
    <order-process :step-data="stepData" :last-status="lastStatus" :order-data="orderData" ref="showOrderProcess"></order-process>
    <div class="dialog-wrapper" v-show="showDialog2" @click="showDialog2 = false">
      <div class="dialog-content img-dialog" @click.stop>
        <div class="close-confirm" @click="showDialog2 = false">
          <div class="close-icon">
            <div class="line line1"></div>
            <div class="line line2"></div>
          </div>
        </div>
        <div class="dialog-img-box">
          <img :src="bigImg" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import orderProcess from '@/components/orderProcess.vue'
export default {
  data () {
    return {
      stepData: [],
      lastStatus: 0,
      money: '',
      orderData: '',
      bigImg: '',
      bossAccount: '',
      orderStep1: '',
      orderStep2: '',
      showDialog: false,
      showDialog2: false,
      currentIndex: 0,
      isLoading: true,
      isMaxLoading: true,
      problemData: '',
      isBoss: Number(this.$route.query.isBoss),
      orderId: this.$route.query.id,
      imgDataObj: [],
      imgDataObj2: []
    }
  },
  created () {
    this.getTixian()
  },
  methods: {
    getTixian () {
      this.$postAxios.post(`${this.$api2}draw/queryOrderDetail`, {
        orderId: this.orderId
      }).then(res => {
        if (res.data.status === 'success') {
          this.orderData = res.data.data
          this.money = this.orderData.amount.toFixed(4).split('.')
          this.problemData = res.data.data.arbitration
          if (res.data.data.arbitration.reqImgList) {
            this.imgDataObj = res.data.data.arbitration.reqImgList.split(',')
          }
          if (res.data.data.arbitration.desImgList) {
            this.imgDataObj2 = res.data.data.arbitration.desImgList.split(',')
          }
          if (this.orderData.bossReceiveAccount) {
            this.bossAccount = JSON.parse(this.orderData.bossReceiveAccount)
          }
          this.lastStatus = res.data.data.stepList[res.data.data.stepList.length - 1].status
          this.stepData = this.stepData.concat(res.data.data.stepList)
          this.stepData.splice(this.stepData.length - 1, 1)
        }
      })
    },
    showOrderStatus () {
      this.showDialog = true
    },
    showBigImg (item) {
      if (item.indexOf('http') > -1) {
        this.bigImg = item
      } else {
        this.bigImg = 'http://ofydu65mj.bkt.clouddn.com/' + item
      }
      this.showDialog2 = true
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
