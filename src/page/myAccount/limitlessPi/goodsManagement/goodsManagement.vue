<template>
  <div class="page-limit">
    <!--竞拍商品管理-->
    <div class="flex-w-goods">
      <div class="title">{{$t('goodsManagement.text1')}}</div>
      <router-link to="/account/goodsManagement/goodsDetails" class="add-btn-goods">{{$t('goodsManagement.text3')}}</router-link>
    </div>
    <div class="content">
      <tab
        :tabIndex="tabIndex"
        :tabMenu="$t('goodsManagement.tabMenu')"
        @changeTab="changeTab"
      >
        <!-- 1. 竞拍中-->
        <div class="limit-table" slot="slot1">
          <table>
            <thead>
            <tr>
              <td v-for="(item, index) in $t('goodsManagement.tableData4')" :key="item" :class="{'first-thead': index === 0}">{{item}}</td>
            </tr>
            </thead>
            <v-loading v-show="loadingShow"></v-loading>
            <tbody>
            <tr v-for="(item, index) in goodsDataTime" :key="index" @click="$router.push({path: '/account/goodsManagement/goodsInfo', query: {id: item.id, status: item.status}})" class="cursor">
              <td class="img-wrap first-td">
                <div class="img-box">
                  <img :src="imgSrc(item.coverImg)" width="110" height="100" alt="">
                  <p>
                    <span>{{item.productName}}</span>
                  </p>
                </div>
              </td>
              <td>{{item.saleNum}}</td>
              <td>{{item.nowBidPrice | fourNumber}} π</td>
              <td>{{item.lastTime}}</td>
              <td :class="{'fild-goods': item.status === 7}">{{goodStatus(item.status)}}</td>
              <td class="red-color">{{$t('goodsManagement.text8')}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <!-- 2. 未开始-->
        <div class="limit-table" slot="slot2">
          <table>
            <thead>
            <tr>
              <td v-for="(item, index) in $t('goodsManagement.tableHead2')" :key="item" :class="{'first-thead': index === 0}">{{item}}</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in goodsData" :key="index" @click="$router.push({path: '/account/goodsManagement/goodsInfo', query: {id: item.id, status: item.status}})" class="cursor">
              <td class="img-wrap first-td">
                <div class="img-box">
                  <img :src="imgSrc(item.coverImg)" width="110" height="100" alt="">
                  <p>
                    <span>{{item.productName}}</span>
                  </p>
                </div>
              </td>
              <td>{{item.saleNum}}</td>
              <td>{{item.nowBidPrice | fourNumber}} π</td>
              <td>{{$changeDate(item.startSaleDate, '-', 8)}}</td>
              <td :class="{'fild-goods': item.status === 7}">{{goodStatus(item.status)}}</td>
              <td class="red-color">{{$t('goodsManagement.text8')}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <!-- 3. 已结束-->
        <div class="limit-table" slot="slot3">
          <table>
            <thead>
            <tr>
              <td v-for="(item, index) in $t('goodsManagement.tableData5')" :key="item" :class="{'first-thead': index === 0}">{{item}}</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in goodsData" :key="index" @click="$router.push({path: '/account/goodsManagement/goodsInfo', query: {id: item.id, status: item.status}})" class="cursor">
              <td class="img-wrap first-td">
                <div class="img-box">
                  <img :src="imgSrc(item.coverImg)" width="110" height="100" alt="">
                  <p>
                    <span>{{item.productName}}</span>
                  </p>
                </div>
              </td>
              <td>{{item.saleNum}}</td>
              <td>{{item.nowBidPrice | fourNumber}} π</td>
              <td>{{$changeDate(item.createAt, '-', 8)}}</td>
              <td :class="{'fild-goods': item.status === 7}">{{goodStatus(item.status)}}</td>
              <td class="red-color">{{$t('goodsManagement.text8')}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </tab>
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
export default {
  data () {
    return {
      timer2: null,
      totalPage: 0,
      loadingShow: true,
      tabIndex: 0,
      goodsData: [],
      goodsDataTime: [],
      noResult: false,
      pageSize: 10
    }
  },
  mounted () {
    this.getData(1, 1)
  },
  methods: {
    imgSrc (imgurl) {
      let newImg = imgurl.split(',')[0]
      if (imgurl && newImg.indexOf('http') > -1) {
        return newImg
      } else {
        return 'http://ofydu65mj.bkt.clouddn.com/' + newImg
      }
    },
    parentTurnPage (page) { // 页码
      this.current_page = page
      this.getData(this.tabIndex + 1, page)
    },
    changeTab (index) {
      this.goodsData = []
      this.tabIndex = index
      this.noResult = false
      if (this.$refs.turnPage1) {
        this.$refs.turnPage1.resetPage(1)
      }
      this.getData(index + 1, 1)
    },
    getData (queryType, pageIndex) { // 1.5 商家查询产品列表（商户端）
      this.$postAxios.post(`${this.$api2}infinite/merchantQueryProductList`, {
        queryType: queryType,
        pageIndex: pageIndex,
        pageSize: this.pageSize
      }).then(res => {
        this.loadingShow = false
        if (res.data.status === 'success') {
          let goodsData = res.data.data.infiniteSaleProductList
          this.totalPage = res.data.data.totalPage
          if (goodsData.length === 0) {
            this.noResult = true
          } else {
            this.noResult = false
            if (this.tabIndex === 0) {
              let goodsD = res.data.data.infiniteSaleProductList
              goodsD.forEach(item => {
                item.lastTime = '00:00:00'
                let times = item.bidLastTime
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
                    times = 0
                    item.lastTime = '00:00:00'
                    clearInterval(this.timer3)
                  }
                  this.goodsDataTime = goodsD
                }, 1000)
              })
            } else {
              clearInterval(this.timer3)
              this.goodsData = res.data.data.infiniteSaleProductList
            }
          }
        }
      }).catch(err => {
         console.log(err)
      })
    },
    goodStatus (status) { // 1待审核 2审核通过,待竞价 3审核未通过 4竞价结束 5取消竞价 6竞价中 7竞价失败
      if (status === 1) {
        return this.$t('goodsManagement.text46')
      }
      if (status === 2) {
        return this.$t('goodsManagement.text47')
      }
      if (status === 3) {
        return this.$t('goodsManagement.text48')
      }
      if (status === 4) {
        return this.$t('goodsManagement.text49')
      }
      if (status === 5) {
        return this.$t('goodsManagement.text50')
      }
      if (status === 6) {
        return this.$t('goodsManagement.text51')
      }
      if (status === 7) {
        return this.$t('goodsManagement.text52')
      }
    }
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
</style>
