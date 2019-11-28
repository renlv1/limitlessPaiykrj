<template>
  <div class="mybill-detail">
    <!--共享者订单--充值 申诉 详情-->
    <div class="router-navigation">
      <span class="link" @click="$router.push('/account/sharerOrder')" v-if="isBoss === 0">{{$t('chongzhiTixian.text44')}}</span>
      <span class="link" @click="$router.push('/account/orderCashValue')" v-else>{{$t('shareOrder.text1')}}</span>
      <span class="icon">》</span>
      <span>{{$t('chongzhiTixian.text41')}}</span>
    </div>
    <h3 class="title-text">{{$t('chongzhiTixian.text41')}}</h3>
    <div class="shensu-box">
      <h3 class="title-details">{{$t('shareOrder.text16')}}</h3>
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
              <span>{{orderTypes(orderData, orderData.tipMsg)}}</span>
              <div class="icon-sanjiao"></div>
            </div>
          </li>
        </ul>
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
      </div>
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
      showDialog: false,
      showDialog2: false,
      currentIndex: 0,
      reasonData: [this.$t('shareOrder.text6'), this.$t('shareOrder.text7'), this.$t('shareOrder.text8')],
      isLoading: true,
      isMaxLoading: true,
      problemData: '',
      isBoss: Number(this.$route.query.isBoss),
      imgDataObj: [],
      imgDataObj2: []
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
          this.problemData = res.data.data.arbitration
          if (res.data.data.arbitration.reqImgList) {
            this.imgDataObj = res.data.data.arbitration.reqImgList.split(',')
          }
          if (res.data.data.arbitration.desImgList) {
            this.imgDataObj2 = res.data.data.arbitration.desImgList.split(',')
          }
          this.money = this.orderData.amount.toFixed(4).split('.')
          this.stepData = this.stepData.concat(res.data.data.stepList)
          this.stepData.splice(this.stepData.length - 1, 1)
          if (this.orderData.bossReceiveAccount) {
            this.bossAccount = JSON.parse(this.orderData.bossReceiveAccount)
          }
        }
      })
    },
    showBigImg (item) {
      this.bigImg = 'http://ofydu65mj.bkt.clouddn.com/' + item
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
