<template>
  <div class="page-limit">
    <!--我的竞拍-->
    <div class="title">{{$t('goodsManagement.text54')}}</div>
    <div class="content">
      <tab
        :tabIndex="tabIndex"
        :tabMenu="$t('goodsManagement.tabMenu1')"
        @changeTab="changeTab"
      >
        <!-- 1. 竞拍中-->
        <div class="limit-table" slot="slot1">
          <table>
            <thead>
              <tr>
                <td v-for="(item, index) in $t('goodsManagement.tableData0')" :key="item" :class="{'first-thead': index === 0}">{{item}}</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in goodsData" :key="index" class="cursor" @click="$router.push({path: '/goodsParticular', query: {id: item.infiniteSaleProduct.id}})">
                <td class="img-wrap first-td">
                  <div class="img-box">
                    <img :src="imgUrlPro(item.infiniteSaleProduct.coverImg)" alt="" width="110" height="100" >
                    <span>{{item.infiniteSaleProduct.productName}}</span>
                  </div>
                </td>
                <td>{{item.infiniteSaleProduct.saleNum}}</td>
                <td>
                  {{item.infiniteSaleProduct.nowBidPrice | fourNumber}} π<br/>
                  {{item.infiniteSaleProduct.productUserName}}
                </td>
                <td>{{item.infiniteSaleProduct.merchantName}}</td>
                <td>{{item.lastTime}}</td>
                <td>{{goodStatus(item.infiniteSaleProduct.status)}}</td>
                <td class="red-color">{{$t('goodsManagement.text8')}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 2. 竞拍成功-->
        <div class="limit-table" slot="slot2">
          <table>
            <thead>
            <tr>
              <td v-for="(item, index) in $t('goodsManagement.tableData2')" :key="item" :class="{'first-thead': index === 0}">{{item}}</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in goodsData2" :key="index" @click="$router.push({path: '/goodsParticular', query: {id: item.infiniteSaleProduct.id}})" class="cursor">
              <td class="img-wrap first-td">
                <div class="img-box">
                  <img :src="imgUrlPro(item.infiniteSaleProduct.coverImg)" alt="" width="110" height="100" >
                  <span>{{item.infiniteSaleProduct.productName}}</span>
                </div>
              </td>
              <td>{{item.infiniteSaleProduct.saleNum}}</td>
              <td>
                {{item.infiniteSaleProduct.nowBidPrice | fourNumber}} π<br/>
                {{item.infiniteSaleProduct.productUserName}}
              </td>
              <td>{{item.infiniteSaleProduct.merchantName}}</td>
              <td>{{$changeDate(item.infiniteSaleProduct.endSaleDate, '-', 8)}}</td>
              <td class="red-color">{{$t('goodsManagement.text8')}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <!-- 3. 竞拍失败-->
        <div class="limit-table" slot="slot3">
          <table>
            <thead>
            <tr>
              <td v-for="(item, index) in $t('goodsManagement.tableData2')" :key="item" :class="{'first-thead': index === 0}">{{item}}</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in goodsData2" :key="index" @click="$router.push({path: '/goodsParticular', query: {id: item.infiniteSaleProduct.id}})" class="cursor">
              <td class="img-wrap first-td">
                <div class="img-box">
                  <img :src="imgUrlPro(item.infiniteSaleProduct.coverImg)" alt="" width="110" height="100" >
                  <span>{{item.infiniteSaleProduct.productName}}</span>
                </div>
              </td>
              <td>{{item.infiniteSaleProduct.saleNum}}</td>
              <td>
                {{item.infiniteSaleProduct.nowBidPrice | fourNumber}} π<br/>
                {{item.infiniteSaleProduct.productUserName}}
              </td>
              <td>{{item.infiniteSaleProduct.merchantName}}</td>
              <td>{{$changeDate(item.infiniteSaleProduct.endSaleDate, '-', 8)}}</td>
              <td class="red-color">{{$t('goodsManagement.text8')}}</td>
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
export default {
  data () {
    return {
      timer3: null,
      totalPage: 0,
      loadingShow: true,
      tabIndex: 0,
      goodsData: [],
      goodsData2: [],
      pageSize: 10,
      noResult: false
    }
  },
  components: {
    tab,
    vLoading: resolve => require(['@/components/loading.vue'], resolve),
    vTurnPage: resolve => require(['@/components/turnPage.vue'], resolve)
  },
  mounted () {
    this.getData(1, 1)
  },
  methods: {
    imgUrlPro (imgurl) {
      let newImg = imgurl.split(',')[0]
      if (imgurl && newImg.indexOf('http') > -1) {
        return newImg
      } else {
        return 'http://ofydu65mj.bkt.clouddn.com/' + newImg
      }
    },
    parentTurnPage (page) { // 页码
      this.getData(this.tabIndex + 1, page)
    },
    changeTab (index) {
      if (this.$refs.turnPage1) {
        this.$refs.turnPage1.resetPage(1)
      }
      this.loadingShow = true
      this.totalPage = 0
      this.goodsData = []
      this.goodsData2 = []
      this.tabIndex = index
      this.noResult = false
      this.getData(index + 1, 1)
    },
    getData (queryType, pageIndex) {
      this.noResult = false
      this.$postAxios.post(`${this.$api2}infinite/queryMyBidRecordList`, {
        queryType: queryType,
        pageIndex: pageIndex,
        pageSize: this.pageSize
      }).then(res => {
        this.loadingShow = false
        if (res.data.status === 'success') {
          let recordList
          if (queryType === 1) {
            recordList = res.data.data.infiniteBidList
            recordList.forEach(item => {
              item.lastTime = '00:00:00'
              let times = (item.infiniteSaleProduct.endSaleDate - new Date()) / 1000
              this.timer3 = setInterval(() => {
                times--
                if (times > 0) {
                  let hour = 0
                  let minute = 0
                  let second = 0 // 时间默认值
                  hour = Math.floor(times % (24 * 60 * 60) / (60 * 60))
                  minute = Math.floor(times % (24 * 60 * 60) % (60 * 60) / 60)
                  second = Math.floor(times % (24 * 60 * 60) % (60 * 60) % 60)
                  if (hour <= 9) hour = '0' + hour
                  if (minute <= 9) minute = '0' + minute
                  if (second <= 9) second = '0' + second
                  item.lastTime = `${hour}:${minute}:${second}`
                } else {
                  times = 0
                  item.lastTime = '00:00:00'
                  clearInterval(this.timer3)
                }
                this.goodsData = recordList
              }, 1000)
            })
            if (res.data.data.infiniteBidList.length === 0) {
              this.noResult = true
            } else {
              this.noResult = false
            }
          } else {
            clearInterval(this.timer3)
            this.goodsData2 = res.data.data.infiniteBidList
            if (res.data.data.infiniteBidList.length === 0) {
              this.noResult = true
            } else {
              this.noResult = false
            }
          }
          this.totalPage = res.data.data.totalPage
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
  beforeDestroy () {
    clearInterval(this.timer3)
  }
}
</script>

<style lang="less" scoped>
  @import '~@/assets/css/limitlessPi';
</style>
