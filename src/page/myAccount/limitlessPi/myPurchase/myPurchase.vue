<template>
  <div class="page-limit">
    <div class="title">{{$t('goodsManagement.text55')}}</div>
    <div class="content">

      <tab
        :tabMenu="$t('goodsManagement.tabData')"
        :tabIndex="tabIndex"
        @changeTab="changeTab"
      >
        <!-- 1. 抢购中-->
        <div class="limit-table" slot="slot1">
          <table>
            <thead>
              <tr>
                <td v-for="(item, index) in $t('goodsManagement.tableData')" :key="item" :class="{'first-thead': index === 0}">{{item}}</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in infiniteRecordList" :key="index">
                <td class="img-wrap">
                  <div class="img-box">
                    <img :src="$imgUrlPro(item.infiniteSaleProduct.coverImg)" width="110" height="100" alt="">
                    <span>{{item.infiniteSaleProduct.productName}}</span>
                  </div>
                </td>
                <td>{{item.rewardRoundId}}</td>
                <td class="flex-td">
                  <p>{{item.infinitePanicRound.panicPrice | fourNumber}} π</p>
                  <p>{{item.infinitePanicRound.nowPanicUserName}}</p>
                </td>
                <td>{{item.infiniteSaleProduct.merchantName}}</td>
                <td>{{item.lastTime}}</td>
                <td :class="{'blue-color': item.isLingXian === $t('goodsManagement.text93')}" class="red-color">{{item.isLingXian}}</td>
                <td class="btn-w">
                  <router-link :to="{path:'/buyGoodsDetail',query: {purchaseId: item.infinitePanicRound.id}}">{{$t('goodsManagement.text8')}}</router-link>
                  <router-link :to="{path:'/account/myPurchase/myRewardsRecord',query: {roundId:item.rewardRoundId}}">{{$t('goodsManagement.text87')}}</router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 2. 抢购成功-->
        <div class="limit-table" slot="slot2">
          <div class="sub-tab">
            <div class="sub-tab-hd" :class="{active: subMenuIndex === 3}" @click="subMenuSwitch(3)"><span>{{$t('goodsManagement.text88')}}({{num4}})</span></div>
            <div class="sub-tab-hd" :class="{active: subMenuIndex === 0}" @click="subMenuSwitch(0)"><span>{{$t('goodsManagement.text89')}}({{num1}})</span></div>
            <div class="sub-tab-hd" :class="{active: subMenuIndex === 1}" @click="subMenuSwitch(1)"><span>{{$t('goodsManagement.text90')}}({{num2}})</span></div>
            <div class="sub-tab-hd" :class="{active: subMenuIndex === 2}" @click="subMenuSwitch(2)"><span>{{$t('goodsManagement.text91')}}({{num3}})</span></div>
          </div>
          <table>
            <thead>
              <tr>
                <td v-for="(item, index) in $t('goodsManagement.tableData3')" :key="item" :class="{'first-thead': index === 0}">
                  {{item}}
                </td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in orderList" :key="index">
                <td class="img-wrap">
                  <div class="img-box">
                    <img :src="$imgUrlPro(item.productLogo)" width="110" height="100" alt="">
                    <span>{{item.productName}}</span>
                  </div>
                </td>
                <td>{{item.infinitePanicPlayer.rewardRoundId}}</td>
                <td class="flex-td">
                  <p>
                    <span v-if="item.infinitePanicPlayer.playerAmount">{{item.infinitePanicPlayer.playerAmount | fourNumber}}</span>
                    <span v-else>0.0000</span>π
                  </p>
                  <p>{{item.buyUserName}}</p>
                </td>
                <td>{{item.merchantName}}</td>
                <td>{{$changeDate(item.createAt, '-', 8)}}</td>
                <td>{{orderStatus(item.status)}}</td>
                <td class="btn-w">
                  <router-link :to="{path:'/buyGoodsDetail',query: {purchaseId: item.infinitePanicPlayer.rewardRoundId}}">{{$t('goodsManagement.text8')}}</router-link>
                  <router-link :to="{path:'/account/myPurchase/myRewardsRecord',query: {roundId: item.infinitePanicPlayer.rewardRoundId}}">{{$t('goodsManagement.text87')}}</router-link>
                  <router-link :to="{path:'/account/myPurchase/applyShipments',query: {id: item.id, proId: item.saleProductId, roundId: item.infinitePanicPlayer.rewardRoundId}}" v-if="item.status === 4">{{$t('goodsManagement.text56')}}</router-link>
                  <router-link :to="{path:'/account/myPurchase/orderDetail',query: {id: item.id, roundId: item.infinitePanicPlayer.rewardRoundId}}" v-else>{{$t('goodsManagement.text92')}}</router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 3. 抢购失败-->
        <div class="limit-table" slot="slot3">
          <table>
            <thead>
            <tr>
              <td v-for="(item, index) in $t('goodsManagement.tableHead3')" :key="item" :class="{'first-thead': index === 0}">
                {{item}}
              </td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in infiniteRecordList2" :key="index">
              <td class="img-wrap">
                <div class="img-box">
                  <img :src="$imgUrlPro(item.infiniteSaleProduct.coverImg)" width="110" height="100" alt="">
                  <span>{{item.infiniteSaleProduct.productName}}</span>
                </div>
              </td>
              <td>{{item.rewardRoundId}}</td>
              <td class="flex-td">
                <p>{{item.infinitePanicRound.panicPrice | fourNumber}} π</p>
                <p>{{item.infinitePanicRound.nowPanicUserName}}</p>
              </td>
              <td>{{item.infiniteSaleProduct.merchantName}}</td>
              <td>{{$changeDate(item.infinitePanicRound.endAt, '-', 8)}}</td>
              <td class="btn-w">
                <router-link :to="{path:'/buyGoodsDetail',query: {purchaseId: item.infinitePanicRound.id}}">{{$t('goodsManagement.text8')}}</router-link>
                <router-link :to="{path:'/account/myPurchase/myRewardsRecord',query: {roundId:item.rewardRoundId}}">{{$t('goodsManagement.text87')}}</router-link>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </tab>
      <v-loading v-show="loadingShow"></v-loading>
      <div class="no-result" v-show="noResult">
        <div class="load-more-box">
          <div class="loading-img">
            <img src="../../../../assets/images/home/nodata.png" alt="">
          </div>
          <p class="desc">{{$t('home.text11')}}!</p>
        </div>
      </div>
      <v-turn-page :propsPage="totalPage" @orderLogTrunPage="parentTurnPage" ref="turnPage1"></v-turn-page>
    </div>
  </div>
</template>

<script>
import tab from '@/components/tab'
import {mapGetters} from 'vuex'

export default {
  data () {
    return {
      num1: 0,
      num2: 0,
      num3: 0,
      num4: 0,
      timer3: null,
      totalPage: 0,
      noResult: false,
      loadingShow: true,
      tabIndex: 0,
      pageSize: 10,
      pageNum: 10, // 一页多少条
      orderList: [], // 抢购成功的列表
      infiniteRecordList: [], // 抢购列表
      infiniteRecordList2: [], // 抢购列表
      subMenuIndex: 3
    }
  },
  created () {
    this.getOrderList(1, 1)
    this.getOrderList(2, 1)
    this.getOrderList(3, 1)
    this.getOrderList(4, 1)
    this.getCanPancicList(1, 1)
  },
  methods: {
    parentTurnPage (page) { // 页码
      if (this.tabIndex === 1) {
        this.getOrderList(this.subMenuIndex + 1, page)
      } else {
        this.getCanPancicList(this.tabIndex + 1, page)
      }
    },
    getCanPancicList (queryType, pageIndex) { // 5.2查询我的抢购数据-我的抢购
      this.$postAxios.post(`${this.$api2}infinite/queryMyPanicPlayerList`, {
        queryType: queryType,
        pageIndex: pageIndex,
        pageSize: this.pageNum
      }).then(res => {
        this.loadingShow = false
        if (res.data.status === 'success') {
          if (queryType === 3) {
            this.infiniteRecordList2 = res.data.data.infinitePanicPlayerList
          }
          let recordList = res.data.data.infinitePanicPlayerList
          this.totalPage = res.data.data.totalPage
          if (recordList.length === 0) {
            this.noResult = true
          } else {
            this.noResult = false
          }
          if (recordList.length > 0 && this.tabIndex === 0) {
            recordList.forEach(item => {
              // 判断领先、出局，列表第一个就是领先
              this.$postAxios.post(`${this.$api2}infinite/panicRoundPlayerList`, {
                roundId: item.rewardRoundId,
                pageIndex: 1,
                pageSize: 1
              }).then(res => {
                this.loadingShow = false
                if (res.data.status === 'success') {
                  if (res.data.data.infinitePanicPlayerList[0].userAddress === this.userData.address) {
                    item.isLingXian = this.$t('goodsManagement.text93')
                  } else {
                    item.isLingXian = this.$t('goodsManagement.text94')
                  }
                }
              })
              item.lastTime = '00:00:00'
              let times = item.infinitePanicRound.bidLastTime
              this.timer3 = setInterval(() => {
                times--
                if (times > 0) {
                  let hour = 0
                  let minute = 0
                  let second = 0 // 时间默认值
                  hour = Math.floor(times / 60 / 60 % 24)
                  minute = Math.floor(times / 60 % 60)
                  second = parseInt(Number(times) % 60)
                  if (hour <= 9) hour = '0' + hour
                  if (minute <= 9) minute = '0' + minute
                  if (second <= 9) second = '0' + second
                  item.lastTime = `${hour}:${minute}:${second}`
                } else {
                  this.getCanPancicList(1, 1)
                  times = 0
                  item.lastTime = '00:00:00'
                  clearInterval(this.timer3)
                }
                this.infiniteRecordList = recordList
              }, 1000)
            })
          } else {
            this.infiniteRecordList = recordList
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 2.2 用户查询竞价订单记录/infinite/userQueryInfiniteOrderList
    getOrderList (queryType, pageIndex) { // 5.2查询我的抢购数据-我的抢购
      this.$postAxios.post(`${this.$api2}infinite/userQueryInfiniteOrderList`, {
        status: queryType,
        pageIndex: pageIndex,
        pageSize: this.pageNum
      }).then(res => {
        this.loadingShow = false
        if (res.data.status === 'success') {
          this.orderList = res.data.data.infiniteOrderList
          if (this.tabIndex === 1) {
            this.totalPage = res.data.data.totalPage
          }
          if (queryType === 1) {
            this.num1 = res.data.data.totalCount
          }
          if (queryType === 2) {
            this.num2 = res.data.data.totalCount
          }
          if (queryType === 3) {
            this.num3 = res.data.data.totalCount
          }
          if (queryType === 4) {
            this.num4 = res.data.data.totalCount
          }
          if (this.tabIndex === 1) {
            if (this.orderList.length === 0) {
              this.noResult = true
            } else {
              this.noResult = false
            }
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    changeTab (index) {
      this.loadingShow = true
      this.tabIndex = index
      this.noResult = false
      this.subMenuIndex = 3
      this.totalPage = 0
      this.infiniteRecordList = []
      this.infiniteRecordList2 = []
      this.orderList = []
      if (index === 1) {
        this.getOrderList(4, 1)
      } else {
        this.getCanPancicList(index + 1, 1)
      }
      if (this.$refs.turnPage1) {
        this.$refs.turnPage1.resetPage(1)
      }
    },
    subMenuSwitch (index) {
      this.totalPage = 0
      this.subMenuIndex = index
      this.orderList = []
      this.getOrderList(1 + index, 1)
      if (this.$refs.turnPage1) {
        this.$refs.turnPage1.resetPage(1)
      }
    },
    orderStatus (status) { // 订单状态 1待发货 2待收货 3已完成 4待申请发货
      if (status === 1) {
        return this.$t('goodsManagement.text89')
      }
      if (status === 2) {
        return this.$t('goodsManagement.text90')
      }
      if (status === 3) {
        return this.$t('goodsManagement.text91')
      }
      if (status === 4) {
        return this.$t('goodsManagement.text88')
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.timer3)
  },
  computed: {
    ...mapGetters([
      'userData'
    ])
  },
  components: {
    tab,
    vLoading: resolve => require(['@/components/loading.vue'], resolve),
    vTurnPage: resolve => require(['@/components/turnPage.vue'], resolve)
  }
}
</script>

<style lang="less" scoped>
  @import '~@/assets/css/limitlessPi';
  .blue-color{
    color: #4b84ff;
  }
  .flex-td{
    display: flex;
    flex-direction: column;
  }
  .first-td{
    width: 300px;
  }
  .limit-table .img-wrap{
    flex: none;
    display: flex;
    justify-content: flex-start;
  }
  .btn-w{
    display: flex;
    flex-direction: column;
  }
  .sub-tab{
    display: flex;
    background: #fff;
    border-bottom: 1px solid #e7e8ec;
    .sub-tab-hd{
      width: 300px;
      line-height: 69px;
      font-size: 16px;
      color: @blue;
      text-align: center;
      span{
        padding: 0 25px;
        border-bottom: 2px solid transparent;
        display: inline-block;
        cursor: pointer;
      }
      &.active span{
        border-bottom-color: @blue;
      }
    }
    margin-bottom: 10px;
  }
</style>
